import { Plus, Sun, Trash2, Zap } from 'lucide-react'
import type { Category, Task } from '../types'
import { fromKey, longDate } from '../lib/date'
import { Modal } from './Modal'

interface Props {
  dateKey: string
  tasks: Task[]
  categories: Category[]
  onClose: () => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onAdd: () => void
}

export function DayPanel({ dateKey, tasks, categories, onClose, onToggle, onRemove, onAdd }: Props) {
  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<string, Category>

  return (
    <Modal title={longDate(fromKey(dateKey))} onClose={onClose}>
      <ul className="max-h-80 space-y-1 overflow-y-auto">
        {tasks.length === 0 && <li className="py-6 text-center text-sm text-neutral-500">Nothing scheduled.</li>}
        {tasks.map((task) => (
          <li key={task.id} className="group flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-neutral-800">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
              className="accent-[var(--color-accent)]"
            />
            <span className="size-2 shrink-0 rounded-full" style={{ background: categoryById[task.categoryId]?.color }} />
            <span className={`flex-1 truncate text-sm ${task.done ? 'text-neutral-500 line-through' : ''}`}>
              {task.title}
            </span>
            {task.priority === 'urgent' && <Zap size={13} className="text-accent" />}
            {task.daily && <Sun size={13} className="text-amber-400/80" />}
            <button
              type="button"
              aria-label={`Delete ${task.title}`}
              onClick={() => onRemove(task.id)}
              className="text-neutral-600 opacity-0 transition group-hover:opacity-100 hover:text-accent"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-neutral-700 py-2 text-sm text-neutral-400 transition hover:border-accent hover:text-white"
      >
        <Plus size={14} /> Add task to this day
      </button>
    </Modal>
  )
}
