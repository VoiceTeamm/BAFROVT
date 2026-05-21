import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { socketService } from '../services/socketService'
import { useAuthStore } from '../store/authStore'
import type { Recommendation } from '../types'

interface NewRecommendationPayload {
  recommendation: Recommendation
}

interface N8nAlertPayload {
  data: { message?: string }
}

export function useSocket() {
  const token = useAuthStore((s) => s.token)
  const [isConnected, setIsConnected] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!token) return

    const socket = socketService.connect(token)

    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onNewRecommendation(_data: NewRecommendationPayload) {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      toast('Nueva recomendación disponible', { icon: '💡' })
    }

    function onN8nAlert(data: N8nAlertPayload) {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      toast(data?.data?.message ?? 'Nueva alerta recibida', { icon: '🔔' })
    }

    function onN8nTransaction() {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('new_recommendation', onNewRecommendation)
    socket.on('n8n:alert', onN8nAlert)
    socket.on('n8n:transaction', onN8nTransaction)

    if (socket.connected) setIsConnected(true)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('new_recommendation', onNewRecommendation)
      socket.off('n8n:alert', onN8nAlert)
      socket.off('n8n:transaction', onN8nTransaction)
      socketService.disconnect()
      setIsConnected(false)
    }
  }, [token, queryClient])

  return { isConnected }
}
