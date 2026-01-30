export function makeId() {
  if (globalThis.crypto && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}
