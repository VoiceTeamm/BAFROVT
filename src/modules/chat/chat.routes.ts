import { Router } from 'express';
import { authGuard } from '../../shared/middleware/authGuard';
import { chatHandler } from './chat.controller';

const router = Router();

// POST /api/chat
// Body: { message: string, history?: [{role, content}] }
router.post('/', authGuard, chatHandler);

export default router;
