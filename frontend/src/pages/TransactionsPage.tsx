import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions'
import { Button, Card, Loader } from '../components/ui'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { TransactionCard } from '../components/transactions/TransactionCard'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { FilterBar, type FilterValues } from '../components/transactions/FilterBar'

const PAGE_SIZE = 10

const INITIAL_FILTERS: FilterValues = { from: '', to: '', category: '', type: 'all' }

export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS)

  const { transactions, pagination, isLoading, error } = useTransactions(page, PAGE_SIZE)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.from && t.date < filters.from) return false
      if (filters.to && t.date > filters.to + 'T23:59:59') return false
      if (filters.type === 'credit' && t.type !== 'INCOME') return false
      if (filters.type === 'debit' && t.type !== 'EXPENSE') return false
      if (filters.category) {
        const catName = t.category?.name ?? ''
        if (!catName.toLowerCase().includes(filters.category.toLowerCase())) return false
      }
      return true
    })
  }, [transactions, filters])

  const hasFilters = filters.from || filters.to || filters.category || filters.type !== 'all'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-light">Transacciones</h1>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus size={14} />
          Nueva
        </Button>
      </div>

      <Card>
        <FilterBar
          values={filters}
          onChange={(v) => { setFilters(v); setPage(1) }}
          onReset={() => { setFilters(INITIAL_FILTERS); setPage(1) }}
        />
      </Card>

      {error && (
        <p className="text-xs text-warning px-1">
          No se pudieron cargar las transacciones.
        </p>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
          {hasFilters ? 'No hay transacciones que coincidan con los filtros.' : 'Aún no hay transacciones.'}
        </div>
      ) : (
        <>
          {/* Card list on mobile */}
          <div className="flex flex-col gap-2 md:hidden">
            {filtered.map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </div>

          {/* Table on desktop */}
          <div className="hidden md:block">
            <TransactionTable
              data={filtered}
              page={page}
              pageSize={PAGE_SIZE}
              total={hasFilters ? filtered.length : pagination.total}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
