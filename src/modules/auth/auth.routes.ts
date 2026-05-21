import { Router } from 'express';
import { register, login, getMe, refreshToken, logout } from './auth.controller';
import { validateBody } from '../../shared/middleware/validateBody';
import { registerSchema, loginSchema } from './auth.schemas';
import { authGuard } from '../../shared/middleware/authGuard';

const router = Router();

// Rutas públicas
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

// Rutas protegidas
router.get('/me', authGuard, getMe);
router.post('/refresh', authGuard, refreshToken);
router.post('/logout', authGuard, logout);

export default router;
