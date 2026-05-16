import { Router } from 'express';
import { authGuard } from '../../shared/middleware/authGuard';
import {
  listRecommendationsHandler,
  updateRecommendationHandler,
} from './recommendations.controller';

const router = Router();

// GET /api/recommendations - Listar recomendaciones activas
router.get('/', authGuard, listRecommendationsHandler);

// PATCH /api/recommendations/:id - Marcar como APPLIED o DISMISSED
router.patch('/:id', authGuard, updateRecommendationHandler);

export default router;
