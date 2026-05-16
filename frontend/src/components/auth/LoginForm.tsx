import { useState, type FormEvent } from 'react'
import { Input, Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoggingIn, loginError } = useAuth()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
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
