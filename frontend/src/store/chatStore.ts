import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  addMessage: (msg: ChatMessage) => void
  setTyping: (typing: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setTyping: (isTyping) => set({ isTyping }),
  clearMessages: () => set({ messages: [], isTyping: false }),
}))
