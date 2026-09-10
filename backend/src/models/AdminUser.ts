import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminPermissions {
  canManageLeads: boolean;
  canManageBlog: boolean;
  canManageServices: boolean;
  canManageCaseStudies: boolean;
  canManageKnowledge: boolean;
  canManageSettings: boolean;
  canManageTeam: boolean;
}

export interface IAdminUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'manager' | 'employee';
  permissions: IAdminPermissions;
  active: boolean;
  lastLogin?: Date;
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const AdminPermissionsSchema = new Schema<IAdminPermissions>(
  {
    canManageLeads: { type: Boolean, default: false },
    canManageBlog: { type: Boolean, default: false },
    canManageServices: { type: Boolean, default: false },
    canManageCaseStudies: { type: Boolean, default: false },
    canManageKnowledge: { type: Boolean, default: false },
    canManageSettings: { type: Boolean, default: false },
    canManageTeam: { type: Boolean, default: false },
  },
  { _id: false }
);

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['superadmin', 'manager', 'employee'],
      default: 'employee',
      index: true
    },
    permissions: {
      type: AdminPermissionsSchema,
      default: () => ({
        canManageLeads: false,
        canManageBlog: false,
        canManageServices: false,
        canManageCaseStudies: false,
        canManageKnowledge: false,
        canManageSettings: false,
        canManageTeam: false
      })
    },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

AdminUserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
