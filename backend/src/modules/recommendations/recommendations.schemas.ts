// src/modules/recommendations/recommendations.schemas.ts
import { z } from 'zod';

export const updateRecommendationSchema = z.object({
    status: z.enum(['DISMISSED', 'APPLIED']).optional(),
});