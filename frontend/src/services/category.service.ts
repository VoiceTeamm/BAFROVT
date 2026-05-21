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
      .get<Category[]>('/categories')
      .then((r) => r.data),

  create: (data: CategoryPayload): Promise<Category> =>
    api
      .post<Category>('/categories', data)
      .then((r) => r.data),

  update: (id: string, data: Partial<CategoryPayload>): Promise<Category> =>
    api
      .put<Category>(`/categories/${id}`, data)
      .then((r) => r.data),

  remove: (id: string): Promise<void> =>
    api.delete(`/categories/${id}`).then(() => undefined),
}
