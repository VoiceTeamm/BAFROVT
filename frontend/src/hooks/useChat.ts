import { useCallback } from 'react'
import { useChatStore } from '../store/chatStore'
import { chatService } from '../services/chatService'

export function useChat() {
  const messages = useChatStore((s) => s.messages)
  const isTyping = useChatStore((s) => s.isTyping)
  const addMessage = useChatStore((s) => s.addMessage)
  const setTyping = useChatStore((s) => s.setTyping)
  const clearMessages = useChatStore((s) => s.clearMessages)

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
        const { messages: currentMessages } = useChatStore.getState()
        const history = currentMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }))
        const response = await chatService.sendMessage({ message: content, history })
        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.reply,
          timestamp: new Date().toISOString(),
        })
      } catch {
        addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        })
      } finally {
        setTyping(false)
      }
    },
    [addMessage, setTyping],
  )

  return { messages, isTyping, sendMessage, clearMessages }
}
