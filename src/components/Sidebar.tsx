import { PlusCircle, Shapes, X } from 'lucide-react'
import type { Category } from '../types'
import type { ProgressSet } from '../lib/progress'
import { ProgressBar } from './ProgressBar'

interface Props {
  categories: Category[]
  progress: ProgressSet
  countsByCategory: Record<string, number>
  onNewTask: () => void
  onNewUrgentTask: () => void
  onNewCategory: () => void
  onRemoveCategory: (id: string) => void
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
    >
      <PlusCircle size={15} className="text-accent" />
      {label}
    </button>
  )
}

export function Sidebar({
  categories,
  progress,
  countsByCategory,
  onNewTask,
  onNewUrgentTask,
  onNewCategory,
  onRemoveCategory,
}: Props) {
  return (
    <aside className="w-full shrink-0 lg:w-72">
      <h2 className="text-xl font-bold">Quick Actions</h2>
      <div className="mt-4 border-t border-neutral-800 pt-4">
        <ActionButton label="New Task" onClick={onNewTask} />
        <ActionButton label="New Urgent Task" onClick={onNewUrgentTask} />
        <ActionButton label="New Category" onClick={onNewCategory} />
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Shapes size={16} className="text-accent" />
        <h3 className="font-semibold">Categories</h3>
      </div>

      <ul className="mt-3 space-y-1">
        {categories.map((category) => (
          <li key={category.id} className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-800">
            <span className="size-2.5 rounded-full" style={{ background: category.color }} />
            <span className="flex-1 truncate text-sm text-neutral-300">{category.name}</span>
            <span className="text-xs text-neutral-500">{countsByCategory[category.id] ?? 0}</span>
            <button
              type="button"
              aria-label={`Delete ${category.name}`}
              onClick={() => onRemoveCategory(category.id)}
              className="opacity-0 transition group-hover:opacity-100 hover:text-accent"
            >
              <X size={13} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-4">
        <ProgressBar label="Year" value={progress.year} />
        <ProgressBar label="Month" value={progress.month} />
        <ProgressBar label="Week" value={progress.week} />
        <ProgressBar label="Day" value={progress.day} />
      </div>
    </aside>
  )
}
