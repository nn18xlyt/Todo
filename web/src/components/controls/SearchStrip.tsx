import { Icon } from '../common/Icon'
import { useEffect, useState } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function SearchStrip({ value, onChange }: Props) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (draft !== value) onChange(draft)
    }, 260)

    return () => window.clearTimeout(t)
  }, [draft, value, onChange])

  return (
    <div className="rotate-[0.3deg] border border-[color:rgba(42,42,36,0.55)] bg-[color:rgba(20,19,17,0.55)] px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon name="carbon:search" className="h-4 w-4 text-[color:rgba(242,233,220,0.78)]" />
        <input
          className="h-8 w-full bg-transparent text-[14px] text-[color:var(--paper-0)] outline-none placeholder:text-[color:rgba(242,233,220,0.52)]"
          placeholder="你找啥？"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </div>
    </div>
  )
}
