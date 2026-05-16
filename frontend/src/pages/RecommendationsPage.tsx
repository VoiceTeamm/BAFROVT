import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader } from '../components/ui'
import { RecommendationCard } from '../components/recommendations/RecommendationCard'
import { recommendationService } from '../services/recommendation.service'
import type { Recommendation } from '../types'

// TODO: remove mock data when backend is ready
const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    title: 'Reduce dining expenses',
    description:
      "You've spent 40% more on dining this month. Cooking at home 3 more times per week could save ~$120/month.",
    priority: 'high',
    type: 'saving',
    createdAt: '2026-05-15',
    status: 'active',
  },
  {
    id: '2',
    title: 'Build your emergency fund',
    description:
      'At your current savings rate, you can build a 6-month emergency fund within 8 months.',
    priority: 'medium',
    type: 'investment',
    createdAt: '2026-05-14',
    suggestedPrice: 5000,
    status: 'active',
  },
  {
    id: '3',
    title: 'Subscription audit',
    description:
      "We detected 3 recurring charges you haven't used in 90+ days. Cancel them to save ~$45/month.",
    priority: 'low',
    type: 'tip',
    createdAt: '2026-05-13',
    currentPrice: 45.99,
    suggestedPrice: 0,
    variationPct: -100,
    status: 'active',
  },
]

type LocalStatusMap = Record<string, 'active' | 'applied' | 'dismissed'>

export function RecommendationsPage() {
  const queryClient = useQueryClient()
  const [localStatus, setLocalStatus] = useState<LocalStatusMap>({})

  const { data: liveData, isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationService.getAll,
  })

  const applyMutation = useMutation({
    mutationFn: recommendationService.apply,
    onSuccess: (_data, id) => {
      setLocalStatus((s) => ({ ...s, [id]: 'applied' }))
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })

  const dismissMutation = useMutation({
    mutationFn: recommendationService.dismiss,
    onSuccess: (_data, id) => {
      setLocalStatus((s) => ({ ...s, [id]: 'dismissed' }))
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
    },
  })

  const source =
    liveData && liveData.length > 0 ? liveData : error ? MOCK_RECOMMENDATIONS : []

  const recommendations: Recommendation[] = source.map((r) => ({
    ...r,
    status: localStatus[r.id] ?? r.status,
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-light">Recommendations</h1>
      </div>

      {error && (!liveData || liveData.length === 0) && (
        <p className="text-xs text-warning px-1">
          Showing demo data — backend not reachable.
        </p>
      )}

      {recommendations.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
          No recommendations available.
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onApply={(id) => applyMutation.mutate(id)}
              onDismiss={(id) => dismissMutation.mutate(id)}
              isApplying={applyMutation.isPending && applyMutation.variables === rec.id}
              isDismissing={dismissMutation.isPending && dismissMutation.variables === rec.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
