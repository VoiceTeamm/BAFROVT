import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/config/prisma';
import { getIO } from '../../shared/config/socket';
import { z } from 'zod';

const webhookRecommendationSchema = z.object({
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  suggestedPrice: z.number(),
  currentPrice: z.number(),
  variationPct: z.number(),
});

/**
 * POST /api/webhooks/recommendation
 * Recibe recomendaciones generadas por n8n y las guarda en BD.
 */
export async function webhookRecommendationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Verificar secret de webhook (seguridad básica)
    const secret = req.headers['x-webhook-secret'];
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parsed = webhookRecommendationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const data = parsed.data;

    const recommendation = await prisma.recommendation.create({
      data: {
        userId: data.userId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        suggestedPrice: data.suggestedPrice,
        currentPrice: data.currentPrice,
        variationPct: data.variationPct,
        status: 'ACTIVE',
      },
    });

    // Emitir evento Socket.io al usuario correspondiente
    try {
      const io = getIO();
      io.to(`user:${data.userId}`).emit('new_recommendation', { recommendation });
    } catch {
      console.warn('Socket.io no disponible.');
    }

    res.status(201).json({ ok: true, recommendation });
  } catch (error) {
    next(error);
  }
}
