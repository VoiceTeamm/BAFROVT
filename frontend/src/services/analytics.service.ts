import api from './api'
import type { AnalyticsSummary, AnalyticsTrend } from '../types'

export const analyticsService = {
  getSummary: () =>
    api.get<AnalyticsSummary>('/analytics/summary').then((r) => r.data),

  getTrends: () =>
    api.get<AnalyticsTrend[]>('/analytics/trends').then((r) => r.data),
}
