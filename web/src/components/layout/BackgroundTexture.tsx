export function BackgroundTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage:
          'radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(1px 1px at 62% 58%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(1px 1px at 82% 32%, rgba(255,255,255,0.06), transparent 60%)',
        backgroundSize: '180px 180px',
        mixBlendMode: 'overlay',
        opacity: 0.55,
      }}
    />
  )
}
