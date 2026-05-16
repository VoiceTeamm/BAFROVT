import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Modal, Input, Button } from '../ui'
import { transactionService } from '../../services/transaction.service'
import type { Transaction } from '../../types'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
}

interface FormState {
  type: 'credit' | 'debit'
  category: string
  amount: string
  note: string
  date: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const INITIAL: FormState = {
  type: 'credit',
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

  const mutation = useMutation({
    mutationFn: (payload: Omit<Transaction, 'id'>) => transactionService.create(payload),
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
    if (!form.category.trim()) errs.category = 'Category is required'
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
    mutation.mutate({
      type: form.type,
      category: {
        id: form.category.toLowerCase().replace(/\s+/g, '-'),
        name: form.category.trim(),
      },
      amount: Number(form.amount),
      description: form.note.trim(),
      date: form.date,
      currency: 'USD',
      status: 'completed',
    })
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
            onChange={(e) => set('type', e.target.value as 'credit' | 'debit')}
            className={selectClass}
          >
            <option value="credit">INCOME</option>
            <option value="debit">EXPENSE</option>
          </select>
        </div>

        <Input
          label="Category"
          placeholder="e.g. Food & Dining"
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          error={errors.category}
        />

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
