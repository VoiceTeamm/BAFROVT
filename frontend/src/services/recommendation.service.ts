import api from './api'
import type { Recommendation } from '../types'

export const recommendationService = {
  getAll: (): Promise<Recommendation[]> =>
    api
      .get<{ recommendations: Recommendation[] }>('/recommendations', {
        params: { status: 'ACTIVE' },
      })
      .then((r) => r.data.recommendations),

  apply: (id: string): Promise<Recommendation> =>
    api
      .patch<{ recommendation: Recommendation }>(`/recommendations/${id}`, { status: 'APPLIED' })
      .then((r) => r.data.recommendation),

  dismiss: (id: string): Promise<Recommendation> =>
    api
      .patch<{ recommendation: Recommendation }>(`/recommendations/${id}`, { status: 'DISMISSED' })
      .then((r) => r.data.recommendation),
}
