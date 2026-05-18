"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhooks_controller_1 = require("./webhooks.controller");
const router = (0, express_1.Router)();
// POST /api/webhooks/recommendation - recibe recomendaciones de n8n
router.post('/recommendation', webhooks_controller_1.webhookRecommendationHandler);
// POST /api/webhooks/n8n - entrada general desde n8n
router.post('/n8n', webhooks_controller_1.webhookN8nHandler);
// GET /api/webhooks/health - verifica conexion con n8n
router.get('/health', webhooks_controller_1.webhookHealthHandler);
exports.default = router;
