import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authGuard = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: true, message: 'Token de autenticación no proporcionado.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; email?: string };

    req.userId = decoded.userId;
    req.user = { id: decoded.userId, email: decoded.email ?? '' };

    next();
  } catch {
    res.status(401).json({ error: true, message: 'Token inválido o expirado.' });
  }
};
