import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, Input, Button, Loader } from '../ui'
import { useCategories } from '../../hooks/useCategories'

const selectClass =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-light ' +
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'

export function CategoryForm() {
  const { categories, isLoading, createCategory, removeCategory, isCreating, isRemoving } =
    useCategories()
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')

  const handleAdd = () => {
    const name = newName.trim()
    if (!name) return
    createCategory({ name, type: newType })
    setNewName('')
  }

  if (isLoading) {
    return (
      <Card title="Category Management" description="Define transaction categories">
        <div className="flex justify-center py-6">
          <Loader size="sm" />
        </div>
      </Card>
    )
  }

  return (
    <Card title="Category Management" description="Define transaction categories">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-primary"
            >
              {cat.name}
              <span className="text-gray-400 text-[10px]">({cat.type})</span>
              <button
                onClick={() => removeCategory(cat.id)}
                disabled={isRemoving}
                className="ml-0.5 text-gray-400 hover:text-error transition-colors disabled:opacity-50"
                aria-label={`Remove ${cat.name}`}
              >
                <Trash2 size={10} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 items-end">
          <Input
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as 'INCOME' | 'EXPENSE')}
            className={selectClass}
          >
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
          <Button variant="outline" size="sm" onClick={handleAdd} loading={isCreating}>
            <Plus size={14} />
            Add
          </Button>
        </div>
      </div>
    </Card>
  )
}
