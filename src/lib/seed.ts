import type { Category, Task } from '../types'
import { toKey } from './date'

export const seedCategories: Category[] = [
  { id: 'work', name: 'Work', color: '#e0524a' },
  { id: 'personal', name: 'Personal', color: '#5b8def' },
  { id: 'health', name: 'Health', color: '#3fbf7f' },
  { id: 'learning', name: 'Learning', color: '#c88bf0' },
]

function offset(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toKey(d)
}

let n = 0
const id = () => `seed-${n++}`

export const seedTasks: Task[] = [
  { id: id(), title: 'Morning workout', date: offset(0), categoryId: 'health', priority: 'normal', daily: true, done: true },
  { id: id(), title: 'Review quarterly roadmap', date: offset(0), categoryId: 'work', priority: 'urgent', daily: false, done: false },
  { id: id(), title: 'Read 20 pages', date: offset(0), categoryId: 'learning', priority: 'normal', daily: true, done: false },
  { id: id(), title: 'Call the dentist', date: offset(1), categoryId: 'personal', priority: 'urgent', daily: false, done: false },
  { id: id(), title: 'Design review sync', date: offset(1), categoryId: 'work', priority: 'normal', daily: false, done: false },
  { id: id(), title: 'Grocery run', date: offset(2), categoryId: 'personal', priority: 'normal', daily: false, done: false },
  { id: id(), title: 'Ship planner UI', date: offset(3), categoryId: 'work', priority: 'urgent', daily: false, done: false },
  { id: id(), title: 'Meal prep for the week', date: offset(-1), categoryId: 'health', priority: 'normal', daily: false, done: true },
  { id: id(), title: 'Finish TypeScript course', date: offset(-2), categoryId: 'learning', priority: 'normal', daily: false, done: true },
  { id: id(), title: 'Inbox zero', date: offset(-2), categoryId: 'work', priority: 'normal', daily: true, done: true },
  { id: id(), title: 'Plan weekend trip', date: offset(5), categoryId: 'personal', priority: 'normal', daily: false, done: false },
  { id: id(), title: 'Annual checkup', date: offset(9), categoryId: 'health', priority: 'urgent', daily: false, done: false },
]
