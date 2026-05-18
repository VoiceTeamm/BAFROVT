"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const prisma_1 = require("../../shared/config/prisma");
class TransactionService {
    async createTransaction(userId, data) {
        const transaction = await prisma_1.prisma.transaction.create({
            data: {
                userId,
                ...data,
                date: data.date ? new Date(data.date) : new Date(),
            },
        });
        return transaction;
    }
    async getUserTransactions(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            prisma_1.prisma.transaction.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                skip,
                take: limit,
            }),
            prisma_1.prisma.transaction.count({ where: { userId } }),
        ]);
        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getTransactionById(userId, transactionId) {
        const transaction = await prisma_1.prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId,
            },
        });
        if (!transaction) {
            throw new Error('Transacción no encontrada');
        }
        return transaction;
    }
    async updateTransaction(userId, transactionId, data) {
        await this.getTransactionById(userId, transactionId);
        const updated = await prisma_1.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
                updatedAt: new Date(),
            },
        });
        return updated;
    }
    async deleteTransaction(userId, transactionId) {
        await this.getTransactionById(userId, transactionId);
        await prisma_1.prisma.transaction.delete({
            where: { id: transactionId },
        });
        return { message: 'Transacción eliminada correctamente' };
    }
    async getSummary(userId, startDate, endDate) {
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const income = transactions
            .filter((t) => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter((t) => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);
        const byCategory = transactions.reduce((acc, t) => {
            if (t.categoryId) {
                acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
            }
            return acc;
        }, {});
        return {
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses,
            byCategory,
            transactionCount: transactions.length,
        };
    }
}
exports.TransactionService = TransactionService;
