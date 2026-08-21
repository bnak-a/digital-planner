import { useState } from 'react'
import type { Category, Priority, Task } from '../types'
import { toKey } from '../lib/date'

interface Props {
  categories: Category[]
  defaultDate: string
  defaultPriority: Priority
  onSubmit: (task: Omit<Task, 'id' | 'done'>) => void
  onCancel: () => void
}

const field =
  'w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none placeholder:text-neutral-600 focus:border-accent'

export function TaskForm({ categories, defaultDate, defaultPriority, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate || toKey(new Date()))
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [priority, setPriority] = useState<Priority>(defaultPriority)
  const [daily, setDaily] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !categoryId) return
    onSubmit({ title: title.trim(), date, categoryId, priority, daily })
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className={field} />
      <div className="grid grid-cols-2 gap-3">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={field}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4 text-sm text-neutral-300">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={priority === 'urgent'}
            onChange={(e) => setPriority(e.target.checked ? 'urgent' : 'normal')}
            className="accent-[var(--color-accent)]"
          />
          Urgent
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={daily}
            onChange={(e) => setDaily(e.target.checked)}
            className="accent-[var(--color-accent)]"
          />
          Daily task
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40"
        >
          Add task
        </button>
      </div>
    </form>
  )
}
