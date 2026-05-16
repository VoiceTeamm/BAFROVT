import { cn } from '../../lib/utils'

interface SummaryPanelProps {
  netProfit: number
  marginPct: number
  currency?: string
  className?: string
}

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)
}

export function SummaryPanel({ netProfit, marginPct, currency = 'USD', className }: SummaryPanelProps) {
  const positive = netProfit >= 0

  return (
    <div className={cn('rounded-xl bg-primary text-white px-6 py-5 shadow-sm', className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-3">
        Net Summary
      </p>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold">
            {positive ? '+' : ''}
            {fmt(netProfit, currency)}
          </p>
          <p className="mt-0.5 text-sm text-blue-200">Ganancia neta del mes</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{marginPct.toFixed(1)}%</p>
          <p className="text-sm text-blue-200">Margen</p>
        </div>
      </div>
    </div>
  )
}
