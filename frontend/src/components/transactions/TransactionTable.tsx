import { Badge, Button, Table, type Column } from '../ui'
import type { Transaction } from '../../types'

interface TransactionTableProps {
  data: Transaction[]
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

const columns: Column<Transaction>[] = [
  { key: 'date', header: 'Date' },
  { key: 'description', header: 'Description' },
  {
    key: 'category',
    header: 'Category',
    render: (row) => <Badge>{row.category.name}</Badge>,
  },
  {
    key: 'type',
    header: 'Type',
    render: (row) => (
      <Badge variant={row.type === 'credit' ? 'success' : 'error'}>
        {row.type === 'credit' ? 'INCOME' : 'EXPENSE'}
      </Badge>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row) => (
      <span
        className={
          row.type === 'credit' ? 'text-success font-medium' : 'text-error font-medium'
        }
      >
        {row.type === 'credit' ? '+' : '-'}${row.amount.toFixed(2)}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge
        variant={
          row.status === 'completed'
            ? 'success'
            : row.status === 'pending'
              ? 'warning'
              : 'error'
        }
      >
        {row.status}
      </Badge>
    ),
  },
]

export function TransactionTable({
  data,
  page,
  pageSize,
  total,
  onPageChange,
}: TransactionTableProps) {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-3">
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        emptyMessage="No transactions found."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500 px-1">
          <span>
            Showing {Math.min((page - 1) * pageSize + 1, total)}–
            {Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
