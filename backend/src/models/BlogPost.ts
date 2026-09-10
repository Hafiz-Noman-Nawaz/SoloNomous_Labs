import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: {
    url: string;
    publicId?: string;
    altText?: string;
  };
  author?: Types.ObjectId;
  authorModel?: string;
  category: Types.ObjectId;
  tags: Types.ObjectId[];
  readingTimeMinutes: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  featured: boolean;
  views: number;
  seoMetadata: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
    keywords?: string[];
  };
  socialDerivatives: {
    instagramCaption?: string;
    facebookPost?: string;
    linkedInPost?: string;
    xPost?: string;
    hooks?: string[];
    carouselSlides?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
      altText: { type: String, default: '' }
    },
    author: { type: Schema.Types.ObjectId, refPath: 'authorModel', required: false },
    authorModel: { type: String, enum: ['User', 'AdminUser'], default: 'AdminUser' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    readingTimeMinutes: { type: Number, default: 5 },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'archived'], 
      default: 'draft',
      index: true 
    },
    publishedAt: { type: Date, index: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    seoMetadata: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      canonicalUrl: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      keywords: [{ type: String }]
    },
    socialDerivatives: {
      instagramCaption: { type: String, default: '' },
      facebookPost: { type: String, default: '' },
      linkedInPost: { type: String, default: '' },
      xPost: { type: String, default: '' },
      hooks: [{ type: String }],
      carouselSlides: [{ type: String }]
    }
  },
  { timestamps: true }
);

// Full text search index on title, excerpt, and content
BlogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
