"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultCategories = createDefaultCategories;
exports.getCategoriesByUser = getCategoriesByUser;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const prisma_1 = require("../../shared/config/prisma");
const DEFAULT_CATEGORIES = [
    { name: 'Ventas', type: 'INCOME', color: '#22c55e', icon: 'trending-up' },
    { name: 'Servicios', type: 'INCOME', color: '#3b82f6', icon: 'briefcase' },
    { name: 'Ingredientes', type: 'EXPENSE', color: '#ef4444', icon: 'shopping-cart' },
    { name: 'Arriendo', type: 'EXPENSE', color: '#f97316', icon: 'home' },
    { name: 'Sueldos', type: 'EXPENSE', color: '#a855f7', icon: 'users' },
    { name: 'Servicios Basicos', type: 'EXPENSE', color: '#eab308', icon: 'zap' },
];
async function createDefaultCategories(userId) {
    await prisma_1.prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map((cat) => ({ ...cat, userId })),
        skipDuplicates: true,
    });
}
async function getCategoriesByUser(userId) {
    return prisma_1.prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
    });
}
async function getCategoryById(id, userId) {
    return prisma_1.prisma.category.findFirst({ where: { id, userId } });
}
async function createCategory(userId, data) {
    return prisma_1.prisma.category.create({ data: { ...data, userId } });
}
async function updateCategory(id, userId, data) {
    return prisma_1.prisma.category.update({ where: { id, userId }, data });
}
async function deleteCategory(id, userId) {
    return prisma_1.prisma.category.delete({ where: { id, userId } });
}
