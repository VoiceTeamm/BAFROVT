import { Lightbulb, TrendingUp, AlertTriangle, Zap } from 'lucide-react'
import { Card, Badge } from '../components/ui'
import type { Recommendation } from '../types'

const iconMap: Record<Recommendation['type'], React.ElementType> = {
  saving:     Lightbulb,
  investment: TrendingUp,
  alert:      AlertTriangle,
  tip:        Zap,
}

const priorityVariant: Record<Recommendation['priority'], 'error' | 'warning' | 'primary'> = {
  high:   'error',
  medium: 'warning',
  low:    'primary',
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Reduce dining expenses',
    description:
      "You've spent 40% more on dining this month. Cooking at home 3 more times per week could save ~$120/month.",
    priority: 'high',
    type: 'saving',
    createdAt: '2026-05-15',
  },
  {
    id: '2',
    title: 'Build your emergency fund',
    description:
      'At your current savings rate, you can build a 6-month emergency fund within 8 months.',
    priority: 'medium',
    type: 'investment',
    createdAt: '2026-05-14',
  },
  {
    id: '3',
    title: 'Subscription audit',
    description:
      "We detected 3 recurring charges you haven't used in 90+ days. Cancel them to save ~$45/month.",
    priority: 'low',
    type: 'tip',
    createdAt: '2026-05-13',
  },
]

export function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-text-light">Recommendations</h1>

      <div className="space-y-3">
        {mockRecommendations.map((rec) => {
          const Icon = iconMap[rec.type]
          return (
            <Card key={rec.id}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-lg bg-blue-50 p-2.5">
                  <Icon size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-light text-sm">
                      {rec.title}
                    </h3>
                    <Badge variant={priorityVariant[rec.priority]}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
