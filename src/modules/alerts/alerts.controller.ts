import { Request, Response, NextFunction } from 'express';
import { getAlertsByUser, markAlertAsRead } from './alerts.service';

export async function listAlertsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
    const alerts = await getAlertsByUser(req.user!.id, isRead);
    res.json({ alerts });
  } catch (error) { next(error); }
}

export async function markAlertReadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const alert = await markAlertAsRead(req.params.id, req.user!.id);
    res.json({ alert });
  } catch (error) { next(error); }
}
