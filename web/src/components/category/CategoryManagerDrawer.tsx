import { useMemo, useState } from 'react'
import type { Category } from '../../domain/types'
import { ConfirmModal } from '../common/ConfirmModal'
import { Icon } from '../common/Icon'

type Props = {
  open: boolean
  categories: Category[]
  onClose: () => void
  onAdd: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function CategoryManagerDrawer({ open, categories, onClose, onAdd, onRename, onDelete }: Props) {
  const [name, setName] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const deleting = useMemo(() => categories.find((c) => c.id === deleteId) ?? null, [categories, deleteId])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40">
        <button
          aria-label="close"
          className="absolute inset-0 bg-[color:rgba(0,0,0,0.55)]"
          onClick={onClose}
        />

        <div className="absolute left-0 top-0 h-full w-[min(520px,92vw)]">
          <div className="h-full border-r border-[color:rgba(42,42,36,0.75)] bg-[color:rgba(242,233,220,0.96)] text-[color:var(--ink-0)] shadow-paper">
            <div className="flex items-center justify-between px-5 pt-5">
              <div className="text-[20px] font-[850] tracking-[-0.02em]">分类</div>
              <button
                className="h-9 px-2 border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(230,221,207,0.65)] transition duration-200 ease-snap hover:translate-y-[-1px]"
                onClick={onClose}
                type="button"
                title="关闭"
              >
                <Icon name="carbon:close" className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-6">
              <div className="rotate-[-0.2deg] border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(230,221,207,0.65)] px-3 py-3">
                <div className="text-[12px] text-[color:rgba(17,17,15,0.7)]">加一个</div>
                <div className="mt-2 flex gap-2">
                  <input
                    className="h-10 w-full border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(242,233,220,0.8)] px-3 text-[14px] outline-none"
                    placeholder="起个名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onAdd(name)
                        setName('')
                      }
                    }}
                  />
                  <button
                    className="h-10 shrink-0 border border-[color:rgba(42,42,36,0.75)] bg-[color:var(--acid-0)] px-3 text-[14px] font-[750] transition duration-200 ease-snap hover:translate-y-[-1px]"
                    onClick={() => {
                      onAdd(name)
                      setName('')
                    }}
                    type="button"
                  >
                    添加
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {categories.length === 0 ? (
                  <div className="text-[14px] text-[color:rgba(17,17,15,0.65)]">先别分类。</div>
                ) : null}

                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="rotate-[0.2deg] border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(230,221,207,0.65)] px-3 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name="carbon:tag" className="h-4 w-4" />
                      <input
                        className="h-9 w-full bg-[color:rgba(242,233,220,0.7)] border border-[color:rgba(42,42,36,0.55)] px-3 text-[14px] outline-none"
                        defaultValue={c.name}
                        onBlur={(e) => onRename(c.id, e.target.value)}
                      />
                      <button
                        className="h-9 shrink-0 px-2 border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(242,233,220,0.55)] transition duration-200 ease-snap hover:translate-y-[-1px]"
                        onClick={() => setDeleteId(c.id)}
                        type="button"
                        title="删除"
                      >
                        <Icon name="carbon:trash-can" className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-[12px] text-[color:rgba(17,17,15,0.62)]">删分类会把任务丢回未分类。</div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="真删？"
        description={deleting ? `删掉“${deleting.name}”。` : '删了就没了。'}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId)
          setDeleteId(null)
        }}
      />
    </>
  )
}
