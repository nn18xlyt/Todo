import { DEFAULT_FILTERS, STORAGE_KEY, type PersistedStateV1 } from '../domain/types'

export function loadPersistedState(): PersistedStateV1 | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<PersistedStateV1>
    if (parsed.version !== 1) return null

    return {
      version: 1,
      todos: Array.isArray(parsed.todos) ? (parsed.todos as PersistedStateV1['todos']) : [],
      categories: Array.isArray(parsed.categories)
        ? (parsed.categories as PersistedStateV1['categories'])
        : [],
      filters: parsed.filters ? (parsed.filters as PersistedStateV1['filters']) : DEFAULT_FILTERS,
    }
  } catch {
    return null
  }
}

export function savePersistedState(state: PersistedStateV1) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
