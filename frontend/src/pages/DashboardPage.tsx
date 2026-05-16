import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import { useAnalytics } from '../hooks/useAnalytics'
import { Card, Loader } from '../components/ui'
import { KPICard } from '../components/dashboard/KPICard'
import { SummaryPanel } from '../components/dashboard/SummaryPanel'
import { TrendsChart } from '../components/dashboard/TrendsChart'
import type { AnalyticsSummary, AnalyticsTrend } from '../types'

// TODO: remove mock data when backend is ready
const MOCK_SUMMARY: AnalyticsSummary = {
  totalBalance: 12480,
  monthlyIncome: 4200,
  monthlyExpenses: 2950,
  savingsRate: 29.76,
  currency: 'USD',
  period: 'May 2026',
}

const MOCK_TRENDS: AnalyticsTrend[] = [
  { date: 'Week 1', income: 1050, expenses: 700, balance: 350 },
  { date: 'Week 2', income: 1050, expenses: 800, balance: 250 },
  { date: 'Week 3', income: 1050, expenses: 650, balance: 400 },
  { date: 'Week 4', income: 1050, expenses: 800, balance: 250 },
]

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)
}

export function DashboardPage() {
  const { summary: liveSummary, trends: liveTrends, isLoading, error } = useAnalytics()

  // Use mock data as fallback when backend is unavailable
  const summary = liveSummary ?? (error ? MOCK_SUMMARY : null)
  const trends = liveTrends.length > 0 ? liveTrends : error ? MOCK_TRENDS : []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        No analytics data available.
      </div>
    )
  }

  const netProfit = summary.monthlyIncome - summary.monthlyExpenses
  const marginPct =
    summary.monthlyIncome > 0 ? (netProfit / summary.monthlyIncome) * 100 : 0
  const { currency } = summary

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-light">Dashboard</h1>
        {error && (
          <span className="text-xs text-warning">Demo data — backend not reachable.</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Ingresos del mes"
          value={fmt(summary.monthlyIncome, currency)}
          sub={summary.period}
          icon={<TrendingUp size={16} />}
          valueClass="text-success"
        />
        <KPICard
          label="Egresos del mes"
          value={fmt(summary.monthlyExpenses, currency)}
          sub={summary.period}
          icon={<TrendingDown size={16} />}
          valueClass="text-error"
        />
        <KPICard
          label="Ganancia neta"
          value={fmt(netProfit, currency)}
          sub={summary.period}
          icon={<DollarSign size={16} />}
          valueClass={netProfit >= 0 ? 'text-success' : 'text-error'}
        />
        <KPICard
          label="Margen %"
          value={`${marginPct.toFixed(1)}%`}
          sub={summary.period}
          icon={<Percent size={16} />}
          valueClass={marginPct >= 20 ? 'text-success' : 'text-warning'}
        />
      </div>

      <SummaryPanel netProfit={netProfit} marginPct={marginPct} currency={currency} />

      <Card title="Ingresos vs Egresos" description="Weekly / monthly trend">
        <TrendsChart data={trends} />
      </Card>
    </div>
  )
}
