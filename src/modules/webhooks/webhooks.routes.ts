import { Router } from 'express';
import { webhookRecommendationHandler, webhookN8nHandler, webhookHealthHandler } from './webhooks.controller';

const router = Router();

// POST /api/webhooks/recommendation - recibe recomendaciones de n8n
router.post('/recommendation', webhookRecommendationHandler);

// POST /api/webhooks/n8n - entrada general desde n8n
router.post('/n8n', webhookN8nHandler);

// GET /api/webhooks/health - verifica conexion con n8n
router.get('/health', webhookHealthHandler);

export default router;
