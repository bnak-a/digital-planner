import { useMemo, useState } from 'react'
import { CalendarRange, Menu } from 'lucide-react'
import { CalendarPanel } from './components/CalendarPanel'
import { CategoryForm } from './components/CategoryForm'
import { DayPanel } from './components/DayPanel'
import { FlipClock } from './components/FlipClock'
import { Modal } from './components/Modal'
import { Sidebar } from './components/Sidebar'
import { TaskForm } from './components/TaskForm'
import { toKey } from './lib/date'
import { computeProgress } from './lib/progress'
import { usePlanner } from './lib/store'
import type { Priority } from './types'

type Dialog = { kind: 'task'; date: string; priority: Priority } | { kind: 'category' } | null

export default function App() {
  const { tasks, categories, addTask, removeTask, toggleTask, addCategory, removeCategory } = usePlanner()
  const [cursor, setCursor] = useState(() => new Date())
  const [dialog, setDialog] = useState<Dialog>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
      <header className="mb-10 flex items-start justify-between gap-6">
        <div>
          <CalendarRange size={44} className="text-accent" strokeWidth={2.2} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight">The Easy Monthly Planner</h1>
        </div>
        <div className="hidden flex-1 justify-center pt-4 md:flex">
          <FlipClock />
        </div>
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => setSidebarOpen((o) => !o)}
          className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
        >
          <Menu size={20} />
        </button>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row">
        {sidebarOpen && (
          <Sidebar
            categories={categories}
            progress={progress}
            countsByCategory={countsByCategory}
            onNewTask={() => setDialog({ kind: 'task', date: toKey(new Date()), priority: 'normal' })}
            onNewUrgentTask={() => setDialog({ kind: 'task', date: toKey(new Date()), priority: 'urgent' })}
            onNewCategory={() => setDialog({ kind: 'category' })}
            onRemoveCategory={removeCategory}
          />
        )}

        <CalendarPanel
          tasks={tasks}
          categories={categories}
          cursor={cursor}
          onCursorChange={setCursor}
          onToggleTask={toggleTask}
          onSelectDay={setSelectedDay}
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
