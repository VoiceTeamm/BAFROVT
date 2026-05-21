import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Modal, Input, Button } from '../ui'
import { transactionService, type CreateTransactionPayload } from '../../services/transaction.service'
import { useCategories } from '../../hooks/useCategories'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
}

interface FormState {
  type: 'INCOME' | 'EXPENSE'
  category: string
  amount: string
  note: string
  date: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const INITIAL: FormState = {
  type: 'INCOME',
  category: '',
  amount: '',
  note: '',
  date: new Date().toISOString().slice(0, 10),
}

const selectClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-light ' +
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'

export function TransactionForm({ open, onClose }: TransactionFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const queryClient = useQueryClient()
  const { categories } = useCategories()

  const mutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setForm(INITIAL)
      setErrors({})
      onClose()
    },
  })

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): FormErrors => {
    const errs: FormErrors = {}
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid positive amount'
    if (!form.note.trim()) errs.note = 'Note is required'
    if (!form.date) errs.date = 'Date is required'
    return errs
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const payload: CreateTransactionPayload = {
      type: form.type,
      amount: Number(form.amount),
      description: form.note.trim(),
      date: new Date(form.date).toISOString(),
    }
    if (form.category) payload.category = form.category
    mutation.mutate(payload)
  }

  const handleClose = () => {
    setForm(INITIAL)
    setErrors({})
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Transaction"
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={mutation.isPending}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {mutation.isError && (
          <p className="text-xs text-error rounded-lg bg-red-50 px-3 py-2">
            Failed to save. Please try again.
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-light">Type</label>
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value as 'INCOME' | 'EXPENSE')}
            className={selectClass}
          >
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-light">Category</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className={selectClass}
          >
            <option value="">— No category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
          error={errors.amount}
          prefix={<span className="text-xs font-medium">$</span>}
        />

        <Input
          label="Note"
          placeholder="Description or note"
          value={form.note}
          onChange={(e) => set('note', e.target.value)}
          error={errors.note}
        />

        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          error={errors.date}
        />
      </div>
    </Modal>
  )
}
