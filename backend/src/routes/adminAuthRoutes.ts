import { Router } from 'express';
import { AdminAuthController } from '../controllers/adminAuthController';
import { requireAdminAuth, requireAdminPermission } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Setup status and initial setup
router.get('/setup-status', AdminAuthController.getSetupStatus);
router.post('/setup', authLimiter, AdminAuthController.setupSuperadmin);
router.post('/setup-superadmin', authLimiter, AdminAuthController.setupSuperadmin);

// Login
router.post('/login', authLimiter, AdminAuthController.login);

// Session check
router.get('/me', requireAdminAuth, AdminAuthController.getMe);

// Team & Permissions Management (Superadmin Only)
router.get('/team', requireAdminAuth, requireAdminPermission('canManageTeam'), AdminAuthController.getTeamMembers);
router.post('/team', requireAdminAuth, requireAdminPermission('canManageTeam'), AdminAuthController.createTeamMember);
router.put('/team/:id', requireAdminAuth, requireAdminPermission('canManageTeam'), AdminAuthController.updateTeamMember);
router.delete('/team/:id', requireAdminAuth, requireAdminPermission('canManageTeam'), AdminAuthController.deleteTeamMember);

export default router;
