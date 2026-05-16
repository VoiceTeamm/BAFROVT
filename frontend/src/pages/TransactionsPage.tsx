import { Card, Badge, Table, type Column } from '../components/ui'
import type { Transaction } from '../types'

const mockData: Transaction[] = [
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

const columns: Column<Transaction>[] = [
  { key: 'date', header: 'Date' },
  { key: 'description', header: 'Description' },
  {
    key: 'category',
    header: 'Category',
    render: (row) => <Badge>{row.category.name}</Badge>,
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row) => (
      <span
        className={
          row.type === 'credit'
            ? 'text-success font-medium'
            : 'text-error font-medium'
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

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-text-light">Transactions</h1>
      <Card title="Transaction History" description="All your recent movements">
        <Table
          columns={columns}
          data={mockData}
          keyExtractor={(r) => r.id}
          emptyMessage="No transactions found."
        />
      </Card>
    </div>
  )
}
