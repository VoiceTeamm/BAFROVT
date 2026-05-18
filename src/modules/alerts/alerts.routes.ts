import { Router } from 'express';
import { authGuard } from '../../shared/middleware/authGuard';
import { listAlertsHandler, markAlertReadHandler } from './alerts.controller';

const router = Router();

router.get('/', authGuard, listAlertsHandler);
router.patch('/:id/read', authGuard, markAlertReadHandler);

export default router;
