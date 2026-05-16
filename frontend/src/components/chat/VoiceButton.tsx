import { Mic, MicOff } from 'lucide-react'
import { Button } from '../ui'
import { useVoice } from '../../hooks/useVoice'
import { cn } from '../../lib/utils'

export function VoiceButton() {
  const { isRecording, error, startRecording, stopRecording, resetRecording } = useVoice()

  function handleClick() {
    if (isRecording) {
      stopRecording()
    } else {
      resetRecording()
      startRecording()
    }
  }

  return (
    <div className="relative inline-flex">
      <Button
        type="button"
        variant={isRecording ? 'danger' : 'primary'}
        size="md"
        onClick={handleClick}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        className={cn(
          'rounded-full p-3',
          isRecording && 'animate-pulse shadow-lg shadow-error/40',
        )}
      >
        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>
      {error && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-error whitespace-nowrap w-max">
          {error}
        </span>
      )}
    </div>
  )
}
