"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessageSchema = exports.updateRecommendationSchema = exports.createCategorySchema = exports.createTransactionSchema = exports.loginSchema = exports.registerSchema = void 0;
exports.validateBody = validateBody;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: zod_1.z.string().email('Email invalido'),
    password: zod_1.z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
    businessType: zod_1.z.string().min(2, 'El tipo de negocio es requerido'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalido'),
    password: zod_1.z.string().min(1, 'La contrasena es requerida'),
});
exports.createTransactionSchema = zod_1.z.object({
    categoryId: zod_1.z.string().uuid('categoryId debe ser un UUID valido'),
    type: zod_1.z.enum(['INCOME', 'EXPENSE']),
    amount: zod_1.z.number().positive('El monto debe ser positivo'),
    note: zod_1.z.string().optional(),
    source: zod_1.z.enum(['MANUAL', 'VOICE', 'CHAT']).default('MANUAL'),
    date: zod_1.z.string().datetime().optional(),
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'El nombre es requerido'),
    type: zod_1.z.enum(['INCOME', 'EXPENSE']),
    color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color debe ser hex valido').optional(),
    icon: zod_1.z.string().optional(),
});
exports.updateRecommendationSchema = zod_1.z.object({
    status: zod_1.z.enum(['APPLIED', 'DISMISSED']),
});
exports.chatMessageSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, 'El mensaje no puede estar vacio'),
    history: zod_1.z.array(zod_1.z.object({
        role: zod_1.z.enum(['user', 'assistant']),
        content: zod_1.z.string(),
    })).optional().default([]),
});
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                error: {
                    message: 'Datos invalidos',
                    code: 'VALIDATION_ERROR',
                    status: 400,
                    details: result.error.flatten().fieldErrors,
                },
            });
            return;
        }
        req.body = result.data;
        next();
    };
}
