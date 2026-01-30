import { useState, type RefObject } from 'react'
import { Icon } from '../common/Icon'

type Props = {
  onAdd: (title: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
}

export function QuickAddBar({ onAdd, inputRef }: Props) {
  const [title, setTitle] = useState('')

  function submit() {
    const t = title.trim()
    if (!t) return
    onAdd(t)
    setTitle('')
  }

  return (
    <div className="rotate-[-0.6deg] border border-[color:rgba(42,42,36,0.7)] bg-[color:rgba(242,233,220,0.94)] text-[color:var(--ink-0)] shadow-paper">
      <div className="px-4 py-4">
        <div className="text-[12px] text-[color:rgba(17,17,15,0.7)]">3 秒加一条</div>

        <div className="mt-2 flex items-stretch gap-2">
          <input
            className="h-10 w-full border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(230,221,207,0.65)] px-3 text-[14px] outline-none transition duration-200 ease-snap focus:translate-y-[-1px]"
            placeholder="写点啥？"
            value={title}
            ref={inputRef}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
          />
          <button
            className="h-10 shrink-0 border border-[color:rgba(42,42,36,0.75)] bg-[color:var(--acid-0)] px-3 text-[14px] font-[750] transition duration-200 ease-snap hover:translate-y-[-1px]"
            onClick={submit}
            title="加一件事"
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="carbon:add" className="h-5 w-5" />
              加一件事
            </span>
          </button>
        </div>

        <div className="mt-3 text-[12px] text-[color:rgba(17,17,15,0.64)]">回车也行。</div>
      </div>
    </div>
  )
}
