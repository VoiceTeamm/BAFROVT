import api from './api'
import type { Recommendation } from '../types'

export const recommendationService = {
  getAll: () =>
    api.get<Recommendation[]>('/recommendations').then((r) => r.data),

  markRead: (id: string) =>
    api.patch<void>(`/recommendations/${id}/read`).then((r) => r.data),

  apply: (id: string) =>
    api.patch<void>(`/recommendations/${id}/apply`).then((r) => r.data),

  dismiss: (id: string) =>
    api.patch<void>(`/recommendations/${id}/dismiss`).then((r) => r.data),
}
