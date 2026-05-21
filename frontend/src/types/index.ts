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
  type: 'INCOME' | 'EXPENSE'
  color?: string
  icon?: string
}

export interface Transaction {
  id: string
  date: string
  description?: string
  amount: number
  category?: string
  categoryId?: string
  type: 'INCOME' | 'EXPENSE'
  createdAt?: string
  updatedAt?: string
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

export interface Alert {
  id: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: string
}
