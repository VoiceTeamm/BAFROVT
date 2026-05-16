import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions'
import { Card, Button, Loader } from '../components/ui'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { FilterBar, type FilterValues } from '../components/transactions/FilterBar'
import { TransactionForm } from '../components/transactions/TransactionForm'
import type { Transaction } from '../types'

// TODO: remove mock data when backend is ready
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2026-05-15',
    description: 'Salary deposit',
    amount: 4200,
    currency: 'USD',
    category: { id: 'income', name: 'Income' },
    status: 'completed',
    type: 'credit',
  },
  {
    id: '2',
    date: '2026-05-14',
    description: 'Rent payment',
    amount: 1100,
    currency: 'USD',
    category: { id: 'housing', name: 'Housing' },
    status: 'completed',
    type: 'debit',
  },
  {
    id: '3',
    date: '2026-05-13',
    description: 'Grocery store',
    amount: 87.4,
    currency: 'USD',
    category: { id: 'food', name: 'Food & Dining' },
    status: 'completed',
    type: 'debit',
  },
  {
    id: '4',
    date: '2026-05-12',
    description: 'Streaming subscription',
    amount: 15.99,
    currency: 'USD',
    category: { id: 'entertainment', name: 'Entertainment' },
    status: 'pending',
    type: 'debit',
  },
]

const PAGE_SIZE = 10

const INITIAL_FILTERS: FilterValues = { from: '', to: '', category: '', type: 'all' }

export function TransactionsPage() {
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)

  // Filters are forwarded as query params — the backend receives them directly
  const { transactions: liveData, isLoading, error } = useTransactions(filters)

  // When backend returns data it is already filtered; only apply client-side filter on the mock fallback
  const allTransactions = useMemo(() => {
    if (liveData.length > 0) return liveData
    if (!error) return []
    return MOCK_TRANSACTIONS.filter((tx) => {
      if (filters.from && tx.date < filters.from) return false
      if (filters.to && tx.date > filters.to) return false
      if (
        filters.category &&
        !tx.category.name.toLowerCase().includes(filters.category.toLowerCase())
      )
        return false
      if (filters.type !== 'all' && tx.type !== filters.type) return false
      return true
    })
  }, [liveData, error, filters])

  const paginated = useMemo(
    () => allTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [allTransactions, page],
  )

  const handleFilterChange = (vals: FilterValues) => {
    setFilters(vals)
    setPage(1)
  }

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
        <h1 className="text-xl font-bold text-text-light">Transactions</h1>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus size={14} />
          New Transaction
        </Button>
      </div>

      <Card>
        <FilterBar
          values={filters}
          onChange={handleFilterChange}
          onReset={() => {
            setFilters(INITIAL_FILTERS)
            setPage(1)
          }}
        />
      </Card>

      {error && liveData.length === 0 && (
        <p className="text-xs text-warning px-1">
          Showing demo data — backend not reachable.
        </p>
      )}

      <TransactionTable
        data={paginated}
        page={page}
        pageSize={PAGE_SIZE}
        total={allTransactions.length}
        onPageChange={setPage}
      />

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
