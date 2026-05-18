"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.createTransaction = void 0;
const transaction_service_1 = require("./transaction.service");
const transactionService = new transaction_service_1.TransactionService();
const createTransaction = async (req, res) => {
    try {
        const data = req.body;
        const transaction = await transactionService.createTransaction(req.userId, data);
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};
exports.createTransaction = createTransaction;
const getTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await transactionService.getUserTransactions(req.userId, page, limit);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};
exports.getTransactions = getTransactions;
const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await transactionService.getTransactionById(req.userId, id);
        res.json(transaction);
    }
    catch (error) {
        res.status(404).json({ error: true, message: error.message });
    }
};
exports.getTransactionById = getTransactionById;
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await transactionService.updateTransaction(req.userId, id, data);
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        await transactionService.deleteTransaction(req.userId, id);
        res.json({ message: 'Transacción eliminada correctamente' });
    }
    catch (error) {
        res.status(404).json({ error: true, message: error.message });
    }
};
exports.deleteTransaction = deleteTransaction;
const getSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                error: true,
                message: 'Se requieren los parámetros startDate y endDate',
            });
        }
        const summary = await transactionService.getSummary(req.userId, new Date(startDate), new Date(endDate));
        res.json(summary);
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};
exports.getSummary = getSummary;
