import { Router } from 'express';
import { BlogController } from '../controllers/blogController';
import { requireAdminAuth, requireAdminPermission } from '../middleware/auth';

const router = Router();

// Public endpoints
router.get('/', BlogController.getPosts);
router.get('/taxonomies', BlogController.getTaxonomies);
router.get('/:slug', BlogController.getPostBySlug);

// CMS Admin endpoints
router.get('/admin/all', requireAdminAuth, requireAdminPermission('canManageBlog'), BlogController.getAdminPosts);
router.post('/admin', requireAdminAuth, requireAdminPermission('canManageBlog'), BlogController.createPost);
router.put('/admin/:id', requireAdminAuth, requireAdminPermission('canManageBlog'), BlogController.updatePost);
router.delete('/admin/:id', requireAdminAuth, requireAdminPermission('canManageBlog'), BlogController.deletePost);

export default router;
