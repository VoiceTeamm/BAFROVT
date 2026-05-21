import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/authGuard';
import { AnalyticsService } from './analytics.service';

const analyticsService = new AnalyticsService();

export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        const summary = await analyticsService.getSummary(req.userId!);
        res.json(summary);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
};

export const getTrends = async (req: AuthRequest, res: Response) => {
    try {
        const trends = await analyticsService.getTrends(req.userId!);
        res.json(trends);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
};
