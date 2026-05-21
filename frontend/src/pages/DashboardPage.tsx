import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import { useAnalytics } from '../hooks/useAnalytics'
import { Card, Loader } from '../components/ui'
import { KPICard } from '../components/dashboard/KPICard'
import { SummaryPanel } from '../components/dashboard/SummaryPanel'

const CURRENCY = 'USD'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(n)
}

function periodLabel(startDate: string) {
  const d = new Date(startDate + 'T00:00:00')
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

export function DashboardPage() {
  const { summary, startDate, isLoading, error } = useAnalytics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        {error ? 'Could not load analytics — backend not reachable.' : 'No analytics data available.'}
      </div>
    )
  }

  const { totalIncome, totalExpenses, balance } = summary
  const marginPct = totalIncome > 0 ? (balance / totalIncome) * 100 : 0
  const period = periodLabel(startDate)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-text-light">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Ingresos del mes"
          value={fmt(totalIncome)}
          sub={period}
          icon={<TrendingUp size={16} />}
          valueClass="text-success"
        />
        <KPICard
          label="Egresos del mes"
          value={fmt(totalExpenses)}
          sub={period}
          icon={<TrendingDown size={16} />}
          valueClass="text-error"
        />
        <KPICard
          label="Ganancia neta"
          value={fmt(balance)}
          sub={period}
          icon={<DollarSign size={16} />}
          valueClass={balance >= 0 ? 'text-success' : 'text-error'}
        />
        <KPICard
          label="Margen %"
          value={`${marginPct.toFixed(1)}%`}
          sub={period}
          icon={<Percent size={16} />}
          valueClass={marginPct >= 20 ? 'text-success' : 'text-warning'}
        />
      </div>

      <SummaryPanel netProfit={balance} marginPct={marginPct} currency={CURRENCY} />

      <Card title="Ingresos vs Egresos" description="Weekly / monthly trend">
        <p className="py-8 text-center text-sm text-gray-400">
          Trend data not yet available from backend.
        </p>
      </Card>
    </div>
  )
}
