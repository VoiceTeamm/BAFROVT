"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authGuard_1 = require("../../shared/middleware/authGuard");
const alerts_controller_1 = require("./alerts.controller");
const router = (0, express_1.Router)();
router.get('/', authGuard_1.authGuard, alerts_controller_1.listAlertsHandler);
router.patch('/:id/read', authGuard_1.authGuard, alerts_controller_1.markAlertReadHandler);
exports.default = router;
