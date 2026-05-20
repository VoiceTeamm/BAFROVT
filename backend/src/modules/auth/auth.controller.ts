import { Request, Response } from 'express';
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