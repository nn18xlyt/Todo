import { create } from 'zustand'
import { shallow } from 'zustand/shallow'
import { subscribeWithSelector } from 'zustand/middleware'
import {
  DEFAULT_FILTERS,
  UNCATEGORIZED_ID,
  type Category,
  type FilterState,
  type PersistedStateV1,
  type Priority,
  type Todo,
} from '../domain/types'
import { selectVisibleTodos, selectStats } from '../domain/selectors'
import { makeId } from '../lib/id'
import { loadPersistedState, savePersistedState } from '../lib/storage'

type UiState = {
  editingTodoId: string | null
  categoryManagerOpen: boolean
  toast: string | null
}

type AddTodoInput = {
  title: string
  description?: string
  dueDate?: string | null
  priority?: Priority
  categoryId?: string | null
}

const MAX_CATEGORIES = 20

export type TodoStore = {
  todos: Todo[]
  categories: Category[]
  filters: FilterState
  ui: UiState

  hydrate: () => void

  addTodo: (input: AddTodoInput | string) => void
  updateTodo: (id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void

  addCategory: (name: string) => void
  renameCategory: (id: string, name: string) => void
  deleteCategory: (id: string) => void

  setFilters: (patch: Partial<FilterState>) => void

  openEditor: (id: string) => void
  closeEditor: () => void
  openCategoryManager: () => void
  closeCategoryManager: () => void

  showToast: (message: string) => void

  selectVisibleTodos: () => Todo[]
  selectStats: () => ReturnType<typeof selectStats>
}

let toastTimer: number | undefined

export const useTodoStore = create<TodoStore>()(
  subscribeWithSelector((set, get) => ({
  todos: [],
  categories: [],
  filters: DEFAULT_FILTERS,
  ui: {
    editingTodoId: null,
    categoryManagerOpen: false,
    toast: null,
  },

  hydrate: () => {
    const persisted = loadPersistedState()
    if (!persisted) return

    set({
      todos: persisted.todos,
      categories: persisted.categories,
      filters: persisted.filters,
    })
  },

  addTodo: (input) => {
    const normalized: AddTodoInput = typeof input === 'string' ? { title: input } : input
    const title = normalized.title.trim()
    if (!title) {
      get().showToast('标题别空。')
      return
    }

    const now = Date.now()
    const todo: Todo = {
      id: makeId(),
      title,
      description: (normalized.description ?? '').trim(),
      dueDate: normalized.dueDate ?? null,
      priority: normalized.priority ?? 'P1',
      categoryId: normalized.categoryId ?? null,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }

    set((s) => ({
      todos: [todo, ...s.todos],
    }))
  },

  updateTodo: (id, patch) => {
    const now = Date.now()
    set((s) => ({
      todos: s.todos.map((t) => {
        if (t.id !== id) return t
        const nextTitle = patch.title === undefined ? t.title : patch.title.trim()
        const nextDescription =
          patch.description === undefined ? t.description : (patch.description ?? '').trim()

        return {
          ...t,
          ...patch,
          title: nextTitle,
          description: nextDescription,
          updatedAt: now,
        }
      }),
    }))
  },

  toggleTodo: (id) => {
    const now = Date.now()
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: now } : t)),
    }))
  },

  deleteTodo: (id) => {
    set((s) => ({
      todos: s.todos.filter((t) => t.id !== id),
    }))
  },

  addCategory: (name) => {
    const n = name.trim()
    if (!n) {
      get().showToast('名字别空。')
      return
    }

    if (get().categories.length >= MAX_CATEGORIES) {
      get().showToast('分类满了。')
      return
    }

    const cat: Category = {
      id: makeId(),
      name: n.slice(0, 12),
      createdAt: Date.now(),
    }

    set((s) => ({
      categories: [...s.categories, cat],
    }))
  },

  renameCategory: (id, name) => {
    const n = name.trim()
    if (!n) {
      get().showToast('名字别空。')
      return
    }

    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, name: n.slice(0, 12) } : c)),
    }))
  },

  deleteCategory: (id) => {
    set((s) => {
      const nextTodos = s.todos.map((t) => (t.categoryId === id ? { ...t, categoryId: null } : t))
      const nextCategories = s.categories.filter((c) => c.id !== id)
      const nextFilters =
        s.filters.categoryId === id
          ? { ...s.filters, categoryId: 'all' }
          : s.filters

      return {
        todos: nextTodos,
        categories: nextCategories,
        filters: nextFilters,
      }
    })
  },

  setFilters: (patch) => {
    set((s) => ({
      filters: {
        ...s.filters,
        ...patch,
      },
    }))
  },

  openEditor: (id) => {
    set((s) => ({ ui: { ...s.ui, editingTodoId: id } }))
  },

  closeEditor: () => {
    set((s) => ({ ui: { ...s.ui, editingTodoId: null } }))
  },

  openCategoryManager: () => {
    set((s) => ({ ui: { ...s.ui, categoryManagerOpen: true } }))
  },

  closeCategoryManager: () => {
    set((s) => ({ ui: { ...s.ui, categoryManagerOpen: false } }))
  },

  showToast: (message) => {
    if (toastTimer) window.clearTimeout(toastTimer)

    set((s) => ({ ui: { ...s.ui, toast: message } }))
    toastTimer = window.setTimeout(() => {
      set((s) => ({ ui: { ...s.ui, toast: null } }))
    }, 1800)
  },

  selectVisibleTodos: () => {
    return selectVisibleTodos({
      todos: get().todos,
      filters: get().filters,
    })
  },

  selectStats: () => {
    return selectStats({ todos: get().todos })
  },
  })),
)

let persistTimer: number | undefined

type PersistSlice = Omit<PersistedStateV1, 'version'>

useTodoStore.subscribe(
  (s) => ({ todos: s.todos, categories: s.categories, filters: s.filters }),
  (slice: PersistSlice) => {
    if (persistTimer) window.clearTimeout(persistTimer)

    persistTimer = window.setTimeout(() => {
      const ok = savePersistedState({ version: 1, ...slice } satisfies PersistedStateV1)
      if (!ok) {
        useTodoStore.getState().showToast('存不进去。')
      }
    }, 420)
  },
  {
    equalityFn: shallow,
  },
)

export function isUncategorizedFilterValue(value: string) {
  return value === UNCATEGORIZED_ID
}
