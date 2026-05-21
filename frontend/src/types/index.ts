export interface User {
  id: string
  name: string
  email: string
  businessType?: string
}

export interface Category {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE'
  color?: string
  icon?: string
}

export interface Transaction {
  id: string
  userId?: string
  categoryId?: string
  category?: Category
  type: 'INCOME' | 'EXPENSE'
  amount: number
  note?: string
  date: string
  source?: string
  rawText?: string | null
  createdAt?: string
}

export interface TransactionPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TransactionSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  byCategory: Record<string, number>
  transactionCount: number
}

export interface Recommendation {
  id: string
  title: string
  description: string
  suggestedPrice?: number
  currentPrice?: number
  variationPct?: number
  status: 'ACTIVE' | 'APPLIED' | 'DISMISSED'
  createdAt: string
  categoryId?: string
  category?: Category
}

export type AlertType = 'COST_INCREASE' | 'LOW_MARGIN' | 'CASH_FLOW'

export interface Alert {
  id: string
  userId?: string
  message: string
  type: AlertType
  isRead: boolean
  createdAt: string
}

export interface AnalyticsTrend {
  date: string
  income: number
  expenses: number
}
