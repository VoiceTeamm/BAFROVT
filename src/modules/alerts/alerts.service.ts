import { prisma } from '../../shared/config/prisma';

export async function getAlertsByUser(userId: string, isRead?: boolean) {
  return prisma.alert.findMany({
    where: { userId, ...(isRead !== undefined && { isRead }) },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markAlertAsRead(id: string, userId: string) {
  return prisma.alert.update({ where: { id, userId }, data: { isRead: true } });
}
