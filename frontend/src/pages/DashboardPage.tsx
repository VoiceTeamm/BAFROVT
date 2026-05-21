import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'
import { useTransactions } from '../hooks/useTransactions'
import { useTrendsData, usePieData, useBarData } from '../hooks/useChartData'
import { Card, Loader } from '../components/ui'
import { KPICard } from '../components/dashboard/KPICard'
import { SummaryPanel } from '../components/dashboard/SummaryPanel'

const CURRENCY = 'BOB'
const PIE_COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

function fmt(n: number) {
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency: CURRENCY }).format(n)
}

function periodLabel(startDate: string) {
  const d = new Date(startDate + 'T00:00:00')
  return d.toLocaleString('es-BO', { month: 'long', year: 'numeric' })
}

export function DashboardPage() {
  const { summary, startDate, isLoading: analyticsLoading, error: analyticsError } = useAnalytics()
  const { transactions, isLoading: txLoading } = useTransactions(1, 100)

  const trendsData = useTrendsData(transactions)
  const pieData = usePieData(summary)
  const barData = useBarData(summary)

  const isLoading = analyticsLoading || txLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    )
  }

  if (analyticsError || !summary) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        {analyticsError ? 'No se pudo cargar el análisis — backend no disponible.' : 'Sin datos disponibles.'}
      </div>
    )
  }

  const { totalIncome, totalExpenses, balance } = summary
  const marginPct = totalIncome > 0 ? (balance / totalIncome) * 100 : 0
  const period = periodLabel(startDate)

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-text-light">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
          label="Margen"
          value={`${marginPct.toFixed(1)}%`}
          sub={period}
          icon={<Percent size={16} />}
          valueClass={marginPct >= 20 ? 'text-success' : 'text-warning'}
        />
      </div>

      <SummaryPanel netProfit={balance} marginPct={marginPct} currency={CURRENCY} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trends line chart */}
        <Card title="Ingresos vs Egresos" description="Distribución diaria del mes actual">
          {trendsData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Sin datos de tendencia este mes.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendsData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={2} dot={false} name="Ingresos" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={false} name="Egresos" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Expense distribution pie chart */}
        <Card title="Distribución por categoría" description="Basado en el mes actual">
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Sin transacciones por categoría.
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(Number(v ?? 0))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex-1 space-y-1.5">
                {pieData.map((slice, i) => (
                  <li key={slice.name} className="flex items-center gap-2 text-xs text-text-light">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="truncate">{slice.name}</span>
                    <span className="ml-auto font-medium text-gray-500">{fmt(slice.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      {/* Monthly comparison bar chart */}
      <Card title="Comparativa mensual" description="Ingresos vs egresos">
        {barData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Sin datos para comparar.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip formatter={(v) => fmt(Number(v ?? 0))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" fill="#22C55E" name="Ingresos" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" name="Egresos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  )
}
