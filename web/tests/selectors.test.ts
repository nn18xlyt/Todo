import { describe, expect, it } from 'vitest'
import { selectStats, selectVisibleTodos } from '../src/domain/selectors'
import { DEFAULT_FILTERS, UNCATEGORIZED_ID, type FilterState, type Todo } from '../src/domain/types'

function makeTodo(patch: Partial<Todo>): Todo {
  const base: Todo = {
    id: 't',
    title: 'x',
    description: '',
    dueDate: null,
    priority: 'P1',
    categoryId: null,
    completed: false,
    createdAt: 0,
    updatedAt: 0,
  }

  return { ...base, ...patch }
}

describe('selectors', () => {
  it('sorts by completion, dueDate presence, dueDate asc, createdAt desc', () => {
    const todos: Todo[] = [
      makeTodo({ id: 'a', title: 'A', createdAt: 1000, dueDate: null, completed: false }),
      makeTodo({ id: 'b', title: 'B', createdAt: 2000, dueDate: '2026-01-20', completed: false }),
      makeTodo({ id: 'c', title: 'C', createdAt: 3000, dueDate: '2026-01-10', completed: false }),
      makeTodo({ id: 'd', title: 'D', createdAt: 4000, dueDate: '2026-01-05', completed: true }),
    ]

    const filters: FilterState = { ...DEFAULT_FILTERS, query: '' }
    const visible = selectVisibleTodos({ todos, filters })

    expect(visible.map((t) => t.id)).toEqual(['c', 'b', 'a', 'd'])
  })

  it('filters by status / priority / category / query', () => {
    const todos: Todo[] = [
      makeTodo({
        id: '1',
        title: '买牛奶',
        description: '超市',
        priority: 'P0',
        categoryId: null,
        completed: false,
        createdAt: 1000,
      }),
      makeTodo({
        id: '2',
        title: '写周报',
        description: '周五发',
        priority: 'P2',
        categoryId: 'work',
        completed: true,
        createdAt: 2000,
      }),
    ]

    const activeOnly: FilterState = { ...DEFAULT_FILTERS, status: 'active' }
    expect(selectVisibleTodos({ todos, filters: activeOnly }).map((t) => t.id)).toEqual(['1'])

    const p0Only: FilterState = { ...DEFAULT_FILTERS, priority: 'P0' }
    expect(selectVisibleTodos({ todos, filters: p0Only }).map((t) => t.id)).toEqual(['1'])

    const uncategorized: FilterState = { ...DEFAULT_FILTERS, categoryId: UNCATEGORIZED_ID }
    expect(selectVisibleTodos({ todos, filters: uncategorized }).map((t) => t.id)).toEqual(['1'])

    const query: FilterState = { ...DEFAULT_FILTERS, query: '牛奶' }
    expect(selectVisibleTodos({ todos, filters: query }).map((t) => t.id)).toEqual(['1'])
  })

  it('calculates stats', () => {
    const todos: Todo[] = [
      makeTodo({ id: '1', dueDate: '2026-01-01', completed: false }),
      makeTodo({ id: '2', completed: true }),
    ]

    const stats = selectStats({ todos })
    expect(stats.total).toBe(2)
    expect(stats.completed).toBe(1)
    expect(stats.active).toBe(1)
    expect(stats.completionRate).toBe(50)
  })
})
