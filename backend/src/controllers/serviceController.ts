import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/Service';
import { CaseStudy } from '../models/CaseStudy';
import { Category } from '../models/Taxonomy';
import { serviceSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import slugify from 'slugify';

export class ServiceController {
  /**
   * Public: List all active services ordered by displayOrder, optionally filtered by category
   */
  public static async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.query;
      const query: any = { active: true };

      if (category && typeof category === 'string') {
        const trimmed = category.trim();
        const matchedCategory = await Category.findOne({
          $or: [
            { slug: trimmed.toLowerCase() },
            { name: new RegExp(`^${trimmed}$`, 'i') }
          ]
        });

        if (matchedCategory) {
          query.category = matchedCategory.name;
        } else {
          // Fallback regex match on category field
          const regexSafe = trimmed.replace(/[-_]/g, '.*');
          query.category = new RegExp(regexSafe, 'i');
        }
      }

      const services = await Service.find(query).sort({ displayOrder: 1, createdAt: 1 });
      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: List all categories with their active services count
   */
  public static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await Category.find().sort({ createdAt: 1 });
      
      const categoriesWithCount = await Promise.all(
        categories.map(async (cat) => {
          const count = await Service.countDocuments({
            active: true,
            category: cat.name
          });
          return {
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            serviceCount: count
          };
        })
      );

      res.json({
        success: true,
        data: categoriesWithCount
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Get service by slug with related case studies
   */
  public static async getServiceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const service = await Service.findOne({ slug, active: true });
      if (!service) {
        throw new AppError('Service not found', 404);
      }

      // Fetch related case studies if any
      const relatedCaseStudies = await CaseStudy.find({
        relatedServices: service._id,
        published: true
      })
        .select('title slug clientName industry results heroImage')
        .limit(2);

      res.json({
        success: true,
        data: service,
        relatedCaseStudies
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: List all services (active + inactive)
   */
  public static async getAllServicesAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Create service
   */
  public static async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = serviceSchema.parse(req.body);
      const serviceSlug = validated.slug
        ? slugify(validated.slug, { lower: true, strict: true })
        : slugify(validated.title, { lower: true, strict: true });

      const service = await Service.create({
        ...validated,
        slug: serviceSlug
      });

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: service
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Update service
   */
  public static async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = serviceSchema.partial().parse(req.body);

      const service = await Service.findByIdAndUpdate(id, validated, { new: true });
      if (!service) {
        throw new AppError('Service not found', 404);
      }

      res.json({
        success: true,
        message: 'Service updated successfully',
        data: service
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Delete service
   */
  public static async deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const service = await Service.findByIdAndDelete(id);
      if (!service) {
        throw new AppError('Service not found', 404);
      }

      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
