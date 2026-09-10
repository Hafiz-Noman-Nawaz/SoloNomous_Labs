import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  type: 'project_inquiry' | 'start_a_project' | 'quote' | 'chat_escalation' | 'consultation';
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterested?: string;
  budgetRange?: string;
  timeline?: string;
  projectDescription: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  source: string;
  landingPage?: string;
  utmParameters?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  };
  notes: Array<{
    author: string;
    content: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    type: { 
      type: String, 
      enum: ['project_inquiry', 'start_a_project', 'quote', 'chat_escalation', 'consultation'], 
      default: 'start_a_project' 
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    serviceInterested: { type: String, default: '' },
    budgetRange: { type: String, default: '' },
    timeline: { type: String, default: '' },
    projectDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
      default: 'new',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    source: { type: String, default: 'website' },
    landingPage: { type: String, default: '/' },
    utmParameters: {
      utmSource: { type: String, default: '' },
      utmMedium: { type: String, default: '' },
      utmCampaign: { type: String, default: '' },
      utmTerm: { type: String, default: '' },
      utmContent: { type: String, default: '' }
    },
    notes: [
      {
        author: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  expectedTimeline?: string;
  source: string;
  read: boolean;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    expectedTimeline: { type: String, default: 'Immediately' },
    source: { type: String, default: 'contact_page' },
    read: { type: Boolean, default: false },
    ipAddress: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ContactSubmission = mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
