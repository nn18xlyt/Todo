import { format, isBefore, parseISO, startOfDay } from 'date-fns'

export function toDayIso(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function todayIso(now = new Date()) {
  return toDayIso(now)
}

export function isOverdue(dueDateIso: string, now = new Date()) {
  const due = startOfDay(parseISO(dueDateIso))
  const today = startOfDay(now)
  return isBefore(due, today)
}
