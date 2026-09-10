import { Router } from 'express';
import { CaseStudyController } from '../controllers/caseStudyController';
import { requireAdminAuth, requireAdminPermission } from '../middleware/auth';

const router = Router();

// Public endpoints
router.get('/', CaseStudyController.getCaseStudies);
router.get('/:slug', CaseStudyController.getCaseStudyBySlug);

// CMS Admin endpoints
router.get('/admin/all', requireAdminAuth, requireAdminPermission('canManageCaseStudies'), CaseStudyController.getAllCaseStudiesAdmin);
router.post('/admin', requireAdminAuth, requireAdminPermission('canManageCaseStudies'), CaseStudyController.createCaseStudy);
router.put('/admin/:id', requireAdminAuth, requireAdminPermission('canManageCaseStudies'), CaseStudyController.updateCaseStudy);
router.delete('/admin/:id', requireAdminAuth, requireAdminPermission('canManageCaseStudies'), CaseStudyController.deleteCaseStudy);

export default router;
