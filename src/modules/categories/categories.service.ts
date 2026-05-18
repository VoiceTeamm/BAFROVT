import { prisma } from '../../shared/config/prisma';

const DEFAULT_CATEGORIES = [
  { name: 'Ventas', type: 'INCOME' as const, color: '#22c55e', icon: 'trending-up' },
  { name: 'Servicios', type: 'INCOME' as const, color: '#3b82f6', icon: 'briefcase' },
  { name: 'Ingredientes', type: 'EXPENSE' as const, color: '#ef4444', icon: 'shopping-cart' },
  { name: 'Arriendo', type: 'EXPENSE' as const, color: '#f97316', icon: 'home' },
  { name: 'Sueldos', type: 'EXPENSE' as const, color: '#a855f7', icon: 'users' },
  { name: 'Servicios Basicos', type: 'EXPENSE' as const, color: '#eab308', icon: 'zap' },
];

export async function createDefaultCategories(userId: string) {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((cat) => ({ ...cat, userId })),
    skipDuplicates: true,
  });
}

export async function getCategoriesByUser(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

export async function getCategoryById(id: string, userId: string) {
  return prisma.category.findFirst({ where: { id, userId } });
}

export async function createCategory(userId: string, data: {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string;
  icon?: string;
}) {
  return prisma.category.create({ data: { ...data, userId } });
}

export async function updateCategory(id: string, userId: string, data: {
  name?: string;
  color?: string;
  icon?: string;
}) {
  return prisma.category.update({ where: { id, userId }, data });
}

export async function deleteCategory(id: string, userId: string) {
  return prisma.category.delete({ where: { id, userId } });
}
