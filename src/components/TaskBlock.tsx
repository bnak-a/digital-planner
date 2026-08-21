import { Sun, Zap } from 'lucide-react'
import type { Category } from '../types'
import type { PositionedTask } from '../lib/schedule'
import { formatTimeRange } from '../lib/schedule'

interface Props {
  positioned: PositionedTask
  category?: Category
  onToggle: () => void
}

export function TaskBlock({ positioned, category, onToggle }: Props) {
  const { task, top, height, left, width } = positioned
  const compact = height < 36
  const color = category?.color ?? '#666'

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      title={`${task.title} · ${formatTimeRange(task)}`}
      className={`absolute overflow-hidden rounded-md border px-1.5 py-1 text-left text-[11px] leading-tight transition hover:brightness-125 ${
        task.done ? 'border-neutral-700 text-neutral-500 line-through' : 'text-neutral-100'
      }`}
      style={{
        top,
        height,
        left: `calc(${left}% + 2px)`,
        width: `calc(${width}% - 4px)`,
        background: task.done ? '#262626' : `${color}2e`,
        borderColor: task.done ? undefined : color,
      }}
    >
      <span className="flex items-center gap-1 font-medium">
        {task.priority === 'urgent' && !task.done && <Zap size={10} className="shrink-0 text-accent" />}
        {task.daily && <Sun size={10} className="shrink-0 text-amber-400/80" />}
        <span className="truncate">{task.title}</span>
      </span>
      {!compact && <span className="block truncate text-[10px] text-neutral-400">{formatTimeRange(task)}</span>}
    </button>
  )
}
