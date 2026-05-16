import api from './api'

export const voiceService = {
  uploadAudio: (audio: Blob) => {
    const formData = new FormData()
    formData.append('audio', audio, 'recording.webm')
    return api
      .post<{ text: string }>('/api/voice/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}
