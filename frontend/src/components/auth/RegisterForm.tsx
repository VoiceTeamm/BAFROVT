import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { User, Mail, Lock, UserPlus, AlertCircle, ChevronDown } from 'lucide-react'

const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'retail', label: 'Tienda' },
  { value: 'service', label: 'Servicio' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'other', label: 'Otro' },
]

interface FormErrors {
  name?: string
  email?: string
  password?: string
  businessType?: string
}

const inputBase =
  'w-full rounded-xl border bg-white/5 px-3.5 py-2 pl-10 text-sm text-text-dark placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm'

const inputError =
  'border-error/50 focus:ring-error'

const inputNormal =
  'border-white/10'

function validate(name: string, email: string, password: string, businessType: string): FormErrors {
  const errors: FormErrors = {}
  if (!name.trim()) errors.name = 'Nombre es requerido'
  if (!email) {
    errors.email = 'Email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Formato de email inv&aacute;lido'
  }
  if (!password) {
    errors.password = 'Contrase&ntilde;a es requerida'
  } else if (password.length < 8) {
    errors.password = 'M&iacute;nimo 8 caracteres'
  }
  if (!businessType) errors.businessType = 'Selecciona un tipo de negocio'
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
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">
          Nombre completo
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <User className="w-4 h-4" />
          </div>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setName(e.target.value); clearError('name') }}
            placeholder="Juan P&eacute;rez"
            className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
            required
            autoComplete="name"
          />
        </div>
        {errors.name && (
          <p className="text-xs text-error flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3 h-3" />
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); clearError('email') }}
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

      <div className="flex flex-col gap-1">
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); clearError('password') }}
            placeholder="M&iacute;n. 8 caracteres"
            className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-error flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="businessType" className="text-sm font-medium text-gray-300">
          Tipo de negocio
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <User className="w-4 h-4" />
          </div>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
          <select
            id="businessType"
            value={businessType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setBusinessType(e.target.value); clearError('businessType') }}
            className={`${inputBase} appearance-none cursor-pointer ${errors.businessType ? inputError : inputNormal}`}
          >
            <option value="" disabled className="text-gray-500">
              Selecciona tu negocio
            </option>
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt.value} value={bt.value} className="text-text-light">
                {bt.label}
              </option>
            ))}
          </select>
        </div>
        {errors.businessType && (
          <p className="text-xs text-error flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3 h-3" />
            {errors.businessType}
          </p>
        )}
      </div>

      {registerError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20">
          <AlertCircle className="w-4 h-4 text-error shrink-0" />
          <p className="text-sm text-error font-medium">
            {(registerError as Error).message}
          </p>
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        loading={isRegistering}
        className="h-10 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
      >
        {!isRegistering && <UserPlus className="w-4 h-4" />}
        Crear cuenta
      </Button>
    </form>
  )
}
