import { describe, expect, it, vi } from 'vitest'
import { loadPersistedState, savePersistedState } from '../src/lib/storage'
import { DEFAULT_FILTERS, STORAGE_KEY, type PersistedStateV1 } from '../src/domain/types'

describe('storage', () => {
  it('returns null when empty', () => {
    localStorage.clear()
    expect(loadPersistedState()).toBeNull()
  })

  it('returns null on invalid json', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')
    expect(loadPersistedState()).toBeNull()
  })

  it('returns null on version mismatch', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 2, todos: [], categories: [], filters: DEFAULT_FILTERS }),
    )
    expect(loadPersistedState()).toBeNull()
  })

  it('saves and loads v1', () => {
    localStorage.clear()

    const state: PersistedStateV1 = {
      version: 1,
      todos: [],
      categories: [],
      filters: DEFAULT_FILTERS,
    }

    expect(savePersistedState(state)).toBe(true)
    expect(loadPersistedState()).toEqual(state)
  })

  it('returns false when save fails', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('fail')
    })

    const state: PersistedStateV1 = {
      version: 1,
      todos: [],
      categories: [],
      filters: DEFAULT_FILTERS,
    }

    expect(savePersistedState(state)).toBe(false)

    spy.mockRestore()
  })
})
