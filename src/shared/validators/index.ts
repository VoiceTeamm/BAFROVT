import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  businessType: z.string().min(2, 'El tipo de negocio es requerido'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'La contrasena es requerida'),
});

export const createTransactionSchema = z.object({
  categoryId: z.string().uuid('categoryId debe ser un UUID valido'),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive('El monto debe ser positivo'),
  note: z.string().optional(),
  source: z.enum(['MANUAL', 'VOICE', 'CHAT']).default('MANUAL'),
  date: z.string().datetime().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color debe ser hex valido').optional(),
  icon: z.string().optional(),
});

export const updateRecommendationSchema = z.object({
  status: z.enum(['APPLIED', 'DISMISSED']),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacio'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
});

// Middleware generico validateBody
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
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
