"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = zod_1.z.object({
    type: zod_1.z.enum(['INCOME', 'EXPENSE'], {
        errorMap: () => ({ message: 'El tipo debe ser INCOME o EXPENSE' }),
    }),
    amount: zod_1.z.number().positive('El monto debe ser mayor a 0'),
    category: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    date: zod_1.z.string().datetime().optional(),
});
exports.updateTransactionSchema = exports.createTransactionSchema.partial();
