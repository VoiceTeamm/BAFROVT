import { Badge, Button, Table, type Column } from '../ui'
import type { Transaction } from '../../types'

interface TransactionTableProps {
  data: Transaction[]
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })
}

const columns: Column<Transaction>[] = [
  {
    key: 'date',
    header: 'Fecha',
    render: (row) => <span className="text-xs text-gray-500">{fmtDate(row.date)}</span>,
  },
  {
    key: 'note',
    header: 'Descripción',
    render: (row) => (
      <span className="text-sm text-text-light truncate max-w-[180px] block">
        {row.note ?? '—'}
      </span>
    ),
  },
  {
    key: 'category',
    header: 'Categoría',
    render: (row) => <Badge>{row.category?.name ?? '—'}</Badge>,
  },
  {
    key: 'type',
    header: 'Tipo',
    render: (row) => (
      <Badge variant={row.type === 'INCOME' ? 'success' : 'error'}>{row.type}</Badge>
    ),
  },
  {
    key: 'amount',
    header: 'Monto',
    render: (row) => (
      <span className={row.type === 'INCOME' ? 'text-success font-medium' : 'text-error font-medium'}>
        {row.type === 'INCOME' ? '+' : '-'}Bs {row.amount.toFixed(2)}
      </span>
    ),
  },
]

export function TransactionTable({ data, page, pageSize, total, onPageChange }: TransactionTableProps) {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-3">
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        emptyMessage="No hay transacciones."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500 px-1">
          <span>
            Mostrando {Math.min((page - 1) * pageSize + 1, total)}–
            {Math.min(page * pageSize, total)} de {total}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
