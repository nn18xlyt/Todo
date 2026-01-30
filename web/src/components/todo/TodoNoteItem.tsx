import { useMemo, useState } from 'react'
import { isOverdue } from '../../lib/dates'
import type { Todo } from '../../domain/types'
import { ConfirmModal } from '../common/ConfirmModal'
import { Icon } from '../common/Icon'

type Props = {
  todo: Todo
  index: number
  categoryName: string
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TodoNoteItem({ todo, index, categoryName, onToggle, onEdit, onDelete }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const overdue = useMemo(() => {
    if (!todo.dueDate) return false
    return !todo.completed && isOverdue(todo.dueDate)
  }, [todo.completed, todo.dueDate])

  const rotate = (index % 3) - 1

  return (
    <>
      <div
        className={
          'border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(242,233,220,0.92)] text-[color:var(--ink-0)] shadow-paper transition duration-200 ease-snap hover:translate-y-[-1px]'
        }
        style={{ transform: `rotate(${rotate * 0.3}deg)` }}
      >
        <div className="px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <button
              className={
                todo.completed
                  ? 'mt-1 h-6 w-6 border border-[color:rgba(42,42,36,0.8)] bg-[color:rgba(184,255,77,0.55)]'
                  : 'mt-1 h-6 w-6 border border-[color:rgba(42,42,36,0.8)] bg-[color:rgba(230,221,207,0.55)]'
              }
              onClick={onToggle}
              type="button"
              title="完成"
            >
              {todo.completed ? <Icon name="carbon:checkmark" className="h-5 w-5" /> : null}
            </button>

            <div className="min-w-0 flex-1">
              <div
                className={
                  todo.completed
                    ? 'text-[16px] font-[800] line-through text-[color:rgba(17,17,15,0.55)]'
                    : 'text-[16px] font-[800]'
                }
              >
                {todo.title}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 border border-[color:rgba(42,42,36,0.55)] bg-[color:rgba(230,221,207,0.6)] px-2 py-1 text-[12px]">
                  <Icon name="carbon:tag" className="h-3.5 w-3.5" />
                  {categoryName}
                </span>

                <span className="inline-flex items-center gap-1 border border-[color:rgba(42,42,36,0.55)] bg-[color:rgba(230,221,207,0.6)] px-2 py-1 text-[12px]">
                  {todo.priority}
                </span>

                {todo.dueDate ? (
                  <span
                    className={
                      overdue
                        ? 'inline-flex items-center gap-1 border border-[color:rgba(42,42,36,0.7)] bg-[color:rgba(178,74,58,0.16)] px-2 py-1 text-[12px]'
                        : 'inline-flex items-center gap-1 border border-[color:rgba(42,42,36,0.55)] bg-[color:rgba(230,221,207,0.6)] px-2 py-1 text-[12px]'
                    }
                  >
                    <Icon name="carbon:calendar" className="h-3.5 w-3.5" />
                    {todo.dueDate}
                    {overdue ? <span className="ml-1 text-[12px]">超时了</span> : null}
                  </span>
                ) : null}
              </div>

              {todo.description ? (
                <div className="mt-3 text-[13px] text-[color:rgba(17,17,15,0.72)]">{todo.description}</div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="h-9 px-2 border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(230,221,207,0.65)] transition duration-200 ease-snap hover:translate-y-[-1px]"
                onClick={onEdit}
                type="button"
                title="编辑"
              >
                <Icon name="carbon:edit" className="h-5 w-5" />
              </button>
              <button
                className="h-9 px-2 border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(230,221,207,0.65)] transition duration-200 ease-snap hover:translate-y-[-1px]"
                onClick={() => setConfirmOpen(true)}
                type="button"
                title="删除"
              >
                <Icon name="carbon:trash-can" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="真删？"
        description="删了就没了。"
        confirmText="删掉"
        cancelText="算了"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          onDelete()
        }}
      />
    </>
  )
}
