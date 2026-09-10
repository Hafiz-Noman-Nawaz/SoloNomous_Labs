import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public chat session & messaging endpoints
router.post('/session', ChatController.initSession);
router.post('/message', chatLimiter, ChatController.sendMessage);
router.post('/stream', chatLimiter, ChatController.streamMessage);
router.get('/stream', chatLimiter, ChatController.streamMessage);
router.post('/escalate', chatLimiter, ChatController.escalateToLead);

export default router;
