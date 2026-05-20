// src/modules/alerts/alert.schemas.ts
import { z } from 'zod';

export const alertResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    message: z.string(),
    type: z.enum(['COST_INCREASE', 'LOW_MARGIN', 'CASH_FLOW']),
    isRead: z.boolean(),
    createdAt: z.string().datetime(),
});

export const markAsReadResponseSchema = z.object({
    message: z.string(),
    alert: alertResponseSchema,
});