import { Request, Response, NextFunction } from 'express';
import { Lead, ContactSubmission } from '../models/Lead';
import { leadValidationSchema, contactValidationSchema } from '../utils/validators';
import { EmailService } from '../services/emailService';
import { WhatsAppService } from '../services/whatsAppService';
import { AppError } from '../middleware/errorHandler';

export class LeadController {
  /**
   * Submit a new lead / project inquiry / service order
   */
  public static async createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = leadValidationSchema.parse(req.body);

      const lead = await Lead.create({
        ...validatedData,
        status: 'new',
        priority: validatedData.budgetRange && validatedData.budgetRange.includes('$10k') ? 'high' : 'medium'
      });

      const serviceTitle = lead.serviceInterested || lead.projectType || 'Full-Stack Architecture';
      const whatsappText = `🚀 *NEW SERVICE ORDER ALERT*
━━━━━━━━━━━━━━━━━━━━━
💼 *Service:* ${serviceTitle}
👤 *Client:* ${lead.fullName}
📧 *Email:* ${lead.email}
📱 *Phone:* ${lead.phone || 'None'}
🏢 *Company:* ${lead.company || 'Private'}
💰 *Budget:* ${lead.budgetRange || 'Pending'}
⏱️ *Timeline:* ${lead.timeline || '4-8 Weeks'}
📝 *Requirements:*
"${(lead.projectDescription || '').substring(0, 300)}"
━━━━━━━━━━━━━━━━━━━━━
🕒 ${new Date().toLocaleString()}`;

      // Dispatch Email & WhatsApp alerts
      await EmailService.sendServiceOrderAlert(lead);
      const waResult = await WhatsAppService.sendAlert(whatsappText);

      res.status(201).json({
        success: true,
        message: 'Your project brief and service selection have been received. We will review and respond within 4 business hours.',
        data: {
          leadId: lead._id,
          fullName: lead.fullName,
          email: lead.email,
          createdAt: lead.createdAt,
          whatsappDirectUrl: waResult.directUrl
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit contact form
   */
  public static async submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = contactValidationSchema.parse(req.body);

      const contact = await ContactSubmission.create({
        ...validated,
        ipAddress: req.ip
      });

      const whatsappText = `📨 *NEW CLIENT CONTACT MESSAGE*
━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${contact.name}
📧 *Email:* ${contact.email}
📱 *Phone:* ${contact.phone || 'None'}
📋 *Subject:* ${contact.subject || 'General Inquiry'}
⏱️ *Timeline:* ${contact.expectedTimeline || 'Flexible'}
💬 *Message:*
"${(contact.message || '').substring(0, 400)}"
━━━━━━━━━━━━━━━━━━━━━
🕒 ${new Date().toLocaleString()}`;

      // Dispatch Email & WhatsApp alerts
      await EmailService.sendContactAlert(contact);
      const waResult = await WhatsAppService.sendAlert(whatsappText);

      res.status(201).json({
        success: true,
        message: 'Thank you. Your message has reached our team via Email and WhatsApp. Expect a response shortly.',
        data: {
          id: contact._id,
          whatsappDirectUrl: waResult.directUrl
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Get all leads with filtering & pagination
   */
  public static async getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Lead.countDocuments(query);
      const leads = await Lead.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.json({
        success: true,
        data: leads,
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
   * CMS: Update lead status or add notes
   */
  public static async updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, priority, note } = req.body;

      const lead = await Lead.findById(id);
      if (!lead) {
        throw new AppError('Lead not found', 404);
      }

      if (status) lead.status = status;
      if (priority) lead.priority = priority;
      if (note && note.trim()) {
        lead.notes.push({
          author: (req as any).user?.name || 'Admin',
          content: note.trim(),
          createdAt: new Date()
        });
      }

      await lead.save();

      res.json({
        success: true,
        message: 'Lead updated successfully',
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Get all contact submissions
   */
  public static async getContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contacts = await ContactSubmission.find().sort({ createdAt: -1 }).limit(100);
      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CMS: Delete a lead
   */
  public static async deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const lead = await Lead.findByIdAndDelete(id);
      if (!lead) {
        throw new AppError('Lead not found', 404);
      }
      res.json({
        success: true,
        message: 'Lead inquiry deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
