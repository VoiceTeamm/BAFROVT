import { cn } from '../../lib/utils'
import type { ChatMessage } from '../../store/chatStore'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-gray-100 text-text-light rounded-bl-sm',
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
