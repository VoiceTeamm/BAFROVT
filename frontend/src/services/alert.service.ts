import api from './api'
import type { Alert } from '../types'

export const alertService = {
  getAll: (onlyUnread = false): Promise<Alert[]> =>
    api
      .get<Alert[]>('/alerts', { params: onlyUnread ? { unread: 'true' } : {} })
      .then((r) => r.data),

  markRead: (id: string): Promise<Alert> =>
    api
      .patch<{ alert: Alert }>(`/alerts/${id}/read`)
      .then((r) => r.data.alert),
}
