import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  slug: string;
  badge?: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  discountText?: string;
  period: string;
  description: string;
  deliverables: string[];
  popular: boolean;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    badge: { type: String, default: '' },
    price: { type: String, required: true, trim: true },
    originalPrice: { type: String, default: '' },
    discountPercentage: { type: Number, default: 0 },
    discountText: { type: String, default: '' },
    period: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    deliverables: [{ type: String }],
    popular: { type: Boolean, default: false },
    ctaText: { type: String, default: 'Kickoff Sprint' },
    ctaLink: { type: String, default: '/contact' },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const Package = mongoose.model<IPackage>('Package', PackageSchema);
