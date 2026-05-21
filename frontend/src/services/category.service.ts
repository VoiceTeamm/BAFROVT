import api from './api'
import type { Category } from '../types'

export interface CategoryPayload {
  name: string
  type: 'INCOME' | 'EXPENSE'
  color?: string
  icon?: string
}

export const categoryService = {
  getAll: (): Promise<Category[]> =>
    api
      .get<{ categories: Category[] }>('/categories')
      .then((r) => r.data.categories),

  create: (data: CategoryPayload): Promise<Category> =>
    api
      .post<{ category: Category }>('/categories', data)
      .then((r) => r.data.category),

  update: (id: string, data: Partial<CategoryPayload>): Promise<Category> =>
    api
      .put<{ category: Category }>(`/categories/${id}`, data)
      .then((r) => r.data.category),

  remove: (id: string): Promise<void> =>
    api.delete(`/categories/${id}`).then(() => undefined),
}
