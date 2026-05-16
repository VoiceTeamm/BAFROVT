import { useState, type FormEvent } from 'react'
import { Input, Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register, isRegistering, registerError } = useAuth()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    register({ name, email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Doe"
        required
        autoComplete="name"
      />
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
        placeholder="Min. 8 characters"
        required
        minLength={8}
        autoComplete="new-password"
      />
      {registerError && (
        <p className="text-sm text-error">{(registerError as Error).message}</p>
      )}
      <Button type="submit" fullWidth loading={isRegistering}>
        Create account
      </Button>
    </form>
  )
}
