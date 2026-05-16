import { useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { Button } from '../ui'
import { useVoice } from '../../hooks/useVoice'
import { cn } from '../../lib/utils'

interface VoiceButtonProps {
  onTranscript?: (text: string) => void
}

export function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const {
    isRecording,
    audioBlob,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    transcribeAudio,
    resetRecording,
  } = useVoice()

  useEffect(() => {
    if (audioBlob) {
      transcribeAudio(audioBlob)
    }
  }, [audioBlob, transcribeAudio])

  useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript)
      resetRecording()
    }
  }, [transcript, onTranscript, resetRecording])

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
        disabled={isTranscribing}
        loading={isTranscribing}
        aria-label={
          isRecording
            ? 'Stop recording'
            : isTranscribing
              ? 'Transcribing…'
              : 'Start recording'
        }
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
