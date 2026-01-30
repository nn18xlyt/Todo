import type { Category, FilterState, PriorityFilter, StatusFilter } from '../../domain/types'
import { Icon } from '../common/Icon'

type Props = {
  categories: Category[]
  filters: FilterState
  uncategorizedId: string
  onChange: (patch: Partial<FilterState>) => void
  onOpenCategoryManager: () => void
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={
        active
          ? 'h-9 px-3 border border-[color:rgba(42,42,36,0.85)] bg-[color:rgba(184,255,77,0.18)] text-[14px] font-[750] transition duration-200 ease-snap hover:translate-y-[-1px]'
          : 'h-9 px-3 border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(20,19,17,0.55)] text-[14px] text-[color:rgba(242,233,220,0.78)] transition duration-200 ease-snap hover:translate-y-[-1px]'
      }
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

export function FilterChips({
  categories,
  filters,
  uncategorizedId,
  onChange,
  onOpenCategoryManager,
}: Props) {
  const statusOptions: Array<{ label: string; value: StatusFilter }> = [
    { label: '全部', value: 'all' },
    { label: '未完', value: 'active' },
    { label: '已完', value: 'completed' },
  ]

  const priorityOptions: Array<{ label: string; value: PriorityFilter }> = [
    { label: '全部', value: 'all' },
    { label: 'P0', value: 'P0' },
    { label: 'P1', value: 'P1' },
    { label: 'P2', value: 'P2' },
  ]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {statusOptions.map((o) => (
          <Chip
            key={o.value}
            active={filters.status === o.value}
            label={o.label}
            onClick={() => onChange({ status: o.value })}
          />
        ))}

        <div className="mx-1 h-5 w-px bg-[color:rgba(242,233,220,0.18)]" />

        {priorityOptions.map((o) => (
          <Chip
            key={o.value}
            active={filters.priority === o.value}
            label={o.label}
            onClick={() => onChange({ priority: o.value })}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="rotate-[-0.2deg] border border-[color:rgba(42,42,36,0.6)] bg-[color:rgba(20,19,17,0.55)] px-3">
            <div className="flex items-center gap-2">
              <Icon name="carbon:tag" className="h-4 w-4 text-[color:rgba(242,233,220,0.7)]" />
              <select
                className="h-10 w-full bg-transparent text-[14px] text-[color:var(--paper-0)] outline-none"
                value={filters.categoryId}
                onChange={(e) => onChange({ categoryId: e.target.value as FilterState['categoryId'] })}
              >
                <option value="all">全部分类</option>
                <option value={uncategorizedId}>未分类</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          className="h-10 shrink-0 border border-[color:rgba(42,42,36,0.75)] bg-[color:rgba(242,233,220,0.1)] px-3 text-[14px] transition duration-200 ease-snap hover:translate-y-[-1px]"
          onClick={onOpenCategoryManager}
          type="button"
          title="分类"
        >
          <span className="inline-flex items-center gap-2">
            <Icon name="carbon:settings" className="h-4 w-4" />
            分类
          </span>
        </button>
      </div>
    </div>
  )
}
