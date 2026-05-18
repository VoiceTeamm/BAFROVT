import { prisma } from '../../shared/config/prisma';
import { CreateTransactionInput, UpdateTransactionInput } from './transaction.schemas';

export class TransactionService {
    async createTransaction(userId: string, data: CreateTransactionInput) {
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                ...data,
                date: data.date ? new Date(data.date) : new Date(),
            },
        });

        return transaction;
    }

    async getUserTransactions(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                skip,
                take: limit,
            }),
            prisma.transaction.count({ where: { userId } }),
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

    async getTransactionById(userId: string, transactionId: string) {
        const transaction = await prisma.transaction.findFirst({
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

    async updateTransaction(
        userId: string,
        transactionId: string,
        data: UpdateTransactionInput
    ) {
        await this.getTransactionById(userId, transactionId);

        const updated = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
                updatedAt: new Date(),
            },
        });

        return updated;
    }

    async deleteTransaction(userId: string, transactionId: string) {
        await this.getTransactionById(userId, transactionId);

        await prisma.transaction.delete({
            where: { id: transactionId },
        });

        return { message: 'Transacción eliminada correctamente' };
    }

    async getSummary(userId: string, startDate: Date, endDate: Date) {
        const transactions = await prisma.transaction.findMany({
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
            if (t.category) {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
            }
            return acc;
        }, {} as Record<string, number>);

        return {
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses,
            byCategory,
            transactionCount: transactions.length,
        };
    }
}