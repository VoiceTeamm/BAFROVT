import api from './api'
import type { AnalyticsSummary, AnalyticsTrend } from '../types'

export const analyticsService = {
  getSummary: () =>
    api.get<AnalyticsSummary>('/analytics/summary', { params: { period: 'month' } }).then((r) => r.data),

  getTrends: () =>
    api.get<AnalyticsTrend[]>('/analytics/trends', { params: { periods: 3 } }).then((r) => r.data),
}
