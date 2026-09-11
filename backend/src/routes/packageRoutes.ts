import { Router } from 'express';
import { PackageController } from '../controllers/packageController';
import { requireAdminAuth, requireAdminPermission } from '../middleware/auth';

const router = Router();

// Public endpoints
router.get('/', PackageController.getPackages);

// CMS Admin endpoints
router.get('/admin/all', requireAdminAuth, requireAdminPermission('canManageServices'), PackageController.getAllPackagesAdmin);
router.post('/admin', requireAdminAuth, requireAdminPermission('canManageServices'), PackageController.createPackage);
router.put('/admin/:id', requireAdminAuth, requireAdminPermission('canManageServices'), PackageController.updatePackage);
router.delete('/admin/:id', requireAdminAuth, requireAdminPermission('canManageServices'), PackageController.deletePackage);

export default router;
