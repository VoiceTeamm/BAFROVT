import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { authService, type LoginPayload, type RegisterPayload } from '../services/authService'
import { ROUTES } from '../routes'

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      navigate(ROUTES.DASHBOARD)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      navigate(ROUTES.DASHBOARD)
    },
  })

  const logout = useCallback(() => {
    authService.logout().catch(() => {})
    clearAuth()
    navigate(ROUTES.LOGIN)
  }, [clearAuth, navigate])

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
