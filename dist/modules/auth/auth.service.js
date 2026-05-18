"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../../shared/config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../shared/config/env");
class AuthService {
    async register(data) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new Error('El email ya está registrado');
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: hashedPassword,
                businessName: data.businessName,
            },
            select: { id: true, name: true, email: true, businessName: true },
        });
        const token = this.generateToken(user.id);
        return { user, token };
    }
    async login(data) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (!user)
            throw new Error('Credenciales inválidas');
        const validPassword = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!validPassword)
            throw new Error('Credenciales inválidas');
        const token = this.generateToken(user.id);
        return {
            user: { id: user.id, name: user.name, email: user.email, businessName: user.businessName },
            token,
        };
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, env_1.env.JWT_SECRET, { expiresIn: '24h' });
    }
}
exports.AuthService = AuthService;
