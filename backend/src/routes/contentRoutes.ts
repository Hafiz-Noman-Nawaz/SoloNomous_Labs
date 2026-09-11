import { Router } from 'express';
import multer from 'multer';
import { ContentController } from '../controllers/contentController';
import { requireAdminAuth, requireAdminPermission } from '../middleware/auth';
import { submissionLimiter } from '../middleware/rateLimiter';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

// FAQs
router.get('/faqs', ContentController.getFaqs);
router.post('/admin/faqs', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.createFaq);
router.put('/admin/faqs/:id', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.updateFaq);
router.delete('/admin/faqs/:id', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.deleteFaq);

// Testimonials
router.get('/testimonials', ContentController.getTestimonials);
router.get('/admin/testimonials', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.getTestimonials);
router.post('/testimonials/submit', submissionLimiter, ContentController.submitClientReview);
router.post('/admin/testimonials', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.createTestimonial);
router.put('/admin/testimonials/:id', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.updateTestimonial);
router.delete('/admin/testimonials/:id', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.deleteTestimonial);

// Newsletter
router.post('/newsletter/subscribe', submissionLimiter, ContentController.subscribeNewsletter);

// Site Settings
router.get('/settings', ContentController.getSettings);
router.put('/settings', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.updateSettings);
router.put('/admin/settings', requireAdminAuth, requireAdminPermission('canManageSettings'), ContentController.updateSettings);

// Knowledge Documents (RAG)
router.get('/knowledge', ContentController.getKnowledgeDocs);
router.post('/admin/knowledge', requireAdminAuth, requireAdminPermission('canManageKnowledge'), ContentController.createKnowledgeDoc);
router.put('/admin/knowledge/:id', requireAdminAuth, requireAdminPermission('canManageKnowledge'), ContentController.updateKnowledgeDoc);
router.delete('/admin/knowledge/:id', requireAdminAuth, requireAdminPermission('canManageKnowledge'), ContentController.deleteKnowledgeDoc);

// Media
router.get('/admin/media', requireAdminAuth, ContentController.getMediaList);
router.post('/admin/media/upload', requireAdminAuth, upload.single('file'), ContentController.uploadMedia);

export default router;
