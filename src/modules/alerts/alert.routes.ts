import { Router } from 'express';
import { AuthRequest } from '../../shared/middleware/authGuard';
import { AlertService } from './alert.service';

export const alertRouter = Router();

// GET /api/alerts - Listar alertas del usuario
alertRouter.get('/', async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;

        // ✅ Conversión explícita: req.query.unread puede ser string | string[] | undefined
        const unreadParam = req.query.unread as string | undefined;
        const onlyUnread = unreadParam === 'true';

        const alerts = await AlertService.getAll(userId, onlyUnread);
        res.json(alerts);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
});

// PATCH /api/alerts/:id/read - Marcar como leída
alertRouter.patch('/:id/read', async (req: AuthRequest, res) => {
    try {
        const userId = req.userId!;

        // ✅ Conversión explícita: req.params.id puede ser string | string[]
        const id = req.params.id as string;

        const alert = await AlertService.markAsRead(id, userId);
        res.json({ message: 'Alerta marcada como leída', alert });
    } catch (error: any) {
        res.status(404).json({ error: true, message: error.message });
    }
});

export default alertRouter;