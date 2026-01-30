import { parseISO } from 'date-fns'
import { isOverdue } from '../lib/dates'
import { UNCATEGORIZED_ID, type Category, type FilterState, type Todo } from './types'

function norm(s: string) {
  return s.trim().toLowerCase()
}

function matchQuery(todo: Todo, q: string) {
  if (!q) return true
  const hay = `${todo.title} ${todo.description}`.toLowerCase()
  return hay.includes(q)
}

function hasDue(todo: Todo) {
  return Boolean(todo.dueDate)
}

function dueTime(todo: Todo) {
  if (!todo.dueDate) return Number.POSITIVE_INFINITY
  return parseISO(todo.dueDate).getTime()
}

export function selectVisibleTodos(state: { todos: Todo[]; filters: FilterState }) {
  const q = norm(state.filters.query || '')

  const filtered = state.todos
    .filter((t) => {
      if (state.filters.status === 'active') return !t.completed
      if (state.filters.status === 'completed') return t.completed
      return true
    })
    .filter((t) => {
      if (state.filters.priority === 'all') return true
      return t.priority === state.filters.priority
    })
    .filter((t) => {
      if (state.filters.categoryId === 'all') return true
      if (state.filters.categoryId === UNCATEGORIZED_ID) return t.categoryId === null
      return t.categoryId === state.filters.categoryId
    })
    .filter((t) => matchQuery(t, q))

  return filtered.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1

    const aHas = hasDue(a)
    const bHas = hasDue(b)
    if (aHas !== bHas) return aHas ? -1 : 1

    const aDue = dueTime(a)
    const bDue = dueTime(b)
    if (aDue !== bDue) return aDue < bDue ? -1 : 1

    return b.createdAt - a.createdAt
  })
}

export function selectStats(state: { todos: Todo[] }) {
  const total = state.todos.length
  const completed = state.todos.filter((t) => t.completed).length
  const active = total - completed
  const overdue = state.todos.filter((t) => !t.completed && t.dueDate && isOverdue(t.dueDate)).length
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)

  return {
    total,
    active,
    completed,
    overdue,
    completionRate,
  }
}

export function selectCategoryNameById(
  categories: Category[],
  categoryId: string | null,
  fallback = '未分类',
) {
  if (!categoryId) return fallback
  const found = categories.find((c) => c.id === categoryId)
  return found ? found.name : fallback
}
