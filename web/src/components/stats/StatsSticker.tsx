export function StatsSticker({
  active,
  completed,
  completionRate,
  overdue,
}: {
  active: number
  completed: number
  completionRate: number
  overdue: number
}) {
  return (
    <div className="pointer-events-auto">
      <div className="rotate-[1.2deg] border border-[color:rgba(42,42,36,0.65)] bg-[color:rgba(230,221,207,0.92)] text-[color:var(--ink-0)] shadow-paper">
        <div className="px-4 pt-4 pb-3">
          <div className="text-[12px] text-[color:rgba(17,17,15,0.7)]">今天</div>
          <div className="mt-1 text-[36px] leading-[1] font-[800] tracking-[-0.04em]">{completionRate}%</div>
          <div className="mt-1 text-[12px] text-[color:rgba(17,17,15,0.72)]">完成率</div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
            <div>
              <div className="text-[color:rgba(17,17,15,0.7)]">待办</div>
              <div className="mt-1 text-[18px] font-[750]">{active}</div>
            </div>
            <div>
              <div className="text-[color:rgba(17,17,15,0.7)]">完成</div>
              <div className="mt-1 text-[18px] font-[750]">{completed}</div>
            </div>
            <div>
              <div className="text-[color:rgba(17,17,15,0.7)]">逾期</div>
              <div className="mt-1 text-[18px] font-[750]">{overdue}</div>
            </div>
            <div>
              <div className="text-[color:rgba(17,17,15,0.7)]">别拖</div>
              <div className="mt-1 text-[18px] font-[750]">{overdue === 0 ? 'OK' : '!'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
