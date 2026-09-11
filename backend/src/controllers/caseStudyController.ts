import { Request, Response, NextFunction } from 'express';
import { CaseStudy } from '../models/CaseStudy';
import { AppError } from '../middleware/errorHandler';
import slugify from 'slugify';

function parseResultsHelper(rawResults: any, rawMetricString?: string): Array<{ metric: string; label: string }> {
  const items: Array<{ metric: string; label: string }> = [];

  const parseString = (str: string) => {
    const trimmed = str.trim();
    if (!trimmed) return;

    const leadingMetricMatch = trimmed.match(
      /^([~<>±]?\$?\d+(?:\.\d+)?(?:[xX%+]|ms|s|k|M|B|k\+|M\+)?)\s*(.*)$/i
    );
    if (leadingMetricMatch && leadingMetricMatch[1]) {
      const metric = leadingMetricMatch[1].trim();
      const label = leadingMetricMatch[2]?.trim() || 'Key Impact';
      items.push({ metric, label });
      return;
    }

    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      items.push({
        label: parts[0].trim(),
        metric: parts.slice(1).join(':').trim()
      });
      return;
    }

    const words = trimmed.split(/\s+/);
    if (words.length <= 2) {
      items.push({ metric: trimmed, label: 'Key Outcome' });
    } else {
      items.push({ metric: words[0], label: words.slice(1).join(' ') });
    }
  };

  if (typeof rawMetricString === 'string' && rawMetricString.trim()) {
    rawMetricString.split(',').forEach(parseString);
  }

  if (Array.isArray(rawResults) && rawResults.length > 0) {
    rawResults.forEach((r: any) => {
      const metricStr = typeof r === 'string' ? r : (r.metric || r.value || '');
      const labelStr = typeof r === 'object' ? (r.label || '') : '';
      if (metricStr.includes(',')) {
        metricStr.split(',').forEach(parseString);
      } else if (metricStr) {
        if (!labelStr || labelStr.toLowerCase() === 'outcome' || labelStr.toLowerCase() === 'gain') {
          parseString(metricStr);
        } else {
          items.push({ metric: metricStr, label: labelStr });
        }
      }
    });
  }

  return items.length > 0 ? items : [{ metric: '10x', label: 'Efficiency' }];
}

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

      const results = parseResultsHelper(req.body.results || req.body.metrics, req.body.resultsMetric);

      let techStack = req.body.techStack;
      if (typeof techStack === 'string') {
        techStack = techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (!Array.isArray(techStack)) {
        techStack = [];
      }

      const startDate = req.body.startDate || '';
      const endDate = req.body.endDate || '';
      const duration = req.body.duration || (startDate ? `${startDate} – ${endDate || 'Present'}` : '8 Weeks');

      const normalizedPayload = {
        ...req.body,
        slug: studySlug,
        clientName: req.body.clientName || req.body.client || 'Enterprise Partner',
        heroImage: { url: heroImageUrl },
        overview: req.body.overview || req.body.challenge || req.body.summary || '',
        challenge: req.body.challenge || req.body.overview || '',
        strategy: req.body.strategy || req.body.solution || req.body.overview || '',
        architectureDetails: req.body.architectureDetails || req.body.solution || '',
        techStack,
        startDate,
        endDate,
        duration,
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

      if (req.body.heroImage?.url) {
        updateData.heroImage = { url: req.body.heroImage.url };
      } else if (req.body.featuredImage) {
        const url = typeof req.body.featuredImage === 'string' ? req.body.featuredImage : req.body.featuredImage.url;
        if (url) updateData.heroImage = { url };
      }

      if (req.body.techStack !== undefined) {
        let techStack = req.body.techStack;
        if (typeof techStack === 'string') {
          techStack = techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        updateData.techStack = techStack;
      }

      if (req.body.startDate !== undefined) updateData.startDate = req.body.startDate;
      if (req.body.endDate !== undefined) updateData.endDate = req.body.endDate;
      if (req.body.startDate || req.body.endDate) {
        const s = req.body.startDate || '';
        const e = req.body.endDate || 'Present';
        if (s) updateData.duration = `${s} – ${e}`;
      }

      if (req.body.solution) {
        if (!updateData.strategy) updateData.strategy = req.body.solution;
        if (!updateData.architectureDetails) updateData.architectureDetails = req.body.solution;
      }

      if (req.body.results || req.body.metrics || req.body.resultsMetric) {
        updateData.results = parseResultsHelper(req.body.results || req.body.metrics, req.body.resultsMetric);
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
