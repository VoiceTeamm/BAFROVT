import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000'

export const socketService = {
  connect: (token: string): Socket => {
    if (socket?.connected) return socket

    socket = io(SOCKET_URL, {
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
