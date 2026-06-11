import { Router } from 'express';
import { getNotifications, markAsRead, addNotification } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getNotifications);
router.put('/read', authMiddleware, markAsRead);
router.post('/', authMiddleware, addNotification);

export default router;
