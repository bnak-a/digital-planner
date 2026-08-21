import type { Task } from '../types'
import { fromKey, startOfWeek, toKey } from './date'

function ratio(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
}

export interface ProgressSet {
  year: number
  month: number
  week: number
  day: number
}

export function computeProgress(tasks: Task[], today = new Date()): ProgressSet {
  const weekStart = startOfWeek(today)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const inYear: Task[] = []
  const inMonth: Task[] = []
  const inWeek: Task[] = []
  const inDay: Task[] = []
  const todayKey = toKey(today)

  for (const task of tasks) {
    const d = fromKey(task.date)
    if (d.getFullYear() !== today.getFullYear()) continue
    inYear.push(task)
    if (d.getMonth() === today.getMonth()) inMonth.push(task)
    if (d >= weekStart && d <= weekEnd) inWeek.push(task)
    if (task.date === todayKey) inDay.push(task)
  }

  return {
    year: ratio(inYear),
    month: ratio(inMonth),
    week: ratio(inWeek),
    day: ratio(inDay),
  }
}
