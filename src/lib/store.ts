import { useCallback, useEffect, useState } from 'react'
import type { Category, Task } from '../types'
import { seedCategories, seedTasks } from './seed'

const KEY = 'easy-monthly-planner:v1'

interface Persisted {
  tasks: Task[]
  categories: Category[]
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Persisted
  } catch {
    // Corrupt or unavailable storage falls back to seed data.
  }
  return { tasks: seedTasks, categories: seedCategories }
}

export function usePlanner() {
  const [state, setState] = useState<Persisted>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // Storage may be unavailable (private mode); the app still works in memory.
    }
  }, [state])

  const addTask = useCallback((task: Omit<Task, 'id' | 'done'>) => {
    setState((s) => ({
      ...s,
      tasks: [...s.tasks, { ...task, id: crypto.randomUUID(), done: false }],
    }))
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }, [])

  const removeTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }))
  }, [])

  const addCategory = useCallback((name: string, color: string) => {
    setState((s) => ({
      ...s,
      categories: [...s.categories, { id: crypto.randomUUID(), name, color }],
    }))
  }, [])

  const removeCategory = useCallback((id: string) => {
    setState((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      tasks: s.tasks.filter((t) => t.categoryId !== id),
    }))
  }, [])

  return {
    tasks: state.tasks,
    categories: state.categories,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    addCategory,
    removeCategory,
  }
}
