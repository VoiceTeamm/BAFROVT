import { Request, Response, NextFunction } from 'express';
import {
  getCategoriesByUser,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './categories.service';
import { validateBody } from '../../shared/validators';
import { createCategorySchema } from '../../shared/validators';

export async function listCategoriesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await getCategoriesByUser(req.user!.id);
    res.json({ categories });
  } catch (error) { next(error); }
}

export async function getCategoryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await getCategoryById(req.params.id, req.user!.id);
    if (!category) { res.status(404).json({ error: { message: 'Categoria no encontrada', code: 'NOT_FOUND', status: 404 } }); return; }
    res.json({ category });
  } catch (error) { next(error); }
}

export async function createCategoryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await createCategory(req.user!.id, req.body);
    res.status(201).json({ category });
  } catch (error) { next(error); }
}

export async function updateCategoryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await updateCategory(req.params.id, req.user!.id, req.body);
    res.json({ category });
  } catch (error) { next(error); }
}

export async function deleteCategoryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await deleteCategory(req.params.id, req.user!.id);
    res.status(204).send();
  } catch (error) { next(error); }
}
