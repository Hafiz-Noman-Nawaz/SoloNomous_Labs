import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  heroImage: {
    url: string;
    publicId?: string;
    altText?: string;
  };
  overview: string;
  challenge: string;
  strategy: string;
  architectureDetails: string;
  results: Array<{
    metric: string;
    label: string;
  }>;
  deliverables: string[];
  techStack: string[];
  relatedServices: Types.ObjectId[];
  displayOrder: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    clientName: { type: String, default: 'Enterprise Client' },
    industry: { type: String, default: 'Technology' },
    duration: { type: String, default: '8 Weeks' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    heroImage: {
      url: { type: String, default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
      publicId: { type: String, default: '' },
      altText: { type: String, default: '' }
    },
    overview: { type: String, default: '' },
    challenge: { type: String, default: '' },
    strategy: { type: String, default: '' },
    architectureDetails: { type: String, default: '' },
    results: [
      {
        metric: { type: String, default: '10x' },
        label: { type: String, default: 'Efficiency' }
      }
    ],
    deliverables: [{ type: String }],
    techStack: [{ type: String }],
    relatedServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const CaseStudy = mongoose.model<ICaseStudy>('CaseStudy', CaseStudySchema);
