import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  emptyMessage?: string
  className?: string
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available.',
  className,
}: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-gray-100 bg-card-light shadow-sm', className)}>
      <table className="w-full text-sm">
        <thead className="bg-background-light border-b border-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-blue-50/40 transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-text-light">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
