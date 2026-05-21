import { prisma } from '../../shared/config/prisma';
import { AlertType } from '../../generated/client';

export const AlertService = {
    async getAll(userId: string, onlyUnread?: boolean) {
        return prisma.alert.findMany({
            where: {
                userId,
                ...(onlyUnread && { isRead: false }),
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async markAsRead(id: string, userId: string) {
        const alert = await prisma.alert.findUnique({ where: { id, userId } });
        if (!alert) throw new Error('Alerta no encontrada');

        return prisma.alert.update({
            where: { id },
            data: { isRead: true },
        });
    },

    async createAutomatic(userId: string, message: string, type: AlertType) {
        return prisma.alert.create({
            data: { userId, message, type },
        });
    },
};
