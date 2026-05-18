<<<<<<< HEAD
﻿import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: true,
                message: 'No se proporcionó token de autenticación'
            });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: true,
                message: 'Token inválido. Use el formato: Bearer <token>'
            });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            error: true,
            message: 'Token inválido o expirado'
        });
    }
};
=======
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticación JWT.
 * Verifica el token en el header Authorization: Bearer <token>
 * y adjunta el usuario decodificado a req.user
 *
 * NOTA: Persona C implementa la versión completa.
 * Este archivo es el stub necesario para que los módulos de Persona D compilen.
 */
export function authGuard(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticación no proporcionado.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}
>>>>>>> 6bc3843351175d8768e9235cae85b31d7e215ba1
