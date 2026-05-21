import { useEffect, useState } from 'react'
import { socketService } from '../services/socketService'
import { useAuthStore } from '../store/authStore'
import type { Recommendation, Alert } from '../types'

interface ChatTypingPayload {
  typing: boolean
}

interface ChatResponsePayload {
  message: string
  role: string
  timestamp: string
}

interface ChatErrorPayload {
  message: string
}

interface N8nPayload {
  data: Record<string, unknown>
}

interface NewRecommendationPayload {
  recommendation: Recommendation
}

export function useSocket() {
  const token = useAuthStore((s) => s.token)
  const [isConnected, setIsConnected] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isChatTyping, setIsChatTyping] = useState(false)
  const [chatResponse, setChatResponse] = useState<ChatResponsePayload | null>(null)
  const [chatError, setChatError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const socket = socketService.connect(token)

    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onNewRecommendation(data: NewRecommendationPayload) {
      setRecommendations((prev) => [data.recommendation, ...prev])
    }

    function onChatTyping(data: ChatTypingPayload) {
      setIsChatTyping(data.typing)
    }

    function onChatResponse(data: ChatResponsePayload) {
      setChatResponse(data)
    }

    function onChatError(data: ChatErrorPayload) {
      setChatError(data.message)
    }

    function onN8nTransaction(data: N8nPayload) {
      // Future: handle real-time transaction updates
    }

    function onN8nAlert(data: N8nPayload) {
      setAlerts((prev) => [data.data as unknown as Alert, ...prev])
    }

    function onN8nRecommendation(data: N8nPayload) {
      // Future: handle n8n recommendations
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('new_recommendation', onNewRecommendation)
    socket.on('chat:typing', onChatTyping)
    socket.on('chat:response', onChatResponse)
    socket.on('chat:error', onChatError)
    socket.on('n8n:transaction', onN8nTransaction)
    socket.on('n8n:alert', onN8nAlert)
    socket.on('n8n:recommendation', onN8nRecommendation)

    if (socket.connected) {
      setIsConnected(true)
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('new_recommendation', onNewRecommendation)
      socket.off('chat:typing', onChatTyping)
      socket.off('chat:response', onChatResponse)
      socket.off('chat:error', onChatError)
      socket.off('n8n:transaction', onN8nTransaction)
      socket.off('n8n:alert', onN8nAlert)
      socket.off('n8n:recommendation', onN8nRecommendation)
      socketService.disconnect()
      setIsConnected(false)
    }
  }, [token])

  return {
    isConnected,
    recommendations,
    alerts,
    isChatTyping,
    chatResponse,
    chatError,
  }
}
