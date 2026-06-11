import { Router } from 'express';
import { getEvents, getEventById } from '../controllers/eventController';

const router = Router();

router.get('/', getEvents);
router.get('/:eventId', getEventById);

export default router;
