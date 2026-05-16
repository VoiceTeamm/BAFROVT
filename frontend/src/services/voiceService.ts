import api from './api'

export const voiceService = {
  transcribe: (audio: Blob) => {
    const form = new FormData()
    form.append('audio', audio, 'recording.webm')
    return api
      .post<{ text: string }>('/voice/transcribe', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  synthesize: (text: string) =>
    api
      .post<Blob>('/voice/synthesize', { text }, { responseType: 'blob' })
      .then((r) => r.data),
}
