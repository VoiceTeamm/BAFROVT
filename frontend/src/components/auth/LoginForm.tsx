import { useState, type FormEvent } from 'react'
import { Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react'

interface FormErrors {
  email?: string
  password?: string
}

const inputBase =
  'w-full rounded-xl border bg-white/5 px-3.5 py-2.5 pl-10 text-sm text-text-dark placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm'

const inputError =
  'border-error/50 focus:ring-error'

const inputNormal =
  'border-white/10'

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  if (!email) {
    errors.email = 'Email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Formato de email inv&aacute;lido'
  }
  if (!password) {
    errors.password = 'Contrase&ntilde;a es requerida'
  }
  return errors
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const { login, isLoggingIn, loginError } = useAuth()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validation = validate(email, password)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return
    login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-300">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }}
            placeholder="tu@ejemplo.com"
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
            required
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-error flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3 h-3" />
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-300">
          Contrase&ntilde;a
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
            required
            autoComplete="current-password"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-error flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </p>
        )}
      </div>

      {loginError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20">
          <AlertCircle className="w-4 h-4 text-error shrink-0" />
          <p className="text-sm text-error font-medium">
            {(loginError as Error).message}
          </p>
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        loading={isLoggingIn}
        className="h-11 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
      >
        {!isLoggingIn && <LogIn className="w-4 h-4" />}
        Iniciar sesi&oacute;n
      </Button>
    </form>
  )
}
