import { useMemo, useState } from 'react'
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Search,
  Sun,
} from 'lucide-react'
import type { Category, Task } from '../types'
import {
  MONTHS,
  WEEKDAYS,
  addDays,
  formatCellLabel,
  formatDayHeading,
  formatWeekRange,
  isSameDay,
  monthGrid,
  toKey,
  weekDates,
} from '../lib/date'
import { TaskChip } from './TaskChip'
import { WeekView } from './WeekView'
import { DayView } from './DayView'

export type TabId = 'all' | 'daily' | 'completed'
export type SortId = 'default' | 'priority' | 'alpha'
export type ViewId = 'month' | 'week' | 'day'

interface Props {
  tasks: Task[]
  categories: Category[]
  cursor: Date
  onCursorChange: (date: Date) => void
  onToggleTask: (id: string) => void
  onSelectDay: (key: string) => void
  onCreateTaskAt: (date: string, startMinutes: number) => void
}

const TABS: { id: TabId; label: string; icon: typeof CalendarDays }[] = [
  { id: 'all', label: 'All', icon: CalendarDays },
  { id: 'daily', label: 'Daily Tasks', icon: Sun },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
]

const VIEWS: { id: ViewId; label: string; icon: typeof CalendarDays }[] = [
  { id: 'month', label: 'Month', icon: CalendarDays },
  { id: 'week', label: 'Week', icon: CalendarRange },
  { id: 'day', label: 'Day', icon: Calendar },
]

const VIEW_TITLE: Record<ViewId, string> = { month: 'Monthly', week: 'Weekly', day: 'Daily' }

const SORT_LABEL: Record<SortId, string> = {
  default: 'Date added',
  priority: 'Priority',
  alpha: 'A → Z',
}

export function CalendarPanel({
  tasks,
  categories,
  cursor,
  onCursorChange,
  onToggleTask,
  onSelectDay,
  onCreateTaskAt,
}: Props) {
  const [view, setView] = useState<ViewId>('month')
  const [tab, setTab] = useState<TabId>('all')
  const [sort, setSort] = useState<SortId>('default')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeCategories, setActiveCategories] = useState<string[]>([])

  const today = new Date()
  const cells = useMemo(() => monthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])

  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])) as Record<string, Category>,
    [categories],
  )

  const visibleTasks = useMemo(() => {
    let visible = tasks
    if (tab === 'daily') visible = visible.filter((t) => t.daily)
    if (tab === 'completed') visible = visible.filter((t) => t.done)
    if (activeCategories.length > 0) visible = visible.filter((t) => activeCategories.includes(t.categoryId))
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      visible = visible.filter((t) => t.title.toLowerCase().includes(q))
    }

    const sorted = [...visible]
    if (sort === 'priority') {
      sorted.sort((a, b) => Number(b.priority === 'urgent') - Number(a.priority === 'urgent'))
    } else if (sort === 'alpha') {
      sorted.sort((a, b) => a.title.localeCompare(b.title))
    }
    return sorted
  }, [tasks, tab, activeCategories, query, sort])

  const byDay = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const task of visibleTasks) (map[task.date] ??= []).push(task)
    return map
  }, [visibleTasks])

  const shift = (amount: number) => {
    if (view === 'month') {
      const next = new Date(cursor)
      next.setDate(1)
      next.setMonth(next.getMonth() + amount)
      onCursorChange(next)
    } else if (view === 'week') {
      onCursorChange(addDays(cursor, amount * 7))
    } else {
      onCursorChange(addDays(cursor, amount))
    }
  }

  const toggleCategory = (id: string) =>
    setActiveCategories((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]))

  const rangeLabel = useMemo(() => {
    if (view === 'month') return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
    if (view === 'week') {
      const [start, end] = [weekDates(cursor)[0], weekDates(cursor)[6]]
      return formatWeekRange(start, end)
    }
    return formatDayHeading(cursor)
  }, [view, cursor])

  return (
    <section className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{VIEW_TITLE[view]}</h2>
        <div className="flex items-center gap-1 rounded-full bg-neutral-900 p-1">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
                view === id ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-neutral-900 p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
                tab === id ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          {searchOpen && (
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => !query && setSearchOpen(false)}
              placeholder="Search tasks…"
              className="w-44 rounded-md border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-sm outline-none placeholder:text-neutral-600 focus:border-accent"
            />
          )}
          <div className="relative">
            <button
              type="button"
              aria-label="Filter by category"
              onClick={() => setFilterOpen((o) => !o)}
              className={`rounded-md p-2 transition hover:bg-neutral-800 ${
                activeCategories.length ? 'text-accent' : 'text-neutral-400'
              }`}
            >
              <ListFilter size={16} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-neutral-800 bg-neutral-900 p-1.5 shadow-xl">
                {categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-neutral-800"
                  >
                    <input
                      type="checkbox"
                      checked={activeCategories.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                      className="accent-[var(--color-accent)]"
                    />
                    <span className="size-2 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </label>
                ))}
                {activeCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveCategories([])}
                    className="mt-1 w-full rounded px-2 py-1 text-left text-xs text-neutral-400 hover:bg-neutral-800"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            title={`Sort: ${SORT_LABEL[sort]}`}
            onClick={() => setSort((s) => (s === 'default' ? 'priority' : s === 'priority' ? 'alpha' : 'default'))}
            className={`rounded-md p-2 transition hover:bg-neutral-800 ${
              sort === 'default' ? 'text-neutral-400' : 'text-accent'
            }`}
          >
            <span className="sr-only">Sort tasks</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7h11M3 12h7M3 17h4M17 4v16M17 20l3-3M17 20l-3-3" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Search tasks"
            onClick={() => setSearchOpen((o) => !o)}
            className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-800"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-300">{rangeLabel}</h3>
        <div className="flex items-center gap-1 text-sm">
          <button
            type="button"
            aria-label={`Previous ${view}`}
            onClick={() => shift(-1)}
            className="rounded p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onCursorChange(new Date())}
            className="rounded px-2 py-1 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            Today
          </button>
          <button
            type="button"
            aria-label={`Next ${view}`}
            onClick={() => shift(1)}
            className="rounded p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {view === 'month' && (
        <>
          <div className="mt-2 grid grid-cols-7 border-b border-neutral-800 pb-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs text-neutral-500">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-l border-t border-neutral-800">
            {cells.map((date) => {
              const key = toKey(date)
              const outside = date.getMonth() !== cursor.getMonth()
              const isToday = isSameDay(date, today)
              const dayTasks = byDay[key] ?? []
              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectDay(key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectDay(key)
                    }
                  }}
                  className={`flex min-h-28 cursor-pointer flex-col items-stretch gap-1 border-r border-b border-neutral-800 p-1.5 text-left transition hover:bg-neutral-900 ${
                    outside ? 'bg-neutral-950/60' : ''
                  }`}
                >
                  <span
                    className={`self-end text-xs ${
                      isToday
                        ? 'flex size-5 items-center justify-center rounded-full bg-accent font-semibold text-white'
                        : outside
                          ? 'text-neutral-600'
                          : 'text-neutral-400'
                    }`}
                  >
                    {formatCellLabel(date, cursor.getMonth())}
                  </span>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {dayTasks.slice(0, 3).map((task) => (
                      <TaskChip
                        key={task.id}
                        task={task}
                        category={categoryById[task.categoryId]}
                        onToggle={() => onToggleTask(task.id)}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="px-1.5 text-[11px] text-neutral-500">+{dayTasks.length - 3} more</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {view === 'week' && (
        <div className="mt-2">
          <WeekView
            weekStart={cursor}
            tasks={visibleTasks}
            categories={categories}
            onToggleTask={onToggleTask}
            onSlotClick={onCreateTaskAt}
          />
        </div>
      )}

      {view === 'day' && (
        <div className="mt-2">
          <DayView
            date={cursor}
            tasks={visibleTasks}
            categories={categories}
            onToggleTask={onToggleTask}
            onSlotClick={onCreateTaskAt}
          />
        </div>
      )}
    </section>
  )
}
