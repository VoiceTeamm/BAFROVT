import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authGuard(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        message: 'Token de autenticacion no proporcionado.',
        code: 'UNAUTHORIZED',
        status: 401,
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(401).json({
      error: {
        message: 'Token invalido o expirado.',
        code: 'UNAUTHORIZED',
        status: 401,
      },
    });
  }
}
