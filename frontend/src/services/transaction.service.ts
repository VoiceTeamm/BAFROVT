import api from './api'
import type { Transaction, TransactionPagination } from '../types'

export interface TransactionListResult {
  transactions: Transaction[]
  pagination: TransactionPagination
}

export interface CreateTransactionPayload {
  type: 'INCOME' | 'EXPENSE'
  amount: number
  category?: string
  description?: string
  date?: string
}

export const transactionService = {
  getAll: (page = 1, limit = 10): Promise<TransactionListResult> =>
    api
      .get<TransactionListResult>('/transactions', { params: { page, limit } })
      .then((r) => r.data),

  getById: (id: string): Promise<Transaction> =>
    api.get<Transaction>(`/transactions/${id}`).then((r) => r.data),

  create: (payload: CreateTransactionPayload): Promise<Transaction> =>
    api.post<Transaction>('/transactions', payload).then((r) => r.data),
}
