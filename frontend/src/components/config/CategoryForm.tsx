import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, Input, Button, Badge } from '../ui'

const DEFAULT_CATEGORIES = [
  'Income',
  'Housing',
  'Food & Dining',
  'Transport',
  'Entertainment',
  'Health',
  'Education',
  'Utilities',
]

export function CategoryForm() {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [newCategory, setNewCategory] = useState('')

  const addCategory = () => {
    const trimmed = newCategory.trim()
    if (!trimmed || categories.includes(trimmed)) return
    setCategories((prev) => [...prev, trimmed])
    setNewCategory('')
  }

  const removeCategory = (name: string) =>
    setCategories((prev) => prev.filter((c) => c !== name))

  return (
    <Card title="Category Management" description="Define transaction categories">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-primary"
            >
              {cat}
              <button
                onClick={() => removeCategory(cat)}
                className="ml-0.5 text-gray-400 hover:text-error transition-colors"
                aria-label={`Remove ${cat}`}
              >
                <Trash2 size={10} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addCategory()
            }}
          />
          <Button variant="outline" size="sm" onClick={addCategory}>
            <Plus size={14} />
            Add
          </Button>
        </div>

        {/* TODO: backend category endpoint not yet connected */}
        <Badge variant="warning">
          Category changes are local only — backend not yet connected.
        </Badge>
      </div>
    </Card>
  )
}
