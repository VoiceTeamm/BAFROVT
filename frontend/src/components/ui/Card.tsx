import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  footer?: ReactNode
}

export function Card({ title, description, footer, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-card-light shadow-sm border border-gray-100',
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {title && (
            <h3 className="text-base font-semibold text-text-light">{title}</h3>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {footer && (
        <div className="px-6 py-3 border-t border-gray-100 bg-background-light rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  )
}
