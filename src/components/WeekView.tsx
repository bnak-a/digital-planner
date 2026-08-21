import { useMemo } from 'react'
import type { Category, Task } from '../types'
import { WEEKDAYS, isSameDay, toKey, weekDates } from '../lib/date'
import { TimeGrid } from './TimeGrid'

interface Props {
  weekStart: Date
  tasks: Task[]
  categories: Category[]
  onToggleTask: (id: string) => void
  onSlotClick: (date: string, startMinutes: number) => void
}

export function WeekView({ weekStart, tasks, categories, onToggleTask, onSlotClick }: Props) {
  const days = useMemo(() => weekDates(weekStart), [weekStart])
  const today = new Date()

  const tasksByColumn = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const d of days) map[toKey(d)] = []
    for (const task of tasks) if (map[task.date]) map[task.date].push(task)
    return map
  }, [days, tasks])

  const columns = days.map((d) => {
    const key = toKey(d)
    const todayCol = isSameDay(d, today)
    return {
      key,
      isToday: todayCol,
      header: (
        <div>
          <div className="text-xs text-neutral-500">{WEEKDAYS[d.getDay()]}</div>
          <div
            className={`mx-auto mt-1 flex size-7 items-center justify-center rounded-full text-sm ${
              todayCol ? 'bg-accent font-semibold text-white' : 'text-neutral-200'
            }`}
          >
            {d.getDate()}
          </div>
        </div>
      ),
    }
  })

  return (
    <TimeGrid
      columns={columns}
      tasksByColumn={tasksByColumn}
      categories={categories}
      onToggleTask={onToggleTask}
      onSlotClick={onSlotClick}
    />
  )
}
