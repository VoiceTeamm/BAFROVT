import { useState, useRef, useCallback } from 'react'

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    chunksRef.current = []

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
    recorder.onstop = () => {
      setAudioBlob(new Blob(chunksRef.current, { type: 'audio/webm' }))
      stream.getTracks().forEach((t) => t.stop())
    }

    mediaRecorderRef.current = recorder
    recorder.start()
    setIsRecording(true)
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }, [])

  const clearAudio = useCallback(() => setAudioBlob(null), [])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return { isRecording, audioBlob, startRecording, stopRecording, toggleRecording, clearAudio }
}
