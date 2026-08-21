import { useEffect, useRef, type ReactNode } from 'react'
import type { Category, Task } from '../types'
import { DAY_HEIGHT, HOUR_HEIGHT, SCROLL_TO_HOUR, layoutTimedTasks, snapMinutes } from '../lib/schedule'
import { TaskBlock } from './TaskBlock'
import { TaskChip } from './TaskChip'

export interface GridColumn {
  key: string
  header: ReactNode
  isToday: boolean
}

interface Props {
  columns: GridColumn[]
  tasksByColumn: Record<string, Task[]>
  categories: Category[]
  onToggleTask: (id: string) => void
  onSlotClick: (columnKey: string, startMinutes: number) => void
}

function formatHour(hour: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12} ${hour >= 12 ? 'PM' : 'AM'}`
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function TimeGrid({ columns, tasksByColumn, categories, onToggleTask, onSlotClick }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: SCROLL_TO_HOUR * HOUR_HEIGHT - 24 })
  }, [])

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<string, Category>
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-800">
      <div className="flex border-b border-neutral-800 bg-neutral-950/40">
        <div className="w-14 shrink-0" />
        {columns.map((c) => (
          <div key={c.key} className="flex-1 border-l border-neutral-800 py-2 text-center">
            {c.header}
          </div>
        ))}
      </div>

      <div className="flex min-h-9 border-b border-neutral-800">
        <div className="flex w-14 shrink-0 items-center justify-end pr-2 text-[10px] text-neutral-600">All day</div>
        {columns.map((c) => (
          <div key={c.key} className="flex-1 space-y-1 border-l border-neutral-800 p-1">
            {(tasksByColumn[c.key] ?? [])
              .filter((t) => t.startMinutes == null)
              .map((task) => (
                <TaskChip
                  key={task.id}
                  task={task}
                  category={categoryById[task.categoryId]}
                  onToggle={() => onToggleTask(task.id)}
                />
              ))}
          </div>
        ))}
      </div>

      <div ref={scrollRef} className="max-h-[600px] overflow-y-auto">
        <div className="flex" style={{ height: DAY_HEIGHT }}>
          <div className="relative w-14 shrink-0">
            {HOURS.map((hour) => (
              <div key={hour} className="absolute right-2 -translate-y-1/2 text-[10px] text-neutral-600" style={{ top: hour * HOUR_HEIGHT }}>
                {hour === 0 ? '' : formatHour(hour)}
              </div>
            ))}
          </div>

          {columns.map((c) => (
            <div
              key={c.key}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                onSlotClick(c.key, snapMinutes(e.clientY - rect.top))
              }}
              className="relative flex-1 cursor-pointer border-l border-neutral-800"
            >
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute inset-x-0 border-t border-neutral-800/60"
                  style={{ top: hour * HOUR_HEIGHT }}
                />
              ))}
              {c.isToday && (
                <div className="absolute inset-x-0 z-10 border-t-2 border-accent" style={{ top: nowMinutes }}>
                  <span className="absolute -left-1 -top-1 size-2 rounded-full bg-accent" />
                </div>
              )}
              {layoutTimedTasks(tasksByColumn[c.key] ?? []).map((positioned) => (
                <TaskBlock
                  key={positioned.task.id}
                  positioned={positioned}
                  category={categoryById[positioned.task.categoryId]}
                  onToggle={() => onToggleTask(positioned.task.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
