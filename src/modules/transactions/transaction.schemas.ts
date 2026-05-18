import { z } from 'zod';

export const createTransactionSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE'], {
        errorMap: () => ({ message: 'El tipo debe ser INCOME o EXPENSE' }),
    }),
    amount: z.number().positive('El monto debe ser mayor a 0'),
    category: z.string().optional(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;