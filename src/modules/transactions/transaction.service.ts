import { prisma } from '../../shared/config/prisma';
import { CreateTransactionInput, UpdateTransactionInput } from './transaction.schemas';

export class TransactionService {
    private async resolveCategory(userId: string, type: 'INCOME' | 'EXPENSE', categoryId?: string, categoryName?: string) {
        if (categoryId) return categoryId;

        const name = categoryName?.trim() || 'Other';
        let category = await prisma.category.findFirst({
            where: { userId, name },
        });
        if (!category) {
            category = await prisma.category.create({
                data: { userId, name, type },
            });
        }
        return category.id;
    }

    async createTransaction(userId: string, data: CreateTransactionInput) {
        const categoryId = await this.resolveCategory(
            userId,
            data.type,
            data.categoryId,
            data.category,
        );

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                categoryId,
                type: data.type,
                amount: data.amount,
                note: data.description,
                date: data.date ? new Date(data.date) : new Date(),
                source: 'MANUAL',
            },
            include: { category: true },
        });

        return transaction;
    }

    async getUserTransactions(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: { userId },
                include: { category: true },
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
            where: { id: transactionId, userId },
            include: { category: true },
        });

        if (!transaction) {
            throw new Error('Transacción no encontrada');
        }

        return transaction;
    }

    async updateTransaction(userId: string, transactionId: string, data: UpdateTransactionInput) {
        await this.getTransactionById(userId, transactionId);

        const categoryId = data.type
            ? await this.resolveCategory(userId, data.type, data.categoryId, data.category)
            : undefined;

        const updated = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                ...(data.type && { type: data.type }),
                ...(data.amount && { amount: data.amount }),
                ...(categoryId && { categoryId }),
                ...(data.description !== undefined && { note: data.description }),
                ...(data.date && { date: new Date(data.date) }),
            },
            include: { category: true },
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
        const transactions: any[] = await prisma.transaction.findMany({
            where: { userId, date: { gte: startDate, lte: endDate } },
            include: { category: true },
        });

        const income = transactions
            .filter((t: any) => t.type === 'INCOME')
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

        const expenses = transactions
            .filter((t: any) => t.type === 'EXPENSE')
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

        const byCategory = transactions.reduce((acc: Record<string, number>, t: any) => {
            const name = (t.category?.name ?? t.categoryId) as string;
            acc[name] = (acc[name] || 0) + Number(t.amount);
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
