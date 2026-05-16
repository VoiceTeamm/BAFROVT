import api from './api'
import type { Transaction } from '../types'

export const transactionService = {
  getAll: () =>
    api.get<Transaction[]>('/transactions').then((r) => r.data),

  getById: (id: string) =>
    api.get<Transaction>(`/transactions/${id}`).then((r) => r.data),

  create: (payload: Omit<Transaction, 'id'>) =>
    api.post<Transaction>('/transactions', payload).then((r) => r.data),
}
