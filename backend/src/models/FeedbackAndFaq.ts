import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  serviceRef?: Types.ObjectId;
  featured: boolean;
  active: boolean;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    avatar: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    serviceRef: { type: Schema.Types.ObjectId, ref: 'Service' },
    featured: { type: Boolean, default: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: 'general' | 'services' | 'pricing' | 'process' | 'technology';
  displayOrder: number;
  active: boolean;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ['general', 'services', 'pricing', 'process', 'technology'],
      default: 'general'
    },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);

export interface INewsletterSubscriber extends Document {
  email: string;
  consent: boolean;
  source: string;
  status: 'active' | 'unsubscribed';
  unsubscribedAt?: Date;
  createdAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    consent: { type: Boolean, default: true },
    source: { type: String, default: 'website_footer' },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
    unsubscribedAt: { type: Date }
  },
  { timestamps: true }
);

export const NewsletterSubscriber = mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);
