import type { Task } from '../types'

export const PIXELS_PER_MINUTE = 1
export const HOUR_HEIGHT = 60 * PIXELS_PER_MINUTE
export const DAY_HEIGHT = 24 * HOUR_HEIGHT
export const MIN_BLOCK_HEIGHT = 22
export const DEFAULT_DURATION_MINUTES = 60
export const SNAP_MINUTES = 15
export const SCROLL_TO_HOUR = 7

export function formatMinutes(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440
  const hours24 = Math.floor(wrapped / 60)
  const mins = wrapped % 60
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  const suffix = hours24 >= 12 ? 'PM' : 'AM'
  return `${hours12}:${String(mins).padStart(2, '0')} ${suffix}`
}

export function formatTimeRange(task: Task): string {
  if (task.startMinutes == null) return 'All day'
  const end = task.startMinutes + (task.durationMinutes ?? DEFAULT_DURATION_MINUTES)
  return `${formatMinutes(task.startMinutes)} – ${formatMinutes(end)}`
}

export function snapMinutes(minutes: number): number {
  const snapped = Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES
  return Math.min(Math.max(snapped, 0), 1440 - SNAP_MINUTES)
}

export interface PositionedTask {
  task: Task
  top: number
  height: number
  left: number
  width: number
}

/**
 * Lays out same-day timed tasks like a calendar app: tasks that overlap in
 * time share the row, splitting its width evenly; non-overlapping tasks each
 * take the full width. Clusters of mutually-overlapping tasks are resolved
 * independently so an isolated event elsewhere in the day isn't squeezed by
 * an unrelated overlap.
 */
export function layoutTimedTasks(tasks: Task[]): PositionedTask[] {
  const timed = tasks
    .filter((t): t is Task & { startMinutes: number } => t.startMinutes != null)
    .sort((a, b) => a.startMinutes - b.startMinutes || (b.durationMinutes ?? 0) - (a.durationMinutes ?? 0))

  const positioned: PositionedTask[] = []
  let cluster: { task: Task; col: number; start: number; end: number }[] = []
  let columnEnds: number[] = []
  let clusterEnd = -Infinity

  const flush = () => {
    if (cluster.length === 0) return
    const maxCol = Math.max(...cluster.map((c) => c.col)) + 1
    for (const c of cluster) {
      positioned.push({
        task: c.task,
        top: c.start * PIXELS_PER_MINUTE,
        height: Math.max((c.end - c.start) * PIXELS_PER_MINUTE, MIN_BLOCK_HEIGHT),
        left: (c.col / maxCol) * 100,
        width: (1 / maxCol) * 100,
      })
    }
  }

  for (const task of timed) {
    const start = task.startMinutes
    const end = start + (task.durationMinutes ?? DEFAULT_DURATION_MINUTES)

    if (start >= clusterEnd) {
      flush()
      cluster = []
      columnEnds = []
      clusterEnd = -Infinity
    }

    let col = columnEnds.findIndex((colEnd) => colEnd <= start)
    if (col === -1) {
      col = columnEnds.length
      columnEnds.push(end)
    } else {
      columnEnds[col] = end
    }

    cluster.push({ task, col, start, end })
    clusterEnd = Math.max(clusterEnd, end)
  }
  flush()

  return positioned
}
