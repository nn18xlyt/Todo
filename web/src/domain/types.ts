export type Priority = 'P0' | 'P1' | 'P2'

export type Todo = {
  id: string
  title: string
  description: string
  dueDate: string | null
  priority: Priority
  categoryId: string | null
  completed: boolean
  createdAt: number
  updatedAt: number
}

export type Category = {
  id: string
  name: string
  createdAt: number
}

export type StatusFilter = 'all' | 'active' | 'completed'
export type PriorityFilter = 'all' | Priority

export type FilterState = {
  status: StatusFilter
  priority: PriorityFilter
  categoryId: 'all' | string
  query: string
  sort: 'default'
}

export type PersistedStateV1 = {
  version: 1
  todos: Todo[]
  categories: Category[]
  filters: FilterState
}

export const STORAGE_KEY = 'todo_app_state_v1'
export const UNCATEGORIZED_ID = '__uncategorized__'

export const DEFAULT_FILTERS: FilterState = {
  status: 'all',
  priority: 'all',
  categoryId: 'all',
  query: '',
  sort: 'default',
}
