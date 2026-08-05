import { format, parseISO, isToday, isYesterday, formatDistanceToNow } from 'date-fns'

export function todayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d, yyyy')
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function formatTimeAgo(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
}

export function formatShortDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d')
}

export function formatMonthYear(dateString: string): string {
  return format(parseISO(dateString), 'MMMM yyyy')
}

/** Convert seconds to MM:SS display for rest timer */
export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
