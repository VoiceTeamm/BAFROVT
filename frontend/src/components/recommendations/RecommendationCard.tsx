import { Lightbulb, TrendingUp, AlertTriangle, Zap, type LucideIcon } from 'lucide-react'
import { Card, Badge, Button } from '../ui'
import type { Recommendation } from '../../types'

interface RecommendationCardProps {
  recommendation: Recommendation
  onApply: (id: string) => void
  onDismiss: (id: string) => void
  isApplying?: boolean
  isDismissing?: boolean
}

const iconMap: Record<Recommendation['type'], LucideIcon> = {
  saving: Lightbulb,
  investment: TrendingUp,
  alert: AlertTriangle,
  tip: Zap,
}

const priorityVariant: Record<Recommendation['priority'], 'error' | 'warning' | 'primary'> = {
  high: 'error',
  medium: 'warning',
  low: 'primary',
}

const statusVariant: Record<
  NonNullable<Recommendation['status']>,
  'default' | 'success' | 'error'
> = {
  active: 'default',
  applied: 'success',
  dismissed: 'error',
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export function RecommendationCard({
  recommendation: rec,
  onApply,
  onDismiss,
  isApplying,
  isDismissing,
}: RecommendationCardProps) {
  const Icon = iconMap[rec.type]
  const isDone = rec.status === 'applied' || rec.status === 'dismissed'

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-lg bg-blue-50 p-2.5">
          <Icon size={20} className="text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-text-light text-sm">{rec.title}</h3>
            <Badge variant={priorityVariant[rec.priority]}>{rec.priority}</Badge>
            {rec.status && (
              <Badge variant={statusVariant[rec.status]}>{rec.status}</Badge>
            )}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-2">{rec.description}</p>

          {(rec.currentPrice != null || rec.suggestedPrice != null || rec.variationPct != null) && (
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
              {rec.currentPrice != null && (
                <span>
                  Current:{' '}
                  <strong className="text-text-light">{fmt(rec.currentPrice)}</strong>
                </span>
              )}
              {rec.suggestedPrice != null && (
                <span>
                  Suggested:{' '}
                  <strong className="text-primary">{fmt(rec.suggestedPrice)}</strong>
                </span>
              )}
              {rec.variationPct != null && (
                <span>
                  Change:{' '}
                  <strong
                    className={rec.variationPct >= 0 ? 'text-success' : 'text-error'}
                  >
                    {rec.variationPct > 0 ? '+' : ''}
                    {rec.variationPct.toFixed(1)}%
                  </strong>
                </span>
              )}
            </div>
          )}

          {!isDone && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                loading={isApplying}
                disabled={isDismissing}
                onClick={() => onApply(rec.id)}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                loading={isDismissing}
                disabled={isApplying}
                onClick={() => onDismiss(rec.id)}
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
