import { TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '../ui'
import { cn } from '../../lib/utils'
import type { Transaction } from '../../types'

interface TransactionCardProps {
  transaction: Transaction
  className?: string
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function TransactionCard({ transaction: t, className }: TransactionCardProps) {
  const isIncome = t.type === 'INCOME'
  const categoryName = t.category?.name ?? '—'

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl bg-card-light border border-gray-100 px-4 py-3 shadow-sm',
        className,
      )}
    >
      <div
        className={cn(
          'shrink-0 flex items-center justify-center w-9 h-9 rounded-lg',
          isIncome ? 'bg-green-50' : 'bg-red-50',
        )}
      >
        {isIncome ? (
          <TrendingUp size={16} className="text-success" />
        ) : (
          <TrendingDown size={16} className="text-error" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-light truncate">{t.note ?? '—'}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant={isIncome ? 'success' : 'error'} className="text-[10px]">
            {t.type}
          </Badge>
          <span className="text-xs text-gray-400">{categoryName}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">{fmtDate(t.date)}</span>
        </div>
      </div>

      <span
        className={cn(
          'shrink-0 text-sm font-semibold',
          isIncome ? 'text-success' : 'text-error',
        )}
      >
        {isIncome ? '+' : '-'}Bs {fmt(t.amount)}
      </span>
    </div>
  )
}
