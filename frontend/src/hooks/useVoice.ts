import { useState, useRef, useCallback } from 'react'

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
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

  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    setError(null)
  }, [])

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  }
}
