import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import { selectCategoryNameById, selectStats, selectVisibleTodos } from '../../domain/selectors'
import { UNCATEGORIZED_ID, type FilterState } from '../../domain/types'
import { useTodoStore } from '../../store/todoStore'
import { Toast } from '../common/Toast.tsx'
import { BackgroundTexture } from './BackgroundTexture.tsx'
import { TitleBlock } from './TitleBlock.tsx'
import { QuickAddBar } from '../todo/QuickAddBar.tsx'
import { FilterChips } from '../controls/FilterChips.tsx'
import { SearchStrip } from '../controls/SearchStrip.tsx'
import { TodoList } from '../todo/TodoList.tsx'
import { TodoEditorDrawer } from '../todo/TodoEditorDrawer.tsx'
import { CategoryManagerDrawer } from '../category/CategoryManagerDrawer.tsx'
import { StatsSticker } from '../stats/StatsSticker.tsx'

export function AppShell() {
  const quickAddInputRef = useRef<HTMLInputElement>(null)

  const {
    todos,
    categories,
    filters,
    ui,
    hydrate,
    addTodo,
    setFilters,
    openEditor,
    closeEditor,
    openCategoryManager,
    closeCategoryManager,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addCategory,
    renameCategory,
    deleteCategory,
  } = useTodoStore(
    useShallow((s) => ({
      todos: s.todos,
      categories: s.categories,
      filters: s.filters,
      ui: s.ui,
      hydrate: s.hydrate,
      addTodo: s.addTodo,
      setFilters: s.setFilters,
      openEditor: s.openEditor,
      closeEditor: s.closeEditor,
      openCategoryManager: s.openCategoryManager,
      closeCategoryManager: s.closeCategoryManager,
      updateTodo: s.updateTodo,
      deleteTodo: s.deleteTodo,
      toggleTodo: s.toggleTodo,
      addCategory: s.addCategory,
      renameCategory: s.renameCategory,
      deleteCategory: s.deleteCategory,
    })),
  )

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const deferredQuery = useDeferredValue(filters.query)

  const filtersForList = useMemo<FilterState>(() => {
    return {
      ...filters,
      query: deferredQuery,
    }
  }, [filters, deferredQuery])

  const visibleTodos = useMemo(() => {
    return selectVisibleTodos({ todos, filters: filtersForList })
  }, [todos, filtersForList])

  const stats = useMemo(() => {
    return selectStats({ todos })
  }, [todos])

  return (
    <div className="relative">
      <BackgroundTexture />

      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-10 md:grid-cols-[1fr_360px]">
            <div className="md:pl-[2vw]">
              <TitleBlock />

              <div className="mt-6">
                <FilterChips
                  categories={categories}
                  filters={filters}
                  onChange={(patch: Partial<FilterState>) => setFilters(patch)}
                  onOpenCategoryManager={openCategoryManager}
                  uncategorizedId={UNCATEGORIZED_ID}
                />
                <div className="mt-3">
                  <SearchStrip value={filters.query} onChange={(q: string) => setFilters({ query: q })} />
                </div>
              </div>

              <div className="mt-8">
                <TodoList
                  todos={visibleTodos}
                  onToggle={toggleTodo}
                  onEdit={openEditor}
                  onDelete={deleteTodo}
                  getCategoryName={(id: string | null) => selectCategoryNameById(categories, id)}
                  onEmptyAction={() => quickAddInputRef.current?.focus()}
                />
              </div>
            </div>

            <div className="md:pr-[2vw]">
              <div className="md:pt-2">
                <QuickAddBar onAdd={addTodo} inputRef={quickAddInputRef} />
              </div>

              <div className="mt-6 md:ml-auto md:w-[320px]">
                <StatsSticker
                  active={stats.active}
                  completed={stats.completed}
                  completionRate={stats.completionRate}
                  overdue={stats.overdue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {ui.editingTodoId ? (
        <TodoEditorDrawer
          key={ui.editingTodoId}
          openTodoId={ui.editingTodoId}
          todos={todos}
          categories={categories}
          onClose={closeEditor}
          onSave={updateTodo}
          onDelete={deleteTodo}
        />
      ) : null}

      <CategoryManagerDrawer
        open={ui.categoryManagerOpen}
        categories={categories}
        onClose={closeCategoryManager}
        onAdd={addCategory}
        onRename={renameCategory}
        onDelete={deleteCategory}
      />

      <Toast message={ui.toast} />
    </div>
  )
}
