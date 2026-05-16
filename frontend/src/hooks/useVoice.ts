import { useState, useRef, useCallback } from 'react'
import { voiceService } from '../services/voiceService'

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      setTranscript(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      recorder.onerror = () => {
        setError('Recording failed')
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Microphone permission denied')
      } else {
        setError('Could not start recording')
      }
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }, [])

  const transcribeAudio = useCallback(async (blob: Blob) => {
    setIsTranscribing(true)
    setError(null)
    try {
      const { text } = await voiceService.uploadAudio(blob)
      setTranscript(text)
      return text
    } catch {
      setError('Transcription failed. Please try again.')
      return null
    } finally {
      setIsTranscribing(false)
    }
  }, [])

  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    setTranscript(null)
    setError(null)
  }, [])

  return {
    isRecording,
    audioBlob,
    isTranscribing,
    transcript,
    error,
    startRecording,
    stopRecording,
    transcribeAudio,
    resetRecording,
  }
}
