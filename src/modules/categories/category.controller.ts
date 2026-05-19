import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { createCategorySchema, updateCategorySchema } from './category.schemas';
import { AuthRequest } from '../../shared/middleware/authGuard';

export const CategoryController = {
    async getAll(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            const categories = await CategoryService.getAll(userId);
            res.json(categories);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            // ✅ Conversión explícita: req.params.id puede ser string | string[]
            const id = req.params.id as string;
            const category = await CategoryService.getById(id, userId);
            if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
            res.json(category);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            const parsed = createCategorySchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.issues });
            }
            const category = await CategoryService.create(parsed.data, userId);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            // ✅ Conversión explícita para el ID
            const id = req.params.id as string;
            const parsed = updateCategorySchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.issues });
            }
            const updated = await CategoryService.update(id, userId, parsed.data);
            res.json(updated);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    },

    async delete(req: AuthRequest, res: Response) {
        try {
            const userId = req.userId;
            // ✅ Conversión explícita para el ID
            const id = req.params.id as string;
            await CategoryService.delete(id, userId);
            res.json({ message: 'Categoría eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
};