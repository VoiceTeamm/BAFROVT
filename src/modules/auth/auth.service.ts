import { prisma } from '../../shared/config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../shared/config/env';
import { RegisterInput, LoginInput } from './auth.schemas';

export class AuthService {
    async register(data: RegisterInput) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) throw new Error('El email ya está registrado');

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                businessName: data.businessName,
            },
            select: { id: true, name: true, email: true, businessName: true },
        });

        const token = this.generateToken(user.id);
        return { user, token };
    }

    async login(data: LoginInput) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw new Error('Credenciales inválidas');

        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) throw new Error('Credenciales inválidas');

        const token = this.generateToken(user.id);

        return {
            user: { id: user.id, name: user.name, email: user.email, businessName: user.businessName },
            token,
        };
    }

    private generateToken(userId: string) {
        return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '24h' });
    }
}