import { Request, Response } from 'express';
import { AuthRequest } from '../../shared/middleware/authGuard';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput } from './auth.schemas';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const data: RegisterInput = req.body;
        const result = await authService.register(data);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const data: LoginInput = req.body;
        const result = await authService.login(data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ error: true, message: error.message });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await authService.getMe(req.userId!);
        res.json(user);
    } catch (error: any) {
        res.status(404).json({ error: true, message: error.message });
    }
};

export const refreshToken = async (req: AuthRequest, res: Response) => {
    try {
        const result = await authService.refreshToken(req.userId!);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ error: true, message: error.message });
    }
};

export const logout = async (_req: Request, res: Response) => {
    res.json({ message: 'Sesion cerrada correctamente' });
};
