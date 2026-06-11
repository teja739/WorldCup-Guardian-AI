import { Router } from 'express';
import { loginUser, logoutUser, getUserProfile, updateUserProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

export default router;
