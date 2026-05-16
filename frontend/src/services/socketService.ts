import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') ?? ''

export const socketService = {
  connect: (token: string): Socket => {
    if (socket?.connected) return socket

    socket = io(BASE_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    return socket
  },

  disconnect: () => {
    socket?.disconnect()
    socket = null
  },

  getSocket: (): Socket | null => socket,
}
