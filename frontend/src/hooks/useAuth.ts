import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
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
      toast.success(`Bienvenido, ${user.name}!`)
      navigate(ROUTES.DASHBOARD)
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Error al iniciar sesión')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      toast.success('Cuenta creada exitosamente')
      navigate(ROUTES.DASHBOARD)
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Error al crear cuenta')
    },
  })

  const logout = useCallback(() => {
    clearAuth()
    toast('Sesión cerrada')
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
