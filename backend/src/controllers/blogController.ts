import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { BlogPost, IBlogPost } from '../models/BlogPost';
import { Category, Tag } from '../models/Taxonomy';
import { blogPostSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import slugify from 'slugify';

export class BlogController {
  /**
   * Public: List published blog posts with search and filtering
   */
  public static async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categorySlug = req.query.category as string;
      const tagSlug = req.query.tag as string;
      const search = req.query.search as string;
      const featured = req.query.featured === 'true';

      const query: any = { status: 'published' };

      if (featured) {
        query.featured = true;
      }

      if (categorySlug) {
        const cat = await Category.findOne({ slug: categorySlug });
        if (cat) {
          query.category = cat._id;
        }
      }

      if (tagSlug) {
        const t = await Tag.findOne({ slug: tagSlug });
        if (t) {
          query.tags = t._id;
        }
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await BlogPost.countDocuments(query);
      const posts = await BlogPost.find(query)
        .populate('author', 'name avatar role')
        .populate('category', 'name slug')
        .populate('tags', 'name slug')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.json({
        success: true,
        data: posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Get single blog post by slug and fetch related articles
   */
  public static async getPostBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;

      const post = await BlogPost.findOne({ slug, status: 'published' })
        .populate('author', 'name avatar bio role')
        .populate('category', 'name slug description')
        .populate('tags', 'name slug');

      if (!post) {
        throw new AppError('Blog post not found', 404);
      }

      // Increment view count asynchronously
      BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec();

      // Related articles in same category
      const relatedPosts = await BlogPost.find({
        category: post.category,
        _id: { $ne: post._id },
        status: 'published'
      })
        .select('title slug excerpt featuredImage readingTimeMinutes publishedAt')
        .limit(3);

      res.json({
        success: true,
        data: post,
        relatedPosts
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: List all blog posts (including drafts)
   */
  public static async getAdminPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const posts = await BlogPost.find()
        .populate('author', 'name email')
        .populate('category', 'name')
        .populate('tags', 'name')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Create new blog post with automatic slug & social repurposing generator
   */
  public static async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = blogPostSchema.parse(req.body);
      const postSlug = validated.slug
        ? slugify(validated.slug, { lower: true, strict: true })
        : slugify(validated.title, { lower: true, strict: true });

      // Generate social derivative drafts if not explicitly provided
      const social = validated.socialDerivatives || {};
      if (!social.linkedInPost) {
        social.linkedInPost = `🚀 ${validated.title}\n\n${validated.excerpt}\n\nKey takeaways inside our latest engineering breakdown at SoloNomous Labs. Link in comments.\n\n#SoftwareEngineering #TechInnovation #SoloNomousLabs`;
      }
      if (!social.xPost) {
        social.xPost = `Breakdown: "${validated.title}" ⚡\n\n${validated.excerpt.slice(0, 180)}...\n\nRead the full pillar analysis on our lab blog:`;
      }
      if (!social.instagramCaption) {
        social.instagramCaption = `Behind the code: ${validated.title} 🔬\n\nSwipe to explore architecture diagrams and technical insights.\n\n#Coding #SoftwareArchitect #SoloNomousLabs`;
      }

      // Resolve tags
      let resolvedTags: any[] = [];
      if (validated.tags && validated.tags.length > 0) {
        resolvedTags = await Promise.all(
          validated.tags.map(async (t: string) => {
            if (mongoose.isValidObjectId(t)) return t;
            const tagSlug = slugify(t, { lower: true, strict: true });
            let tagDoc = await Tag.findOne({ slug: tagSlug });
            if (!tagDoc) {
              tagDoc = await Tag.create({ name: t, slug: tagSlug });
            }
            return tagDoc._id;
          })
        );
      }

      const authorId = (req as any).adminUser?._id || (req as any).user?._id || req.body.author;

      const post = await BlogPost.create({
        ...validated,
        slug: postSlug,
        author: authorId,
        authorModel: (req as any).adminUser ? 'AdminUser' : 'User',
        tags: resolvedTags,
        socialDerivatives: social,
        publishedAt: validated.status === 'published' ? new Date() : undefined
      });

      // Increment category count
      await Category.findByIdAndUpdate(validated.category, { $inc: { postCount: 1 } });

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Update post
   */
  public static async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const post = await BlogPost.findById(id);
      if (!post) {
        throw new AppError('Post not found', 404);
      }

      const validated = blogPostSchema.partial().parse(req.body);

      if (validated.title && !validated.slug) {
        post.slug = slugify(validated.title, { lower: true, strict: true });
      } else if (validated.slug) {
        post.slug = slugify(validated.slug, { lower: true, strict: true });
      }

      if (validated.status === 'published' && post.status !== 'published') {
        post.publishedAt = new Date();
      }

      if (validated.tags && validated.tags.length > 0) {
        const resolvedTags = await Promise.all(
          validated.tags.map(async (t: string) => {
            if (mongoose.isValidObjectId(t)) return t;
            const tagSlug = slugify(t, { lower: true, strict: true });
            let tagDoc = await Tag.findOne({ slug: tagSlug });
            if (!tagDoc) {
              tagDoc = await Tag.create({ name: t, slug: tagSlug });
            }
            return tagDoc._id;
          })
        );
        post.tags = resolvedTags as any;
      }

      Object.assign(post, validated);
      await post.save();

      res.json({
        success: true,
        message: 'Blog post updated successfully',
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Delete post
   */
  public static async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const post = await BlogPost.findByIdAndDelete(id);
      if (!post) {
        throw new AppError('Post not found', 404);
      }
      await Category.findByIdAndUpdate(post.category, { $inc: { postCount: -1 } });

      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public/CMS: Categories and Tags
   */
  public static async getTaxonomies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [categories, tags] = await Promise.all([
        Category.find().sort({ name: 1 }),
        Tag.find().sort({ name: 1 })
      ]);

      res.json({
        success: true,
        data: { categories, tags }
      });
    } catch (error) {
      next(error);
    }
  }
}
