import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { Loader } from './Loader'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover shadow-sm',
  secondary:
    'bg-secondary text-text-light hover:bg-sky-400 active:bg-sky-400 shadow-sm',
  outline:
    'border border-primary text-primary bg-transparent hover:bg-blue-50 active:bg-blue-100',
  ghost:
    'bg-transparent text-primary hover:bg-blue-50 active:bg-blue-100',
  danger:
    'bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && <Loader size="sm" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
