import { Icon as IconifyIcon } from '@iconify/react'

export function Icon({ name, className }: { name: string; className?: string }) {
  return <IconifyIcon icon={name} className={className} />
}
