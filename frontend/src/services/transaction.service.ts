import api from './api'
import type { Transaction } from '../types'

export interface TransactionFilters {
  from?: string
  to?: string
  category?: string
  type?: 'all' | 'credit' | 'debit'
}

export const transactionService = {
  getAll: (filters?: TransactionFilters) => {
    const params: Record<string, string> = {}
    if (filters?.from) params.from = filters.from
    if (filters?.to) params.to = filters.to
    if (filters?.category) params.category = filters.category
    if (filters?.type && filters.type !== 'all') params.type = filters.type
    return api.get<Transaction[]>('/transactions', { params }).then((r) => r.data)
  },

  getById: (id: string) =>
    api.get<Transaction>(`/transactions/${id}`).then((r) => r.data),

  create: (payload: Omit<Transaction, 'id'>) =>
    api.post<Transaction>('/transactions', payload).then((r) => r.data),
}
