import api from './api'

export interface ChatResponse {
  message: string
  timestamp: string
}

export const chatService = {
  sendMessage: (content: string) =>
    api.post<ChatResponse>('/chat/message', { content }).then((r) => r.data),

  getHistory: () =>
    api.get<ChatResponse[]>('/chat/history').then((r) => r.data),
}
