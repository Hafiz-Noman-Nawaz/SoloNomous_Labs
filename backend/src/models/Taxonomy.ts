import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    postCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);

export interface ITag extends Document {
  name: string;
  slug: string;
  postCount: number;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    postCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Tag = mongoose.model<ITag>('Tag', TagSchema);
