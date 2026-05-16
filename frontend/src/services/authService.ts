import api from './api'
import type { User } from '../types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload).then((r) => r.data),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  me: () =>
    api.get<User>('/auth/me').then((r) => r.data),
}
