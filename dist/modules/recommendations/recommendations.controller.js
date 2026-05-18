"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRecommendationsHandler = listRecommendationsHandler;
exports.updateRecommendationHandler = updateRecommendationHandler;
const recommendations_service_1 = require("./recommendations.service");
const zod_1 = require("zod");
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum(['APPLIED', 'DISMISSED']),
});
async function listRecommendationsHandler(req, res, next) {
    try {
        const userId = req.user.id;
        const recommendations = await (0, recommendations_service_1.getActiveRecommendations)(userId);
        res.status(200).json({ recommendations });
    }
    catch (error) {
        next(error);
    }
}
async function updateRecommendationHandler(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const parsed = statusSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten() });
            return;
        }
        const updated = await (0, recommendations_service_1.updateRecommendationStatus)(id, userId, parsed.data.status);
        res.status(200).json({ recommendation: updated });
    }
    catch (error) {
        next(error);
    }
}
