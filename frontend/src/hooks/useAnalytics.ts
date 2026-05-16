import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analytics.service'

export function useAnalytics() {
  const summaryQuery = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: analyticsService.getSummary,
  })

  const trendsQuery = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: analyticsService.getTrends,
  })

  return {
    summary: summaryQuery.data ?? null,
    trends: trendsQuery.data ?? [],
    isLoading: summaryQuery.isLoading || trendsQuery.isLoading,
    error: summaryQuery.error ?? trendsQuery.error,
  }
}
