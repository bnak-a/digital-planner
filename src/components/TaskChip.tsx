import { Sun, Zap } from 'lucide-react'
import type { Category, Task } from '../types'

interface Props {
  task: Task
  category?: Category
  onToggle: () => void
}

export function TaskChip({ task, category, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      title={task.title}
      className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] leading-tight transition hover:bg-neutral-700/60 ${
        task.done ? 'text-neutral-500 line-through' : 'text-neutral-200'
      }`}
      style={{ background: task.done ? 'transparent' : `${category?.color ?? '#666'}1f` }}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ background: category?.color ?? '#666' }} />
      <span className="truncate">{task.title}</span>
      {task.priority === 'urgent' && !task.done && <Zap size={10} className="shrink-0 text-accent" />}
      {task.daily && <Sun size={10} className="shrink-0 text-amber-400/80" />}
    </button>
  )
}
