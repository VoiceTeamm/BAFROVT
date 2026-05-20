import { Router } from 'express';
import { webhookRecommendationHandler } from './webhooks.controller';

const router = Router();

// POST /api/webhooks/recommendation
// Llamado por n8n cuando genera una recomendación de precio
router.post('/recommendation', webhookRecommendationHandler);

export default router;
