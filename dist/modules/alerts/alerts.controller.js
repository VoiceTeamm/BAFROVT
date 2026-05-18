"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAlertsHandler = listAlertsHandler;
exports.markAlertReadHandler = markAlertReadHandler;
const alerts_service_1 = require("./alerts.service");
async function listAlertsHandler(req, res, next) {
    try {
        const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
        const alerts = await (0, alerts_service_1.getAlertsByUser)(req.user.id, isRead);
        res.json({ alerts });
    }
    catch (error) {
        next(error);
    }
}
async function markAlertReadHandler(req, res, next) {
    try {
        const alert = await (0, alerts_service_1.markAlertAsRead)(req.params.id, req.user.id);
        res.json({ alert });
    }
    catch (error) {
        next(error);
    }
}
