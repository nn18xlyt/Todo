import { useMemo, useState } from 'react'
import type { Category, Priority, Todo } from '../../domain/types'
import { Icon } from '../common/Icon'
import { ConfirmModal } from '../common/ConfirmModal'

type Props = {
  openTodoId: string
  todos: Todo[]
  categories: Category[]
  onClose: () => void
  onSave: (id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void
}

export function TodoEditorDrawer({ openTodoId, todos, categories, onClose, onSave, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const todo = useMemo(() => {
    return todos.find((t) => t.id === openTodoId) ?? null
  }, [openTodoId, todos])

  const [title, setTitle] = useState(() => todo?.title ?? '')
  const [description, setDescription] = useState(() => todo?.description ?? '')
  const [dueDate, setDueDate] = useState<string | null>(() => todo?.dueDate ?? null)
  const [priority, setPriority] = useState<Priority>(() => todo?.priority ?? 'P1')
  const [categoryId, setCategoryId] = useState<string | null>(() => todo?.categoryId ?? null)

  const open = Boolean(todo)

  function save() {
    if (!todo) return
    const t = title.trim()
    if (!t) return

    onSave(todo.id, {
      title: t,
      description: description.trim(),
      dueDate,
      priority,
      categoryId,
    })

    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40">
        <button
          aria-label="close"
          className="absolute inset-0 bg-[color:rgba(0,0,0,0.55)]"
          onClick={onClose}
        />

        <div className="absolute right-0 top-0 h-full w-[min(520px,92vw)]">
          <div className="h-full border-l border-[color:rgba(42,42,36,0.75)] bg-[color:rgba(242,233,220,0.96)] text-[color:var(--ink-0)] shadow-paper">
            <div className="flex items-center justify-between px-5 pt-5">
              <div className="text-[20px] font-[850] tracking-[-0.02em]">改一改</div>
              <button
                className="h-9 px-2 border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(230,221,207,0.65)] transition duration-200 ease-snap hover:translate-y-[-1px]"
                onClick={onClose}
                type="button"
                title="关闭"
              >
                <Icon name="carbon:close" className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-6 space-y-4">
              <div>
                <div className="text-[12px] text-[color:rgba(17,17,15,0.7)]">标题</div>
                <input
                  className="mt-2 h-10 w-full border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(230,221,207,0.65)] px-3 text-[14px] outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <div className="text-[12px] text-[color:rgba(17,17,15,0.7)]">描述</div>
                <textarea
                  className="mt-2 min-h-[96px] w-full border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(230,221,207,0.65)] px-3 py-2 text-[14px] outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[12px] text-[color:rgba(17,17,15,0.7)]">日期</div>
                  <input
                    type="date"
                    className="mt-2 h-10 w-full border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(230,221,207,0.65)] px-3 text-[14px] outline-none"
                    value={dueDate ?? ''}
                    onChange={(e) => setDueDate(e.target.value ? e.target.value : null)}
                  />
                </div>
                <div>
                  <div className="text-[12px] text-[color:rgba(17,17,15,0.7)]">优先级</div>
                  <select
                    className="mt-2 h-10 w-full border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(230,221,207,0.65)] px-3 text-[14px] outline-none"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    <option value="P0">P0</option>
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="text-[12px] text-[color:rgba(17,17,15,0.7)]">分类</div>
                <select
                  className="mt-2 h-10 w-full border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(230,221,207,0.65)] px-3 text-[14px] outline-none"
                  value={categoryId ?? ''}
                  onChange={(e) => setCategoryId(e.target.value ? e.target.value : null)}
                >
                  <option value="">未分类</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  className="h-10 px-3 border border-[color:rgba(42,42,36,0.75)] bg-[color:rgba(178,74,58,0.18)] text-[14px] transition duration-200 ease-snap hover:translate-y-[-1px]"
                  onClick={() => setConfirmDelete(true)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon name="carbon:trash-can" className="h-5 w-5" />
                    删除
                  </span>
                </button>

                <button
                  className="h-10 px-4 border border-[color:rgba(42,42,36,0.8)] bg-[color:var(--acid-0)] text-[14px] font-[800] transition duration-200 ease-snap hover:translate-y-[-1px]"
                  onClick={save}
                  type="button"
                >
                  收下了
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="真删？"
        description="删了就没了。"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false)
          if (todo) onDelete(todo.id)
          onClose()
        }}
      />
    </>
  )
}
