import { useQuery } from '@tanstack/react-query'
import { transactionService, type TransactionListResult } from '../services/transaction.service'
import type { TransactionPagination } from '../types'

const EMPTY_PAGINATION: TransactionPagination = { page: 1, limit: 10, total: 0, totalPages: 0 }

export function useTransactions(page = 1, limit = 10) {
  const query = useQuery<TransactionListResult>({
    queryKey: ['transactions', page, limit],
    queryFn: () => transactionService.getAll(page, limit),
  })

  return {
    transactions: query.data?.transactions ?? [],
    pagination: query.data?.pagination ?? EMPTY_PAGINATION,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
