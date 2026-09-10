import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser, IAdminUser } from '../models/AdminUser';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'solonomous_admin_jwt_secret_2026_x89a';
const TOKEN_EXPIRY = '7d';

export class AdminAuthController {
  /**
   * Check if the superadmin account has already been initialized
   */
  public static async getSetupStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const superadminCount = await AdminUser.countDocuments({ role: 'superadmin' });
      res.json({
        success: true,
        data: {
          hasSuperadmin: superadminCount > 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * One-time setup for the initial Master Superadmin account (Noman Nawaz)
   */
  public static async setupSuperadmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const superadminCount = await AdminUser.countDocuments({ role: 'superadmin' });
      if (superadminCount > 0) {
        throw new AppError('The Superadmin account has already been initialized. Please sign in.', 400);
      }

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new AppError('Name, email, and password are required for initial setup.', 400);
      }

      if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters long.', 400);
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const superadmin = await AdminUser.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'superadmin',
        permissions: {
          canManageLeads: true,
          canManageBlog: true,
          canManageServices: true,
          canManageCaseStudies: true,
          canManageKnowledge: true,
          canManageSettings: true,
          canManageTeam: true
        },
        active: true,
        lastLogin: new Date()
      });

      const token = jwt.sign(
        {
          id: superadmin._id,
          email: superadmin.email,
          role: superadmin.role
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      res.status(201).json({
        success: true,
        message: 'Superadmin account created successfully.',
        data: {
          token,
          adminUser: {
            id: superadmin._id,
            name: superadmin.name,
            email: superadmin.email,
            role: superadmin.role,
            permissions: superadmin.permissions
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in an existing Admin, Manager, or Employee
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Please provide both email and password.', 400);
      }

      const adminUser = await AdminUser.findOne({ email: email.toLowerCase().trim() });
      if (!adminUser) {
        throw new AppError('Invalid email or password.', 401);
      }

      const isMatch = await adminUser.comparePassword(password);
      if (!isMatch) {
        throw new AppError('Invalid email or password.', 401);
      }

      if (!adminUser.active) {
        throw new AppError('Your account has been deactivated by the system administrator.', 403);
      }

      adminUser.lastLogin = new Date();
      await adminUser.save();

      const token = jwt.sign(
        {
          id: adminUser._id,
          email: adminUser.email,
          role: adminUser.role
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      res.json({
        success: true,
        data: {
          token,
          adminUser: {
            id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            permissions: adminUser.permissions,
            lastLogin: adminUser.lastLogin
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current authenticated admin session profile
   */
  public static async getMe(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        data: {
          adminUser: {
            id: req.adminUser._id,
            name: req.adminUser.name,
            email: req.adminUser.email,
            role: req.adminUser.role,
            permissions: req.adminUser.permissions,
            lastLogin: req.adminUser.lastLogin
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all team members (Superadmin only)
   */
  public static async getTeamMembers(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const members = await AdminUser.find({}, '-passwordHash').sort({ createdAt: -1 });
      res.json({
        success: true,
        data: members
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new team member (Manager or Employee) with granular permissions (Superadmin only)
   */
  public static async createTeamMember(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, role, permissions } = req.body;

      if (!name || !email || !password) {
        throw new AppError('Name, email, and initial password are required.', 400);
      }

      if (password.length < 8) {
        throw new AppError('Initial password must be at least 8 characters long.', 400);
      }

      const existing = await AdminUser.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        throw new AppError('An admin or team account with this email already exists.', 400);
      }

      const assignedRole = role === 'manager' ? 'manager' : 'employee';
      const passwordHash = await bcrypt.hash(password, 12);

      const member = await AdminUser.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: assignedRole,
        permissions: {
          canManageLeads: Boolean(permissions?.canManageLeads),
          canManageBlog: Boolean(permissions?.canManageBlog),
          canManageServices: Boolean(permissions?.canManageServices),
          canManageCaseStudies: Boolean(permissions?.canManageCaseStudies),
          canManageKnowledge: Boolean(permissions?.canManageKnowledge),
          canManageSettings: Boolean(permissions?.canManageSettings),
          canManageTeam: false // Only superadmin can manage team
        },
        active: true
      });

      res.status(201).json({
        success: true,
        message: 'Team member created successfully.',
        data: {
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          permissions: member.permissions,
          active: member.active,
          createdAt: member.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update team member permissions or status (Superadmin only)
   */
  public static async updateTeamMember(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, role, permissions, active, password } = req.body;

      const member = await AdminUser.findById(id);
      if (!member) {
        throw new AppError('Team member not found.', 404);
      }

      // Protect superadmin from being demoted or modified through team API
      if (member.role === 'superadmin' && req.adminUser._id.toString() !== member._id.toString()) {
        throw new AppError('Cannot modify the Superadmin account.', 403);
      }

      if (name) member.name = name.trim();
      if (typeof active === 'boolean') member.active = active;

      if (member.role !== 'superadmin') {
        if (role && ['manager', 'employee'].includes(role)) {
          member.role = role;
        }

        if (permissions) {
          member.permissions = {
            canManageLeads: Boolean(permissions.canManageLeads),
            canManageBlog: Boolean(permissions.canManageBlog),
            canManageServices: Boolean(permissions.canManageServices),
            canManageCaseStudies: Boolean(permissions.canManageCaseStudies),
            canManageKnowledge: Boolean(permissions.canManageKnowledge),
            canManageSettings: Boolean(permissions.canManageSettings),
            canManageTeam: false
          };
        }
      }

      if (password && password.length >= 8) {
        member.passwordHash = await bcrypt.hash(password, 12);
      }

      await member.save();

      res.json({
        success: true,
        message: 'Team member updated successfully.',
        data: {
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          permissions: member.permissions,
          active: member.active
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete team member (Superadmin only)
   */
  public static async deleteTeamMember(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const member = await AdminUser.findById(id);
      if (!member) {
        throw new AppError('Team member not found.', 404);
      }

      if (member.role === 'superadmin') {
        throw new AppError('The Superadmin account cannot be deleted.', 403);
      }

      await AdminUser.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Team member removed successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}
