"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authGuard_1 = require("../../shared/middleware/authGuard");
const recommendations_controller_1 = require("./recommendations.controller");
const router = (0, express_1.Router)();
// GET /api/recommendations - Listar recomendaciones activas
router.get('/', authGuard_1.authGuard, recommendations_controller_1.listRecommendationsHandler);
// PATCH /api/recommendations/:id - Marcar como APPLIED o DISMISSED
router.patch('/:id', authGuard_1.authGuard, recommendations_controller_1.updateRecommendationHandler);
exports.default = router;
