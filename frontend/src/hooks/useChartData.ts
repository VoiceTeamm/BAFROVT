import { useMemo } from 'react'
import type { Transaction, TransactionSummary, AnalyticsTrend } from '../types'

function toShortDate(isoDate: string) {
  const d = new Date(isoDate)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function useTrendsData(transactions: Transaction[]): AnalyticsTrend[] {
  return useMemo(() => {
    const byDay = new Map<string, { income: number; expenses: number }>()

    for (const t of transactions) {
      const key = toShortDate(t.date)
      const entry = byDay.get(key) ?? { income: 0, expenses: 0 }
      if (t.type === 'INCOME') entry.income += t.amount
      else entry.expenses += t.amount
      byDay.set(key, entry)
    }

    return Array.from(byDay.entries())
      .map(([date, v]) => ({ date, income: v.income, expenses: v.expenses }))
      .sort((a, b) => {
        const [am, ad] = a.date.split('/').map(Number)
        const [bm, bd] = b.date.split('/').map(Number)
        return am !== bm ? am - bm : ad - bd
      })
  }, [transactions])
}

export interface PieSlice {
  name: string
  value: number
}

export function usePieData(summary: TransactionSummary | null): PieSlice[] {
  return useMemo(() => {
    if (!summary) return []
    return Object.entries(summary.byCategory)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
  }, [summary])
}

export interface BarItem {
  label: string
  income: number
  expenses: number
}

export function useBarData(summary: TransactionSummary | null): BarItem[] {
  return useMemo(() => {
    if (!summary) return []
    const month = new Date().toLocaleString('es-BO', { month: 'short' })
    return [{ label: month, income: summary.totalIncome, expenses: summary.totalExpenses }]
  }, [summary])
}
