import { prisma } from '../../shared/config/prisma';
import { CategoryType } from '@prisma/client';

export const CategoryService = {
    async getAll(userId: string) {
        return prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    },

    async getById(id: string, userId: string) {
        return prisma.category.findUnique({
            where: { id, userId },
        });
    },

    async create(data: { name: string; type: CategoryType }, userId: string) {
        const existing = await prisma.category.findFirst({
            where: { name: data.name, userId, type: data.type },
        });
        if (existing) throw new Error('Ya existe una categoria con ese nombre para este tipo');

        return prisma.category.create({
            data: {
                name: data.name,
                type: data.type,
                userId: userId,
            },
        });
    },

    async update(id: string, userId: string, data: { name?: string; type?: CategoryType }) {
        const existing = await prisma.category.findUnique({ where: { id, userId } });
        if (!existing) throw new Error('Categoria no encontrada');

        return prisma.category.update({
            where: { id },
            data,
        });
    },

    async delete(id: string, userId: string) {
        const existing = await prisma.category.findUnique({ where: { id, userId } });
        if (!existing) throw new Error('Categoria no encontrada');

        const txCount = await prisma.transaction.count({ where: { categoryId: id } });
        if (txCount > 0) {
            throw new Error('No se puede eliminar: tiene transacciones asociadas');
        }

        return prisma.category.delete({ where: { id } });
    },
};
