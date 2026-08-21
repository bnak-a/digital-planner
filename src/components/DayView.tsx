import { useMemo } from 'react'
import type { Category, Task } from '../types'
import { isSameDay, toKey } from '../lib/date'
import { TimeGrid } from './TimeGrid'

interface Props {
  date: Date
  tasks: Task[]
  categories: Category[]
  onToggleTask: (id: string) => void
  onSlotClick: (date: string, startMinutes: number) => void
}

export function DayView({ date, tasks, categories, onToggleTask, onSlotClick }: Props) {
  const key = toKey(date)
  const isToday = isSameDay(date, new Date())

  const tasksByColumn = useMemo(() => ({ [key]: tasks.filter((t) => t.date === key) }), [tasks, key])

  const columns = [
    {
      key,
      isToday,
      header: (
        <div
          className={`mx-auto flex size-7 items-center justify-center rounded-full text-sm ${
            isToday ? 'bg-accent font-semibold text-white' : 'text-neutral-200'
          }`}
        >
          {date.getDate()}
        </div>
      ),
    },
  ]

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
