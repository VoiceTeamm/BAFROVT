import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface KPICardProps {
  label: string
  value: string
  sub?: string
  icon?: ReactNode
  valueClass?: string
  className?: string
}

export function KPICard({ label, value, sub, icon, valueClass, className }: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-card-light shadow-sm border border-gray-100 px-6 py-5',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <p className={cn('text-2xl font-bold text-text-light', valueClass)}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}
