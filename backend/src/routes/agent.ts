import { Router } from 'express';
import { agentChat, getAgentHistory } from '../controllers/agentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/chat', authMiddleware, agentChat);
router.get('/history', authMiddleware, getAgentHistory);

// Also expose /plan and /execute as aliases to support the API design specified in prompt
router.post('/plan', authMiddleware, agentChat);
router.post('/execute', authMiddleware, agentChat);

export default router;
