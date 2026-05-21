import { Router } from 'express';
import { getSummary, getTrends } from './analytics.controller';
import { authGuard } from '../../shared/middleware/authGuard';

const router = Router();

router.use(authGuard);

router.get('/summary', getSummary);
router.get('/trends', getTrends);

export default router;
