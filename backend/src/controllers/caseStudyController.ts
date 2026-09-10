import { Request, Response, NextFunction } from 'express';
import { CaseStudy } from '../models/CaseStudy';
import { AppError } from '../middleware/errorHandler';
import slugify from 'slugify';

export class CaseStudyController {
  /**
   * Public: List published case studies
   */
  public static async getCaseStudies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const featured = req.query.featured === 'true';
      const query: any = { published: true };
      if (featured) {
        query.featured = true;
      }

      const caseStudies = await CaseStudy.find(query)
        .populate('relatedServices', 'title slug icon')
        .sort({ displayOrder: 1, createdAt: -1 });

      res.json({
        success: true,
        data: caseStudies
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: Get case study by slug
   */
  public static async getCaseStudyBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const caseStudy = await CaseStudy.findOne({ slug, published: true })
        .populate('relatedServices', 'title slug icon summary');

      if (!caseStudy) {
        throw new AppError('Case study not found', 404);
      }

      res.json({
        success: true,
        data: caseStudy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: List all case studies
   */
  public static async getAllCaseStudiesAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const caseStudies = await CaseStudy.find()
        .populate('relatedServices', 'title')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: caseStudies
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Create case study
   */
  public static async createCaseStudy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studySlug = req.body.slug
        ? slugify(req.body.slug, { lower: true, strict: true })
        : slugify(req.body.title, { lower: true, strict: true });

      const heroImageUrl = req.body.heroImage?.url || (typeof req.body.featuredImage === 'string' ? req.body.featuredImage : req.body.featuredImage?.url) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';

      const results = req.body.results || (req.body.metrics && Array.isArray(req.body.metrics)
        ? req.body.metrics.map((m: any) => ({ metric: m.value || m.metric || '10x', label: m.label || 'Gain' }))
        : [{ metric: '10x', label: 'Efficiency' }]);

      const normalizedPayload = {
        ...req.body,
        slug: studySlug,
        clientName: req.body.clientName || req.body.client || 'Enterprise Partner',
        heroImage: { url: heroImageUrl },
        overview: req.body.overview || req.body.challenge || req.body.summary || '',
        challenge: req.body.challenge || req.body.overview || '',
        strategy: req.body.strategy || req.body.solution || req.body.overview || '',
        architectureDetails: req.body.architectureDetails || req.body.solution || '',
        results
      };

      const caseStudy = await CaseStudy.create(normalizedPayload);

      res.status(201).json({
        success: true,
        message: 'Case study created successfully',
        data: caseStudy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Update case study
   */
  public static async updateCaseStudy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: any = { ...req.body };

      if (req.body.title && !req.body.slug) {
        updateData.slug = slugify(req.body.title, { lower: true, strict: true });
      }

      if (req.body.client && !req.body.clientName) {
        updateData.clientName = req.body.client;
      }

      if (req.body.featuredImage) {
        const url = typeof req.body.featuredImage === 'string' ? req.body.featuredImage : req.body.featuredImage.url;
        if (url) updateData.heroImage = { url };
      }

      if (req.body.solution) {
        if (!updateData.strategy) updateData.strategy = req.body.solution;
        if (!updateData.architectureDetails) updateData.architectureDetails = req.body.solution;
      }

      if (req.body.metrics && Array.isArray(req.body.metrics)) {
        updateData.results = req.body.metrics.map((m: any) => ({ metric: m.value || m.metric || '10x', label: m.label || 'Gain' }));
      }

      const caseStudy = await CaseStudy.findByIdAndUpdate(id, updateData, { new: true });
      if (!caseStudy) {
        throw new AppError('Case study not found', 404);
      }

      res.json({
        success: true,
        message: 'Case study updated successfully',
        data: caseStudy
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Delete case study
   */
  public static async deleteCaseStudy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const caseStudy = await CaseStudy.findByIdAndDelete(id);
      if (!caseStudy) {
        throw new AppError('Case study not found', 404);
      }

      res.json({
        success: true,
        message: 'Case study deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
