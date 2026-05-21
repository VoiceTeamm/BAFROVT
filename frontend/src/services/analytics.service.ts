import api from './api'
import type { TransactionSummary } from '../types'

export const analyticsService = {
  getSummary: (startDate: string, endDate: string) =>
    api
      .get<TransactionSummary>('/transactions/summary', { params: { startDate, endDate } })
      .then((r) => r.data),
}
