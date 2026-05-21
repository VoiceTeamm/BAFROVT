import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertService } from '../services/alert.service'

export function useAlerts() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertService.getAll(),
    refetchInterval: 30_000,
  })

  const markReadMutation = useMutation({
    mutationFn: alertService.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  })

  const alerts = query.data ?? []
  const unreadCount = alerts.filter((a) => !a.isRead).length

  return {
    alerts,
    unreadCount,
    isLoading: query.isLoading,
    markRead: markReadMutation.mutate,
  }
}
