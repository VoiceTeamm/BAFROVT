import { z } from 'zod';

export const updateRecommendationSchema = z.object({
    status: z.enum(['DISMISSED', 'APPLIED']),
});

export type UpdateRecommendationInput = z.infer<typeof updateRecommendationSchema>;
