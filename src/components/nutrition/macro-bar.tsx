import { cn } from '@/lib/utils'

interface MacroBarProps {
  label: string
  current: number
  target: number
  unit?: string
  color: 'violet' | 'green' | 'amber' | 'red'
  hero?: boolean
}

const COLOR = {
  violet: { bar: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-950/40' },
  green:  { bar: 'bg-green-500',  text: 'text-green-600 dark:text-green-400',   bg: 'bg-green-100 dark:bg-green-950/40' },
  amber:  { bar: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-100 dark:bg-amber-950/40' },
  red:    { bar: 'bg-red-500',    text: 'text-red-600 dark:text-red-400',       bg: 'bg-red-100 dark:bg-red-950/40' },
}

export function MacroBar({ label, current, target, unit = 'g', color, hero = false }: MacroBarProps) {
  const pct = Math.min(100, target > 0 ? (current / target) * 100 : 0)
  const over = current > target
  const c = COLOR[color]

  if (hero) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className={cn('text-sm font-semibold', c.text)}>{label}</span>
          <span className="tabular text-xs text-muted-foreground">
            <span className={cn('font-bold', c.text)}>{Math.round(current)}</span>
            {' / '}{target}{unit}
          </span>
        </div>
        <div className={cn('h-3 w-full overflow-hidden rounded-full', c.bg)}>
          <div
            className={cn('h-full rounded-full transition-all duration-500', c.bar, over && 'opacity-70')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <div className={cn('h-2 flex-1 overflow-hidden rounded-full', c.bg)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', c.bar, over && 'opacity-70')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular w-16 shrink-0 text-right text-xs text-muted-foreground">
        {Math.round(current)}<span className="opacity-60">/{target}{unit}</span>
      </span>
    </div>
  )
}
