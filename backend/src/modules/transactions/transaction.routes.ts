import { Router } from 'express';
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary,
} from './transaction.controller';
import { authGuard } from '../../shared/middleware/authGuard';
import { validateBody } from '../../shared/middleware/validateBody';
import { createTransactionSchema, updateTransactionSchema } from './transaction.schemas';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authGuard);

router.post('/', validateBody(createTransactionSchema), createTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);
router.get('/:id', getTransactionById);
router.put('/:id', validateBody(updateTransactionSchema), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;