"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const authGuard_1 = require("../../shared/middleware/authGuard");
const validateBody_1 = require("../../shared/middleware/validateBody");
const transaction_schemas_1 = require("./transaction.schemas");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(authGuard_1.authGuard);
router.post('/', (0, validateBody_1.validateBody)(transaction_schemas_1.createTransactionSchema), transaction_controller_1.createTransaction);
router.get('/', transaction_controller_1.getTransactions);
router.get('/summary', transaction_controller_1.getSummary);
router.get('/:id', transaction_controller_1.getTransactionById);
router.put('/:id', (0, validateBody_1.validateBody)(transaction_schemas_1.updateTransactionSchema), transaction_controller_1.updateTransaction);
router.delete('/:id', transaction_controller_1.deleteTransaction);
exports.default = router;
