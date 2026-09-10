import { Router } from 'express';
import { ServiceController } from '../controllers/serviceController';
import { requireAdminAuth, requireAdminPermission } from '../middleware/auth';

const router = Router();

// Public endpoints
router.get('/categories', ServiceController.getCategories);
router.get('/', ServiceController.getServices);
router.get('/:slug', ServiceController.getServiceBySlug);

// CMS Admin endpoints
router.get('/admin/all', requireAdminAuth, requireAdminPermission('canManageServices'), ServiceController.getAllServicesAdmin);
router.post('/admin', requireAdminAuth, requireAdminPermission('canManageServices'), ServiceController.createService);
router.put('/admin/:id', requireAdminAuth, requireAdminPermission('canManageServices'), ServiceController.updateService);
router.delete('/admin/:id', requireAdminAuth, requireAdminPermission('canManageServices'), ServiceController.deleteService);

export default router;
