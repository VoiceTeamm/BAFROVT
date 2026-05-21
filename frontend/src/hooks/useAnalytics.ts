import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../services/analytics.service'

function currentMonthRange() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const startDate = new Date(y, m, 1).toISOString().slice(0, 10)
  const endDate = new Date(y, m + 1, 0).toISOString().slice(0, 10)
  return { startDate, endDate }
}

export function useAnalytics() {
  const { startDate, endDate } = currentMonthRange()

  const summaryQuery = useQuery({
    queryKey: ['analytics', 'summary', startDate, endDate],
    queryFn: () => analyticsService.getSummary(startDate, endDate),
  })

  return {
    summary: summaryQuery.data ?? null,
    startDate,
    endDate,
    isLoading: summaryQuery.isLoading,
    error: summaryQuery.error,
  }
}
