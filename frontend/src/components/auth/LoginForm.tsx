import { useState, type FormEvent } from 'react'
import { Input, Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'

interface FormErrors {
  email?: string
  password?: string
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email format'
  }
  if (!password) {
    errors.password = 'Password is required'
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })) }}
        placeholder="you@example.com"
        error={errors.email}
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })) }}
        placeholder="••••••••"
        error={errors.password}
        required
        autoComplete="current-password"
      />
      {loginError && (
        <p className="text-sm text-error">{(loginError as Error).message}</p>
      )}
      <Button type="submit" fullWidth loading={isLoggingIn}>
        Sign in
      </Button>
    </form>
  )
}
