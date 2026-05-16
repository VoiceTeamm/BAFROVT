import { useQuery } from '@tanstack/react-query'
import { transactionService } from '../services/transaction.service'

export function useTransactions() {
  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionService.getAll,
  })

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
