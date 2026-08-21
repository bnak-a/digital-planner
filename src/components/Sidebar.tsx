import { ChevronsLeft, ChevronsRight, PlusCircle, Shapes, X } from 'lucide-react'
import type { Category } from '../types'
import type { ProgressSet } from '../lib/progress'
import { ProgressBar } from './ProgressBar'

interface Props {
  categories: Category[]
  progress: ProgressSet
  countsByCategory: Record<string, number>
  collapsed: boolean
  onToggleCollapsed: () => void
  onNewTask: () => void
  onNewUrgentTask: () => void
  onNewCategory: () => void
  onRemoveCategory: (id: string) => void
}

function ActionButton({ label, collapsed, onClick }: { label: string; collapsed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md py-1.5 text-sm text-neutral-300 transition hover:bg-neutral-800 hover:text-white ${
        collapsed ? 'justify-center px-0' : 'px-2 text-left'
      }`}
    >
      <PlusCircle size={15} className="shrink-0 text-accent" />
      {!collapsed && label}
    </button>
  )
}

export function Sidebar({
  categories,
  progress,
  countsByCategory,
  collapsed,
  onToggleCollapsed,
  onNewTask,
  onNewUrgentTask,
  onNewCategory,
  onRemoveCategory,
}: Props) {
  return (
    <aside className={`w-full shrink-0 transition-[width] duration-200 ${collapsed ? 'lg:w-14' : 'lg:w-72'}`}>
      <div className="flex items-center justify-between">
        {!collapsed && <h2 className="text-xl font-bold">Quick Actions</h2>}
        <button
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleCollapsed}
          className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      <div className="mt-4 border-t border-neutral-800 pt-4">
        <ActionButton label="New Task" collapsed={collapsed} onClick={onNewTask} />
        <ActionButton label="New Urgent Task" collapsed={collapsed} onClick={onNewUrgentTask} />
        <ActionButton label="New Category" collapsed={collapsed} onClick={onNewCategory} />
      </div>

      <div className={`mt-6 flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
        <Shapes size={16} className="shrink-0 text-accent" />
        {!collapsed && <h3 className="font-semibold">Categories</h3>}
      </div>

      <ul className="mt-3 space-y-1">
        {categories.map((category) =>
          collapsed ? (
            <li key={category.id} className="flex justify-center py-1.5" title={category.name}>
              <span className="size-2.5 rounded-full" style={{ background: category.color }} />
            </li>
          ) : (
            <li
              key={category.id}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-800"
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: category.color }} />
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
          ),
        )}
      </ul>

      {!collapsed && (
        <div className="mt-8 space-y-4">
          <ProgressBar label="Year" value={progress.year} />
          <ProgressBar label="Month" value={progress.month} />
          <ProgressBar label="Week" value={progress.week} />
          <ProgressBar label="Day" value={progress.day} />
        </div>
      )}
    </aside>
  )
}
