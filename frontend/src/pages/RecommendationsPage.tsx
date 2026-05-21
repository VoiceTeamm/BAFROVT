import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader } from '../components/ui'
import { RecommendationCard } from '../components/recommendations/RecommendationCard'
import { recommendationService } from '../services/recommendation.service'
import type { Recommendation } from '../types'

function derivePriority(rec: Recommendation): 'high' | 'medium' | 'low' {
  if (!rec.variationPct) return 'medium'
  if (rec.variationPct >= 30) return 'high'
  if (rec.variationPct >= 15) return 'medium'
  return 'low'
}

export function RecommendationsPage() {
  const queryClient = useQueryClient()

  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationService.getAll,
  })

  const applyMutation = useMutation({
    mutationFn: recommendationService.apply,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
  })

  const dismissMutation = useMutation({
    mutationFn: recommendationService.dismiss,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
  })

  const active = recommendations.filter((r) => r.status === 'ACTIVE')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-text-light">Recommendations</h1>

      {error && (
        <p className="text-xs text-warning px-1">
          Could not load recommendations — backend not reachable.
        </p>
      )}

      {active.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
          No active recommendations.
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={{ ...rec, priority: derivePriority(rec) }}
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
