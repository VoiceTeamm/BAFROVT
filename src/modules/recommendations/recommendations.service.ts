import { prisma } from '../../shared/config/prisma';

const RecommendationService = {
    async getAll(userId: string, status?: 'ACTIVE' | 'DISMISSED' | 'APPLIED') {
        return prisma.recommendation.findMany({
            where: { userId, ...(status && { status }) },
            include: { category: { select: { id: true, name: true, type: true } } },
            orderBy: { createdAt: 'desc' },
        });
    },

    async updateStatus(id: string, userId: string, status: 'DISMISSED' | 'APPLIED') {
        const rec = await prisma.recommendation.findUnique({ where: { id, userId } });
        if (!rec) throw new Error('Recomendacion no encontrada');

        return prisma.recommendation.update({
            where: { id },
            data: { status },
            include: { category: { select: { id: true, name: true, type: true } } },
        });
    },
};

export default RecommendationService;
