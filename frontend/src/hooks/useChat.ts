import { useCallback } from 'react'
import { useChatStore } from '../store/chatStore'
import { chatService } from '../services/chatService'

export function useChat() {
  const { messages, isTyping, addMessage, setTyping, clearMessages } = useChatStore()

  const sendMessage = useCallback(
    async (content: string) => {
      addMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      })
      setTyping(true)

      try {
        const response = await chatService.sendMessage(content)
        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          timestamp: response.timestamp,
        })
      } finally {
        setTyping(false)
      }
    },
    [addMessage, setTyping],
  )

  return { messages, isTyping, sendMessage, clearMessages }
}
