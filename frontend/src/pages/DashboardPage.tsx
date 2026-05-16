import { Card, Badge, Table, type Column } from '../components/ui'

interface TxRow {
  id: string
  date: string
  description: string
  amount: string
  status: 'success' | 'pending' | 'error'
}

const mockTransactions: TxRow[] = [
  { id: '1', date: '2026-05-15', description: 'Salary deposit',   amount: '+$4,200.00', status: 'success' },
  { id: '2', date: '2026-05-14', description: 'Rent payment',     amount: '-$1,100.00', status: 'success' },
  { id: '3', date: '2026-05-13', description: 'Wire transfer',    amount: '-$350.00',   status: 'pending' },
]

const columns: Column<TxRow>[] = [
  { key: 'date',        header: 'Date' },
  { key: 'description', header: 'Description' },
  { key: 'amount',      header: 'Amount' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'success' ? 'success' : row.status === 'pending' ? 'warning' : 'error'}>
        {row.status}
      </Badge>
    ),
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-text-light">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Balance" description="All accounts">
          <p className="text-3xl font-bold text-primary">$12,480.00</p>
        </Card>
        <Card title="Monthly Income" description="May 2026">
          <p className="text-3xl font-bold text-success">+$4,200.00</p>
        </Card>
        <Card title="Monthly Expenses" description="May 2026">
          <p className="text-3xl font-bold text-error">-$2,950.00</p>
        </Card>
      </div>

      <Card title="Recent Transactions">
        <Table
          columns={columns}
          data={mockTransactions}
          keyExtractor={(r) => r.id}
          emptyMessage="No transactions yet."
        />
      </Card>
    </div>
  )
}
