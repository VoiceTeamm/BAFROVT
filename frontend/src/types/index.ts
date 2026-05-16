export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
}

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  category: Category
  status: 'completed' | 'pending' | 'failed'
  type: 'credit' | 'debit'
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  type: 'saving' | 'investment' | 'alert' | 'tip'
  createdAt: string
  suggestedPrice?: number
  currentPrice?: number
  variationPct?: number
  status?: 'active' | 'applied' | 'dismissed'
}

export interface Alert {
  id: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: string
}

export interface AnalyticsSummary {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  currency: string
  period: string
}

export interface AnalyticsTrend {
  date: string
  income: number
  expenses: number
  balance: number
}
