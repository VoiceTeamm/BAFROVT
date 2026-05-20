import { Router } from 'express';
import { register, login } from './auth.controller';
import { validateBody } from '../../shared/middleware/validateBody';
import { registerSchema, loginSchema } from './auth.schemas';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

export default router;