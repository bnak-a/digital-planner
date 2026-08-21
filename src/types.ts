export type Priority = 'normal' | 'urgent'

export interface Task {
  id: string
  title: string
  date: string
  categoryId: string
  priority: Priority
  daily: boolean
  done: boolean
}

export interface Category {
  id: string
  name: string
  color: string
}
