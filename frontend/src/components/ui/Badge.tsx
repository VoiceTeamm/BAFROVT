import { type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'default' | 'primary' | 'success' | 'error' | 'warning' | 'secondary'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  default:   'bg-gray-100 text-gray-600',
  primary:   'bg-blue-100 text-primary',
  success:   'bg-green-100 text-success',
  error:     'bg-red-100 text-error',
  warning:   'bg-amber-100 text-warning',
  secondary: 'bg-sky-100 text-secondary',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
