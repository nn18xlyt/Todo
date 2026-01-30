import type { Todo } from '../../domain/types'
import { TodoNoteItem } from './TodoNoteItem.tsx'

type Props = {
  todos: Todo[]
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  getCategoryName: (id: string | null) => string
  onEmptyAction?: () => void
}

export function TodoList({ todos, onToggle, onEdit, onDelete, getCategoryName, onEmptyAction }: Props) {
  if (todos.length === 0) {
    return (
      <button
        className="w-full text-left rotate-[-0.3deg] border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(20,19,17,0.55)] px-5 py-6 transition duration-200 ease-snap hover:translate-y-[-1px]"
        type="button"
        onClick={onEmptyAction}
      >
        <div className="text-[14px] text-[color:rgba(242,233,220,0.78)]">先写一条。</div>
        <div className="mt-2 text-[12px] text-[color:rgba(242,233,220,0.52)]">右边那个输入框，别害羞。</div>
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((t, idx) => (
        <TodoNoteItem
          key={t.id}
          todo={t}
          index={idx}
          categoryName={getCategoryName(t.categoryId)}
          onToggle={() => onToggle(t.id)}
          onEdit={() => onEdit(t.id)}
          onDelete={() => onDelete(t.id)}
        />
      ))}
    </div>
  )
}
