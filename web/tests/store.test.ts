import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_FILTERS } from '../src/domain/types'
import { useTodoStore } from '../src/store/todoStore'

describe('todoStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()

    useTodoStore.setState({
      todos: [],
      categories: [],
      filters: DEFAULT_FILTERS,
      ui: {
        editingTodoId: null,
        categoryManagerOpen: false,
        toast: null,
      },
    })
  })

  it('adds a todo', () => {
    useTodoStore.getState().addTodo('买牛奶')
    const todos = useTodoStore.getState().todos
    expect(todos.length).toBe(1)
    expect(todos[0].title).toBe('买牛奶')

    vi.runOnlyPendingTimers()
  })

  it('toggles a todo', () => {
    useTodoStore.getState().addTodo('A')
    const id = useTodoStore.getState().todos[0].id

    useTodoStore.getState().toggleTodo(id)
    expect(useTodoStore.getState().todos[0].completed).toBe(true)

    vi.runOnlyPendingTimers()
  })

  it('category delete moves todos to uncategorized', () => {
    useTodoStore.getState().addCategory('工作')
    const catId = useTodoStore.getState().categories[0].id

    useTodoStore.getState().addTodo({ title: '写周报', categoryId: catId })
    const todoId = useTodoStore.getState().todos[0].id

    useTodoStore.getState().deleteCategory(catId)
    const todo = useTodoStore.getState().todos.find((t) => t.id === todoId)!

    expect(todo.categoryId).toBeNull()

    vi.runOnlyPendingTimers()
  })
})
