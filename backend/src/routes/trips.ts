import { Router } from 'express';
import { getTrips, createTrip, updateTrip, deleteTrip } from '../controllers/tripController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getTrips);
router.post('/', authMiddleware, createTrip);
router.put('/', authMiddleware, updateTrip);
router.delete('/', authMiddleware, deleteTrip);

export default router;
