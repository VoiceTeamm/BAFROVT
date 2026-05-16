import { Request, Response, NextFunction } from 'express';
import { getActiveRecommendations, updateRecommendationStatus } from './recommendations.service';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['APPLIED', 'DISMISSED']),
});

export async function listRecommendationsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const recommendations = await getActiveRecommendations(userId);
    res.status(200).json({ recommendations });
  } catch (error) {
    next(error);
  }
}

export async function updateRecommendationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const updated = await updateRecommendationStatus(id, userId, parsed.data.status);
    res.status(200).json({ recommendation: updated });
  } catch (error) {
    next(error);
  }
}
