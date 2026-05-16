import api from './api'

export interface SendMessagePayload {
  message: string
  history: { role: string; content: string }[]
}

export interface SendMessageResponse {
  reply: string
}

export const chatService = {
  sendMessage: (payload: SendMessagePayload) =>
    api.post<SendMessageResponse>('/api/chat', payload).then((r) => r.data),
}
