"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlertsByUser = getAlertsByUser;
exports.markAlertAsRead = markAlertAsRead;
const prisma_1 = require("../../shared/config/prisma");
async function getAlertsByUser(userId, isRead) {
    return prisma_1.prisma.alert.findMany({
        where: { userId, ...(isRead !== undefined && { isRead }) },
        orderBy: { createdAt: 'desc' },
    });
}
async function markAlertAsRead(id, userId) {
    return prisma_1.prisma.alert.update({ where: { id, userId }, data: { isRead: true } });
}
