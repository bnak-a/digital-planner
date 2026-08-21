import { useMemo, useState } from 'react'
import { CalendarRange, Menu } from 'lucide-react'
import { CalendarPanel } from './components/CalendarPanel'
import { CategoryForm } from './components/CategoryForm'
import { DayPanel } from './components/DayPanel'
import { FlipClock } from './components/FlipClock'
import { Modal } from './components/Modal'
import { Sidebar, calendarColumnOffset } from './components/Sidebar'
import { TaskForm } from './components/TaskForm'
import { toKey } from './lib/date'
import { computeProgress } from './lib/progress'
import { usePlanner } from './lib/store'
import type { Priority } from './types'

type Dialog =
  | { kind: 'task'; date: string; priority: Priority; startMinutes?: number }
  | { kind: 'category' }
  | null

export default function App() {
  const { tasks, categories, addTask, removeTask, toggleTask, addCategory, removeCategory } = usePlanner()
  const [cursor, setCursor] = useState(() => new Date())
  const [dialog, setDialog] = useState<Dialog>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const progress = useMemo(() => computeProgress(tasks), [tasks])

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const t of tasks) counts[t.categoryId] = (counts[t.categoryId] ?? 0) + 1
    return counts
  }, [tasks])

  const dayTasks = useMemo(
    () => (selectedDay ? tasks.filter((t) => t.date === selectedDay) : []),
    [tasks, selectedDay],
  )

  return (
    <div className="min-h-full px-6 py-8 lg:px-12">
      <header className="relative mb-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="-ml-2 rounded-md p-2 text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
            >
              <Menu size={28} />
            </button>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">The Easy Monthly Planner</h1>
          </div>
          <CalendarRange size={44} className="shrink-0 text-accent" strokeWidth={2.2} />
        </div>

        {/*
          Below `xl` this sits in normal flow under the title; from `xl` up it
          becomes an overlay spanning the calendar column so the clock centers
          on the grid and slides when the sidebar collapses. `left` is ignored
          while the element is statically positioned. The overlay waits for
          `xl` because narrower viewports leave too little room beside the
          title for the clock to clear it.
        */}
        <div
          className="mt-6 flex justify-center transition-[left] duration-200 xl:absolute xl:inset-y-0 xl:right-0 xl:mt-0 xl:items-center"
          style={{ left: calendarColumnOffset(sidebarCollapsed) }}
        >
          <FlipClock />
        </div>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row">
        <Sidebar
          categories={categories}
          progress={progress}
          countsByCategory={countsByCategory}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
          onNewTask={() => setDialog({ kind: 'task', date: toKey(new Date()), priority: 'normal' })}
          onNewUrgentTask={() => setDialog({ kind: 'task', date: toKey(new Date()), priority: 'urgent' })}
          onNewCategory={() => setDialog({ kind: 'category' })}
          onRemoveCategory={removeCategory}
        />

        <CalendarPanel
          tasks={tasks}
          categories={categories}
          cursor={cursor}
          onCursorChange={setCursor}
          onToggleTask={toggleTask}
          onSelectDay={setSelectedDay}
          onCreateTaskAt={(date, startMinutes) => setDialog({ kind: 'task', date, priority: 'normal', startMinutes })}
        />
      </div>

      {selectedDay && (
        <DayPanel
          dateKey={selectedDay}
          tasks={dayTasks}
          categories={categories}
          onClose={() => setSelectedDay(null)}
          onToggle={toggleTask}
          onRemove={removeTask}
          onAdd={() => {
            setDialog({ kind: 'task', date: selectedDay, priority: 'normal' })
            setSelectedDay(null)
          }}
        />
      )}

      {dialog?.kind === 'task' && (
        <Modal title={dialog.priority === 'urgent' ? 'New Urgent Task' : 'New Task'} onClose={() => setDialog(null)}>
          <TaskForm
            categories={categories}
            defaultDate={dialog.date}
            defaultPriority={dialog.priority}
            defaultStartMinutes={dialog.startMinutes}
            onSubmit={(task) => {
              addTask(task)
              setDialog(null)
            }}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}

      {dialog?.kind === 'category' && (
        <Modal title="New Category" onClose={() => setDialog(null)}>
          <CategoryForm
            onSubmit={(name, color) => {
              addCategory(name, color)
              setDialog(null)
            }}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}
    </div>
  )
}
