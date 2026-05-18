import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/config/prisma';
import { getIO } from '../../shared/config/socket';
import { logger } from '../../shared/utils/logger';
import { z } from 'zod';
import axios from 'axios';

const webhookRecommendationSchema = z.object({
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  suggestedPrice: z.number(),
  currentPrice: z.number(),
  variationPct: z.number(),
});

const webhookN8nSchema = z.object({
  type: z.enum(['transaction', 'alert', 'recommendation']),
  userId: z.string().uuid(),
  data: z.record(z.unknown()),
});

function checkWebhookSecret(req: Request, res: Response): boolean {
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.N8N_WEBHOOK_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export async function webhookRecommendationHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    if (!checkWebhookSecret(req, res)) return;

    const parsed = webhookRecommendationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const recommendation = await prisma.recommendation.create({
      data: { ...parsed.data, status: 'ACTIVE' },
    });

    try {
      getIO().to(`user:${parsed.data.userId}`).emit('new_recommendation', { recommendation });
    } catch {
      logger.warn('Socket.io no disponible para emitir evento');
    }

    res.status(201).json({ ok: true, recommendation });
  } catch (error) {
    next(error);
  }
}

export async function webhookN8nHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    if (!checkWebhookSecret(req, res)) return;

    const parsed = webhookN8nSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { type, userId, data } = parsed.data;
    logger.info(`Webhook n8n recibido: type=${type}, userId=${userId}`);

    // Emitir evento al usuario via Socket.io
    try {
      getIO().to(`user:${userId}`).emit(`n8n:${type}`, { data });
    } catch {
      logger.warn('Socket.io no disponible');
    }

    res.status(200).json({ ok: true, type, userId });
  } catch (error) {
    next(error);
  }
}

export async function webhookHealthHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL ?? 'http://localhost:5678';
    let n8nStatus = 'unreachable';

    try {
      await axios.get(`${n8nUrl}/healthz`, { timeout: 3000 });
      n8nStatus = 'ok';
    } catch {
      n8nStatus = 'unreachable';
    }

    res.json({ status: 'ok', n8n: n8nStatus, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
}
