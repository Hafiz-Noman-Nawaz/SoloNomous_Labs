import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  summary: string;
  badge?: string;
  icon: string;
  heroImage?: string;
  problemStatement: string;
  solutionStatement: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  deliverables: string[];
  techStack: string[];
  processSteps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  pricingModel: 'inquiry' | 'quote' | 'fixed_starting' | 'retainer';
  startingPrice?: number;
  pricingInterval?: 'one_time' | '/month' | '/year' | '/week' | '';
  currency?: string;
  category?: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  displayOrder: number;
  active: boolean;
  featured: boolean;
  seoMetadata: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    summary: { type: String, required: true },
    badge: { type: String, default: '' },
    icon: { type: String, default: 'Cpu' },
    heroImage: { type: String, default: '' },
    problemStatement: { type: String, required: true },
    solutionStatement: { type: String, required: true },
    features: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true }
      }
    ],
    deliverables: [{ type: String }],
    techStack: [{ type: String }],
    processSteps: [
      {
        step: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true }
      }
    ],
    pricingModel: {
      type: String,
      enum: ['inquiry', 'quote', 'fixed_starting', 'retainer'],
      default: 'quote'
    },
    startingPrice: { type: Number },
    pricingInterval: {
      type: String,
      enum: ['one_time', '/month', '/year', '/week', ''],
      default: 'one_time'
    },
    currency: { type: String, default: 'USD' },
    category: { type: String, default: 'Web & Product' },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false },
    seoMetadata: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);
