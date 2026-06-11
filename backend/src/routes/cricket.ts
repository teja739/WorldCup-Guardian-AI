import { Router } from 'express';
import { getCricketMatches, getCricketVenues, getCricketAlerts, generateCricketTravelPlan } from '../controllers/cricketController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply authMiddleware to protect routes
router.use(authMiddleware as any);

router.get('/matches', getCricketMatches);
router.get('/venues', getCricketVenues);
router.get('/alerts', getCricketAlerts);
router.post('/plan', generateCricketTravelPlan);

export default router;
