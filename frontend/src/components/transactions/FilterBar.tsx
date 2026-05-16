import { Input, Button } from '../ui'

export interface FilterValues {
  from: string
  to: string
  category: string
  type: 'all' | 'credit' | 'debit'
}

interface FilterBarProps {
  values: FilterValues
  onChange: (values: FilterValues) => void
  onReset: () => void
}

const selectClass =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-light ' +
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'

export function FilterBar({ values, onChange, onReset }: FilterBarProps) {
  const set = <K extends keyof FilterValues>(key: K, val: FilterValues[K]) =>
    onChange({ ...values, [key]: val })

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Input
        label="From"
        type="date"
        value={values.from}
        onChange={(e) => set('from', e.target.value)}
        className="w-36"
      />
      <Input
        label="To"
        type="date"
        value={values.to}
        onChange={(e) => set('to', e.target.value)}
        className="w-36"
      />
      <Input
        label="Category"
        placeholder="All categories"
        value={values.category}
        onChange={(e) => set('category', e.target.value)}
        className="w-44"
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-light">Type</label>
        <select
          value={values.type}
          onChange={(e) => set('type', e.target.value as FilterValues['type'])}
          className={selectClass}
        >
          <option value="all">All</option>
          <option value="credit">INCOME</option>
          <option value="debit">EXPENSE</option>
        </select>
      </div>
      <Button variant="ghost" size="sm" onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}
