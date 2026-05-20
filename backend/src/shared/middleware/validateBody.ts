import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = (error.issues ?? []).map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                res.status(400).json({ error: true, message: 'Validation failed', errors });
            } else {
                res.status(500).json({ error: true, message: 'Internal Server Error' });
            }
        }
    };
};