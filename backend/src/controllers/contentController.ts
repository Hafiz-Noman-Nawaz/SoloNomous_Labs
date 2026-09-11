import { Request, Response, NextFunction } from 'express';
import { FAQ, Testimonial, NewsletterSubscriber } from '../models/FeedbackAndFaq';
import { KnowledgeDocument } from '../models/KnowledgeAndChat';
import { SiteSettings, Media } from '../models/SiteSettingsAndMedia';
import { CloudinaryService } from '../services/cloudinaryService';
import { knowledgeDocumentSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';

export class ContentController {
  /**
   * FAQs
   */
  public static async getFaqs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string;
      const query: any = { active: true };
      if (category && category !== 'all') {
        query.category = category;
      }
      const faqs = await FAQ.find(query).sort({ displayOrder: 1, createdAt: -1 });
      res.json({ success: true, data: faqs });
    } catch (error) {
      next(error);
    }
  }

  public static async createFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faq = await FAQ.create(req.body);
      res.status(201).json({ success: true, data: faq });
    } catch (error) {
      next(error);
    }
  }

  public static async updateFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, data: faq });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await FAQ.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Testimonials
   */
  public static async getTestimonials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter = req.query.all === 'true' ? {} : { active: true };
      const testimonials = await Testimonial.find(filter).sort({ rating: -1, createdAt: -1 });
      res.json({ success: true, data: testimonials });
    } catch (error) {
      next(error);
    }
  }

  public static async createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonial = await Testimonial.create(req.body);
      res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
      next(error);
    }
  }

  public static async submitClientReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clientName, role, company, content, rating } = req.body;
      if (!clientName || !content) {
        throw new AppError('Client name and review content are required.', 400);
      }

      const testimonial = await Testimonial.create({
        clientName: clientName.trim(),
        role: role?.trim() || 'Verified Client',
        company: company?.trim() || 'Independent Partner',
        content: content.trim(),
        rating: Math.max(1, Math.min(5, Number(rating) || 5)),
        featured: true,
        active: true
      });

      res.status(201).json({
        success: true,
        message: 'Thank you for your rating and review! It has been recorded.',
        data: testimonial
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!testimonial) throw new AppError('Testimonial not found', 404);
      res.json({ success: true, data: testimonial });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
      if (!testimonial) throw new AppError('Testimonial not found', 404);
      res.json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Newsletter Subscribe
   */
  public static async subscribeNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, source } = req.body;
      if (!email) throw new AppError('Email is required', 400);

      const subscriber = await NewsletterSubscriber.findOneAndUpdate(
        { email: email.toLowerCase() },
        { email: email.toLowerCase(), consent: true, status: 'active', source: source || 'website' },
        { upsert: true, new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Subscribed to SoloNomous Labs research and engineering dispatches.',
        data: { email: subscriber.email }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Site Settings
   */
  public static async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create({});
      }
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  public static async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create(req.body);
      } else {
        Object.assign(settings, req.body);
        await settings.save();
      }
      res.json({ success: true, message: 'Settings saved', data: settings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Knowledge Documents (for RAG Chatbot)
   */
  public static async getKnowledgeDocs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const docs = await KnowledgeDocument.find().sort({ updatedAt: -1 });
      res.json({ success: true, data: docs });
    } catch (error) {
      next(error);
    }
  }

  public static async createKnowledgeDoc(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = knowledgeDocumentSchema.parse(req.body);
      const doc = await KnowledgeDocument.create(validated);
      res.status(201).json({ success: true, data: doc });
    } catch (error) {
      next(error);
    }
  }

  public static async updateKnowledgeDoc(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = await KnowledgeDocument.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, data: doc });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteKnowledgeDoc(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await KnowledgeDocument.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Knowledge document deleted' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Media Upload & Catalog
   */
  public static async uploadMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = (req as any).file;
      if (!file) {
        throw new AppError('No file uploaded', 400);
      }

      const altText = req.body.altText || file.originalname;
      const folder = req.body.folder || 'solonomous-labs';

      const result = await CloudinaryService.uploadBuffer(file.buffer, file.originalname, folder, altText);

      res.status(201).json({
        success: true,
        message: 'Media uploaded successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMediaList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const media = await Media.find().sort({ createdAt: -1 }).limit(100);
      res.json({ success: true, data: media });
    } catch (error) {
      next(error);
    }
  }
}
