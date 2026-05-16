import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Send, Mic } from 'lucide-react'
import { Button } from '../ui'
import { cn } from '../../lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  onVoice?: () => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  onVoice,
  disabled,
  placeholder = 'Ask your financial assistant…',
}: ChatInputProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    onSend(value.trim())
    setValue('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSend(value.trim())
        setValue('')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-4 border-t border-gray-100 bg-card-light"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          'flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      />
      {onVoice && (
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onVoice}
          disabled={disabled}
          aria-label="Voice input"
        >
          <Mic size={16} />
        </Button>
      )}
      <Button
        type="submit"
        size="md"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <Send size={16} />
      </Button>
    </form>
  )
}
