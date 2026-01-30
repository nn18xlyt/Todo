import { useEffect } from 'react'

type Props = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = '删掉',
  cancelText = '算了',
  danger = true,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="close"
        className="absolute inset-0 bg-[color:rgba(0,0,0,0.55)]"
        onClick={onCancel}
      />

      <div className="absolute left-[6vw] top-[12vh] w-[min(520px,88vw)]">
        <div className="rotate-[-0.5deg] border border-[color:rgba(42,42,36,0.7)] bg-[color:var(--paper-0)] text-[color:var(--ink-0)] shadow-paper">
          <div className="px-5 pt-5">
            <div className="text-[22px] font-[750] tracking-[-0.02em]">{title}</div>
            {description ? (
              <div className="mt-2 text-[14px] text-[color:rgba(17,17,15,0.72)]">{description}</div>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-end gap-2 px-5 pb-5">
            <button
              className="h-9 px-3 border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(230,221,207,0.7)] text-[13px] transition duration-200 ease-snap hover:translate-y-[-1px]"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className={
                danger
                  ? 'h-9 px-3 border border-[color:rgba(42,42,36,0.75)] bg-[color:var(--rust-0)] text-[color:var(--paper-0)] text-[13px] transition duration-200 ease-snap hover:translate-y-[-1px]'
                  : 'h-9 px-3 border border-[color:rgba(42,42,36,0.75)] bg-[color:var(--acid-0)] text-[color:var(--ink-0)] text-[13px] transition duration-200 ease-snap hover:translate-y-[-1px]'
              }
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
