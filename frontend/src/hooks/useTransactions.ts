import { useQuery } from '@tanstack/react-query'
import { transactionService, type TransactionFilters } from '../services/transaction.service'

export function useTransactions(filters?: TransactionFilters) {
  const query = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getAll(filters),
  })

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
