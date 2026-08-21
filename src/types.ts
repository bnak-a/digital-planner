export type Priority = 'normal' | 'urgent'

export interface Task {
  id: string
  title: string
  date: string
  categoryId: string
  priority: Priority
  daily: boolean
  done: boolean
  /** Minutes since midnight the task starts at. Omitted means an all-day task. */
  startMinutes?: number
  durationMinutes?: number
}

export interface Category {
  id: string
  name: string
  color: string
}
