import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import { AuthRequest } from '../../shared/middleware/authGuard';
import { CreateTransactionInput, UpdateTransactionInput } from './transaction.schemas';

const transactionService = new TransactionService();

export const createTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const data: CreateTransactionInput = req.body;
        const transaction = await transactionService.createTransaction(req.userId!, data);
        res.status(201).json(transaction);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await transactionService.getUserTransactions(req.userId!, page, limit);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const transaction = await transactionService.getTransactionById(req.userId!, id);
        res.json(transaction);
    } catch (error: any) {
        res.status(404).json({ error: true, message: error.message });
    }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const data: UpdateTransactionInput = req.body;

        const updated = await transactionService.updateTransaction(req.userId!, id, data);
        res.json(updated);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await transactionService.deleteTransaction(req.userId!, id);
        res.json({ message: 'Transacción eliminada correctamente' });
    } catch (error: any) {
        res.status(404).json({ error: true, message: error.message });
    }
};

export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                error: true,
                message: 'Se requieren los parámetros startDate y endDate',
            });
        }

        const summary = await transactionService.getSummary(
            req.userId!,
            new Date(startDate as string),
            new Date(endDate as string)
        );

        res.json(summary);
    } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
    }
};