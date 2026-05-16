import { useEffect, useRef } from 'react'
import type { Socket } from 'socket.io-client'
import { socketService } from '../services/socketService'
import { useAuthStore } from '../store/authStore'

export function useSocket(): Socket | null {
  const socketRef = useRef<Socket | null>(null)
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (!token) return

    socketRef.current = socketService.connect(token)

    return () => {
      socketService.disconnect()
      socketRef.current = null
    }
  }, [token])

  return socketRef.current
}
