import { prisma } from '../../shared/config/prisma';

export class AnalyticsService {
    async getSummary(userId: string) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
            },
            include: { category: true },
        });

        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const byCategory = transactions.reduce((acc: Record<string, { total: number; type: string }>, t) => {
            const name = t.category?.name ?? 'Sin categoría';
            if (!acc[name]) acc[name] = { total: 0, type: t.type };
            acc[name].total += Number(t.amount);
            return acc;
        }, {});

        return {
            period: {
                from: firstDayOfMonth,
                to: lastDayOfMonth,
            },
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            transactionCount: transactions.length,
            byCategory,
        };
    }

    async getTrends(userId: string) {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: sixMonthsAgo },
            },
            orderBy: { date: 'asc' },
        });

        const monthly: Record<string, { income: number; expenses: number }> = {};

        transactions.forEach(t => {
            const key = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthly[key]) monthly[key] = { income: 0, expenses: 0 };
            if (t.type === 'INCOME') monthly[key].income += Number(t.amount);
            else monthly[key].expenses += Number(t.amount);
        });

        const trends = Object.entries(monthly).map(([month, data]) => ({
            month,
            income: data.income,
            expenses: data.expenses,
            balance: data.income - data.expenses,
        }));

        return { trends };
    }
}
