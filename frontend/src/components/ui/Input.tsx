import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  helper?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, prefix, suffix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-light"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 flex items-center text-gray-400">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-light',
              'placeholder:text-gray-400',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
              error && 'border-error focus:ring-error',
              prefix && 'pl-9',
              suffix && 'pr-9',
              className,
            )}
            {...props}
          />

          {suffix && (
            <span className="absolute right-3 flex items-center text-gray-400">
              {suffix}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-error">{error}</p>}
        {helper && !error && <p className="text-xs text-gray-400">{helper}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
