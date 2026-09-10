import { Router } from 'express';
import { LeadController } from '../controllers/leadController';
import { submissionLimiter } from '../middleware/rateLimiter';
import { requireAdminAuth, requireAdminPermission } from '../middleware/auth';

const router = Router();

// Public submission endpoints
router.post('/start-a-project', submissionLimiter, LeadController.createLead);
router.post('/inquiry', submissionLimiter, LeadController.createLead);
router.post('/contact', submissionLimiter, LeadController.submitContact);

// Admin CMS endpoints
router.get('/admin/leads', requireAdminAuth, requireAdminPermission('canManageLeads'), LeadController.getLeads);
router.patch('/admin/leads/:id', requireAdminAuth, requireAdminPermission('canManageLeads'), LeadController.updateLead);
router.delete('/admin/leads/:id', requireAdminAuth, requireAdminPermission('canManageLeads'), LeadController.deleteLead);
router.get('/admin/contacts', requireAdminAuth, requireAdminPermission('canManageLeads'), LeadController.getContacts);

export default router;
