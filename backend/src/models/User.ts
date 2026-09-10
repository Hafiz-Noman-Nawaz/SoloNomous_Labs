import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  clerkId?: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'superadmin' | 'admin' | 'editor' | 'author';
  bio?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    avatar: { type: String, default: '' },
    role: { 
      type: String, 
      enum: ['superadmin', 'admin', 'editor', 'author'], 
      default: 'admin' 
    },
    bio: { type: String, default: '' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
