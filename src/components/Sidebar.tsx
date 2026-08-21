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

/**
 * Where the calendar column starts on `lg` screens: the sidebar's own width
 * (the `lg:w-14` / `lg:w-72` classes below) plus the `gap-10` between them.
 * The header uses this to line the clock up with the calendar.
 */
export function calendarColumnOffset(collapsed: boolean): string {
  return collapsed ? 'calc(3.5rem + 2.5rem)' : 'calc(18rem + 2.5rem)'
}

/**
 * Collapsing means two different things by breakpoint. From `lg` up the sidebar
 * is its own column, so it shrinks to an icon rail. Below that it is a stacked
 * full-width block where a centered rail would just be a band of empty space,
 * so the body is hidden outright and only the toggle row stays.
 */
const railBody = 'hidden lg:block'
const railHidden = 'hidden'
const railCenter = 'lg:justify-center'

function ActionButton({ label, collapsed, onClick }: { label: string; collapsed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md py-1.5 text-left text-sm text-neutral-300 transition hover:bg-neutral-800 hover:text-white ${
        collapsed ? `px-2 ${railCenter} lg:px-0` : 'px-2'
      }`}
    >
      <PlusCircle size={15} className="shrink-0 text-accent" />
      <span className={collapsed ? railHidden : ''}>{label}</span>
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
      <div className={`flex items-center justify-between ${collapsed ? railCenter : ''}`}>
        <h2 className={`text-xl font-bold ${collapsed ? railHidden : ''}`}>Quick Actions</h2>
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

      <div className={collapsed ? railBody : ''}>
        <div className="mt-4 border-t border-neutral-800 pt-4">
          <ActionButton label="New Task" collapsed={collapsed} onClick={onNewTask} />
          <ActionButton label="New Urgent Task" collapsed={collapsed} onClick={onNewUrgentTask} />
          <ActionButton label="New Category" collapsed={collapsed} onClick={onNewCategory} />
        </div>

        <div className={`mt-6 flex items-center gap-2 ${collapsed ? railCenter : ''}`}>
          <Shapes size={16} className="shrink-0 text-accent" />
          <h3 className={`font-semibold ${collapsed ? railHidden : ''}`}>Categories</h3>
        </div>

        <ul className="mt-3 space-y-1">
          {categories.map((category) => (
            <li
              key={category.id}
              title={category.name}
              className={`group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-800 ${
                collapsed ? railCenter : ''
              }`}
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: category.color }} />
              <span className={`flex-1 truncate text-sm text-neutral-300 ${collapsed ? railHidden : ''}`}>
                {category.name}
              </span>
              <span className={`text-xs text-neutral-500 ${collapsed ? railHidden : ''}`}>
                {countsByCategory[category.id] ?? 0}
              </span>
              <button
                type="button"
                aria-label={`Delete ${category.name}`}
                onClick={() => onRemoveCategory(category.id)}
                className={`opacity-0 transition group-hover:opacity-100 hover:text-accent ${
                  collapsed ? railHidden : ''
                }`}
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>

        <div className={`mt-8 space-y-4 ${collapsed ? railHidden : ''}`}>
          <ProgressBar label="Year" value={progress.year} />
          <ProgressBar label="Month" value={progress.month} />
          <ProgressBar label="Week" value={progress.week} />
          <ProgressBar label="Day" value={progress.day} />
        </div>
      </div>
    </aside>
  )
}
