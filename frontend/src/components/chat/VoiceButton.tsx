import { Mic, MicOff } from 'lucide-react'
import { cn } from '../../lib/utils'

interface VoiceButtonProps {
  isRecording: boolean
  onClick: () => void
  disabled?: boolean
}

export function VoiceButton({ isRecording, onClick, disabled }: VoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      className={cn(
        'rounded-full p-3 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isRecording
          ? 'bg-error text-white shadow-lg animate-pulse'
          : 'bg-primary text-white hover:bg-primary-hover shadow-sm',
      )}
    >
      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  )
}
