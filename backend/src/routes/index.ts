import { Router } from 'express';
import leadRoutes from './leadRoutes';
import blogRoutes from './blogRoutes';
import serviceRoutes from './serviceRoutes';
import caseStudyRoutes from './caseStudyRoutes';
import chatRoutes from './chatRoutes';
import contentRoutes from './contentRoutes';
import adminAuthRoutes from './adminAuthRoutes';
import packageRoutes from './packageRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SoloNomous Labs API Engine',
    version: '1.0.0'
  });
});

router.use('/admin-auth', adminAuthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/leads', leadRoutes);
router.use('/blog', blogRoutes);
router.use('/services', serviceRoutes);
router.use('/packages', packageRoutes);
router.use('/case-studies', caseStudyRoutes);
router.use('/chat', chatRoutes);
router.use('/', contentRoutes);

export default router;
