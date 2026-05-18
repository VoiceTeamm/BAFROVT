"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config"); // ⚠️ DEBE IR PRIMERO
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32),
    OPENAI_API_KEY: zod_1.z.string(),
    REDIS_URL: zod_1.z.string(),
    N8N_WEBHOOK_URL: zod_1.z.string().url(),
    PORT: zod_1.z.string().optional().default('3000'),
});
exports.env = envSchema.parse(process.env);
