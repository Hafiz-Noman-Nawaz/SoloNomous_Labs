import { Request, Response, NextFunction } from 'express';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { AppError } from './errorHandler';
import { User } from '../models/User';

let clerkClient: ReturnType<typeof createClerkClient> | null = null;

if (process.env.CLERK_SECRET_KEY) {
  clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
}

export interface AuthenticatedRequest extends Request {
  user?: {
    clerkId?: string;
    email: string;
    role: 'superadmin' | 'admin' | 'editor' | 'author';
    name?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Development fallback when Clerk keys are not configured yet
    if (!process.env.CLERK_SECRET_KEY || !clerkClient) {
      req.user = {
        clerkId: 'dev_admin_user_01',
        email: 'founder@solonomouslabs.com',
        name: 'Lead Architect (Dev Admin)',
        role: 'superadmin'
      };
      return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (process.env.NODE_ENV !== 'production') {
        req.user = {
          clerkId: 'dev_admin_user_01',
          email: 'founder@solonomouslabs.com',
          name: 'Lead Architect (Dev Admin)',
          role: 'superadmin'
        };
        return next();
      }
      throw new AppError('Authentication required: Missing Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify Clerk session token
    const verified = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    if (!verified || !verified.sub) {
      throw new AppError('Invalid or expired authentication token.', 401);
    }

    // Lookup user in MongoDB or create if syncing for first time
    let dbUser = await User.findOne({ clerkId: verified.sub });
    if (!dbUser) {
      // Fetch user details from Clerk
      const clerkUser = await clerkClient.users.getUser(verified.sub);
      const email = clerkUser.emailAddresses[0]?.emailAddress || `${verified.sub}@users.clerk.dev`;
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Team Member';
      
      dbUser = await User.create({
        clerkId: verified.sub,
        name,
        email,
        role: 'admin',
        avatar: clerkUser.imageUrl || ''
      });
    }

    req.user = {
      clerkId: dbUser.clerkId,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (allowedRoles: Array<'superadmin' | 'admin' | 'editor' | 'author'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access denied: Insufficient privileges.', 403));
    }

    next();
  };
};

import jwt from 'jsonwebtoken';
import { AdminUser, IAdminUser, IAdminPermissions } from '../models/AdminUser';

const JWT_SECRET = process.env.JWT_SECRET || 'solonomous_admin_jwt_secret_2026_x89a';

export interface AdminAuthenticatedRequest extends Request {
  adminUser?: IAdminUser;
}

export const requireAdminAuth = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required: Missing admin Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new AppError('Invalid or expired admin session token. Please log in again.', 401);
    }

    if (!decoded || !decoded.id) {
      throw new AppError('Invalid session payload.', 401);
    }

    const adminUser = await AdminUser.findById(decoded.id);
    if (!adminUser) {
      throw new AppError('Admin user account no longer exists.', 401);
    }

    if (!adminUser.active) {
      throw new AppError('Your administrative account has been deactivated.', 403);
    }

    req.adminUser = adminUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdminPermission = (permission: keyof IAdminPermissions) => {
  return (req: any, res: Response, next: NextFunction): void => {
    if (!req.adminUser) {
      return next(new AppError('Admin authentication required.', 401));
    }

    // Superadmin has absolute access to everything
    if (req.adminUser.role === 'superadmin') {
      return next();
    }

    // Check specific permission
    if (req.adminUser.permissions && req.adminUser.permissions[permission]) {
      return next();
    }

    return next(new AppError(`Access denied: You do not have permission to ${permission}.`, 403));
  };
};
