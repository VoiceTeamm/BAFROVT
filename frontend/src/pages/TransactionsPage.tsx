import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions'
import { Button, Loader } from '../components/ui'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { TransactionForm } from '../components/transactions/TransactionForm'

const PAGE_SIZE = 10

export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)

  const { transactions, pagination, isLoading, error } = useTransactions(page, PAGE_SIZE)

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

      {error && (
        <p className="text-xs text-warning px-1">
          Could not load transactions — backend not reachable.
        </p>
      )}

      <TransactionTable
        data={transactions}
        page={page}
        pageSize={PAGE_SIZE}
        total={pagination.total}
        onPageChange={(p) => setPage(p)}
      />

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
