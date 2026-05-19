import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authGuard } from '../../shared/middleware/authGuard'; // ⚠️ Verificá que esta ruta sea correcta en tu estructura

const router = Router();

// Todas las rutas de categorías requieren autenticación
router.use(authGuard);

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', CategoryController.create);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;