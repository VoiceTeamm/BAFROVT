import { Request, Response, NextFunction } from 'express';
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