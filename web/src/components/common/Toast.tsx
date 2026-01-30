export function Toast({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="rotate-[0.4deg] border border-[color:rgba(42,42,36,0.7)] bg-[color:rgba(242,233,220,0.96)] text-[color:var(--ink-0)] shadow-lift px-4 py-3 text-[13px]">
        {message}
      </div>
    </div>
  )
}
