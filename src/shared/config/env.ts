import 'dotenv/config'; // ⚠️ DEBE IR PRIMERO
import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    OPENAI_API_KEY: z.string(),
    REDIS_URL: z.string(),
    N8N_WEBHOOK_URL: z.string().url(),
    PORT: z.string().optional().default('3000'),
});

export const env = envSchema.parse(process.env);