import { useEffect, useState } from 'react'
import { socketService } from '../services/socketService'
import { useAuthStore } from '../store/authStore'
import type { Recommendation, Alert } from '../types'

interface Notification {
  id: string
  message: string
  severity: string
}

export function useSocket() {
  const token = useAuthStore((s) => s.token)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    if (!token) return

    const socket = socketService.connect(token)

    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onRecommendation(data: Recommendation) {
      setRecommendations((prev) => [data, ...prev])
    }

    function onNotification(data: Notification) {
      setNotifications((prev) => [data, ...prev])
    }

    function onAlert(data: Alert) {
      setAlerts((prev) => [data, ...prev])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('recommendation', onRecommendation)
    socket.on('notification', onNotification)
    socket.on('alert', onAlert)

    if (socket.connected) {
      setIsConnected(true)
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('recommendation', onRecommendation)
      socket.off('notification', onNotification)
      socket.off('alert', onAlert)
      socketService.disconnect()
      setIsConnected(false)
    }
  }, [token])

  return { isConnected, notifications, recommendations, alerts }
}
