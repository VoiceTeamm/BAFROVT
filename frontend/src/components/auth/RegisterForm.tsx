import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Input, Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'

const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'retail', label: 'Retail' },
  { value: 'service', label: 'Service' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'other', label: 'Other' },
]

interface FormErrors {
  name?: string
  email?: string
  password?: string
  businessType?: string
}

function validate(name: string, email: string, password: string, businessType: string): FormErrors {
  const errors: FormErrors = {}
  if (!name.trim()) errors.name = 'Name is required'
  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email format'
  }
  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }
  if (!businessType) errors.businessType = 'Business type is required'
  return errors
}

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const { register, isRegistering, registerError } = useAuth()

  function clearError(field: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validation = validate(name, email, password, businessType)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return
    register({ name, email, password, businessType })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full name"
        type="text"
        value={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => { setName(e.target.value); clearError('name') }}
        placeholder="Jane Doe"
        error={errors.name}
        required
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); clearError('email') }}
        placeholder="you@example.com"
        error={errors.email}
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); clearError('password') }}
        placeholder="Min. 8 characters"
        error={errors.password}
        required
        minLength={8}
        autoComplete="new-password"
      />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="businessType"
          className="text-sm font-medium text-text-light"
        >
          Business type
        </label>
        <select
          id="businessType"
          value={businessType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => { setBusinessType(e.target.value); clearError('businessType') }}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-text-light transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.businessType ? 'border-error focus:ring-error' : 'border-gray-200'
          }`}
        >
          <option value="">Select business type</option>
          {BUSINESS_TYPES.map((bt) => (
            <option key={bt.value} value={bt.value}>
              {bt.label}
            </option>
          ))}
        </select>
        {errors.businessType && (
          <p className="text-xs text-error">{errors.businessType}</p>
        )}
      </div>
      {registerError && (
        <p className="text-sm text-error">{(registerError as Error).message}</p>
      )}
      <Button type="submit" fullWidth loading={isRegistering}>
        Create account
      </Button>
    </form>
  )
}
