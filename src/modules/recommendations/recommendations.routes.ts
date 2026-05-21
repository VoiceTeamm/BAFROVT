import { Router } from 'express';
import { authGuard, AuthRequest } from '../../shared/middleware/authGuard';
import RecommendationService from './recommendations.service';
import { updateRecommendationSchema } from './recommendations.schemas';

export const recommendationRouter = Router();

recommendationRouter.use(authGuard);

recommendationRouter.get('/', async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const status = req.query.status as 'ACTIVE' | 'DISMISSED' | 'APPLIED' | undefined;
        const recommendations = await RecommendationService.getAll(userId, status);
        res.json(recommendations);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
});

recommendationRouter.patch('/:id', async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;
        const id = req.params.id as string;

        const parsed = updateRecommendationSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: true, message: 'Datos invalidos', details: parsed.error.issues });
        }

        const recommendation = await RecommendationService.updateStatus(id, userId, parsed.data.status);
        res.json({ message: 'Recomendacion actualizada', recommendation });
    } catch (error: any) {
        res.status(404).json({ error: true, message: error.message });
    }
});

export default recommendationRouter;
