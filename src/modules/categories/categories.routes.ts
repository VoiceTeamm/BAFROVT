import { Router } from 'express';
import { authGuard } from '../../shared/middleware/authGuard';
import { validateBody } from '../../shared/validators';
import { createCategorySchema } from '../../shared/validators';
import {
  listCategoriesHandler,
  getCategoryHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from './categories.controller';

const router = Router();

router.get('/', authGuard, listCategoriesHandler);
router.get('/:id', authGuard, getCategoryHandler);
router.post('/', authGuard, validateBody(createCategorySchema), createCategoryHandler);
router.put('/:id', authGuard, updateCategoryHandler);
router.delete('/:id', authGuard, deleteCategoryHandler);

export default router;
