import { prisma } from '../../shared/config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../shared/config/env';
import { RegisterInput, LoginInput } from './auth.schemas';

export class AuthService {
    async register(data: RegisterInput) {
        const passwordHash = await bcrypt.hash(data.password, 10);

        try {
            const user = await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    passwordHash,
                    businessType: data.businessType ?? 'general',
                },
                select: { id: true, name: true, email: true, businessType: true },
            });

            const token = this.generateToken(user.id);
            return { user, token };
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error('El email ya esta registrado');
            }
            throw error;
        }
    }

    async login(data: LoginInput) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw new Error('Credenciales invalidas');

        const validPassword = await bcrypt.compare(data.password, user.passwordHash);
        if (!validPassword) throw new Error('Credenciales invalidas');

        const token = this.generateToken(user.id);

        return {
            user: { id: user.id, name: user.name, email: user.email, businessType: user.businessType },
            token,
        };
    }

    async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                businessType: true,
                targetMarginPct: true,
                createdAt: true,
            },
        });
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    }

    async refreshToken(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new Error('Usuario no encontrado');
        const token = this.generateToken(user.id);
        return { token };
    }

    async logout() {
        return { message: 'Sesion cerrada correctamente' };
    }

    private generateToken(userId: string) {
        return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '24h' });
    }
}
