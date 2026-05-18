"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRecommendationHandler = webhookRecommendationHandler;
exports.webhookN8nHandler = webhookN8nHandler;
exports.webhookHealthHandler = webhookHealthHandler;
const prisma_1 = require("../../shared/config/prisma");
const socket_1 = require("../../shared/config/socket");
const logger_1 = require("../../shared/utils/logger");
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
const webhookRecommendationSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    categoryId: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    suggestedPrice: zod_1.z.number(),
    currentPrice: zod_1.z.number(),
    variationPct: zod_1.z.number(),
});
const webhookN8nSchema = zod_1.z.object({
    type: zod_1.z.enum(['transaction', 'alert', 'recommendation']),
    userId: zod_1.z.string().uuid(),
    data: zod_1.z.record(zod_1.z.unknown()),
});
function checkWebhookSecret(req, res) {
    const secret = req.headers['x-webhook-secret'];
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
        res.status(401).json({ error: 'Unauthorized' });
        return false;
    }
    return true;
}
async function webhookRecommendationHandler(req, res, next) {
    try {
        if (!checkWebhookSecret(req, res))
            return;
        const parsed = webhookRecommendationSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }
        const recommendation = await prisma_1.prisma.recommendation.create({
            data: { ...parsed.data, status: 'ACTIVE' },
        });
        try {
            (0, socket_1.getIO)().to(`user:${parsed.data.userId}`).emit('new_recommendation', { recommendation });
        }
        catch {
            logger_1.logger.warn('Socket.io no disponible para emitir evento');
        }
        res.status(201).json({ ok: true, recommendation });
    }
    catch (error) {
        next(error);
    }
}
async function webhookN8nHandler(req, res, next) {
    try {
        if (!checkWebhookSecret(req, res))
            return;
        const parsed = webhookN8nSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }
        const { type, userId, data } = parsed.data;
        logger_1.logger.info(`Webhook n8n recibido: type=${type}, userId=${userId}`);
        // Emitir evento al usuario via Socket.io
        try {
            (0, socket_1.getIO)().to(`user:${userId}`).emit(`n8n:${type}`, { data });
        }
        catch {
            logger_1.logger.warn('Socket.io no disponible');
        }
        res.status(200).json({ ok: true, type, userId });
    }
    catch (error) {
        next(error);
    }
}
async function webhookHealthHandler(req, res, next) {
    try {
        const n8nUrl = process.env.N8N_WEBHOOK_URL ?? 'http://localhost:5678';
        let n8nStatus = 'unreachable';
        try {
            await axios_1.default.get(`${n8nUrl}/healthz`, { timeout: 3000 });
            n8nStatus = 'ok';
        }
        catch {
            n8nStatus = 'unreachable';
        }
        res.json({ status: 'ok', n8n: n8nStatus, timestamp: new Date().toISOString() });
    }
    catch (error) {
        next(error);
    }
}
