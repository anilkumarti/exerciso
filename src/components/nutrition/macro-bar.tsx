import { cn } from '@/lib/utils'

interface MacroBarProps {
  label: string
  current: number
  target: number
  unit?: string
  color: 'violet' | 'green' | 'amber' | 'red'
  hero?: boolean
}

const BAR_COLOR = {
  violet: { bar: 'bg-primary',     text: 'text-primary',                               bg: 'bg-primary/10' },
  green:  { bar: 'bg-green-500',   text: 'text-green-600 dark:text-green-400',          bg: 'bg-green-500/10' },
  amber:  { bar: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-400',          bg: 'bg-amber-500/10' },
  red:    { bar: 'bg-rose-500',    text: 'text-rose-600 dark:text-rose-400',            bg: 'bg-rose-500/10' },
}

export function MacroBar({ label, current, target, unit = 'g', color, hero = false }: MacroBarProps) {
  const pct = Math.min(100, target > 0 ? (current / target) * 100 : 0)
  const over = current > target
  const c = BAR_COLOR[color]

  if (hero) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className={cn('text-sm font-bold', c.text)}>{label}</span>
          <span className="tabular text-xs text-muted-foreground">
            <span className={cn('font-bold text-sm', c.text)}>{Math.round(current)}</span>
            <span className="opacity-60"> / {target}{unit}</span>
          </span>
        </div>
        <div className={cn('h-2.5 w-full overflow-hidden rounded-full', c.bg)}>
          <div
            className={cn('h-full rounded-full transition-all duration-700', c.bar, over && 'opacity-60')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-xs font-semibold text-muted-foreground">{label}</span>
      <div className={cn('h-2 flex-1 overflow-hidden rounded-full', c.bg)}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', c.bar, over && 'opacity-60')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular w-16 shrink-0 text-right text-xs text-muted-foreground">
        {Math.round(current)}<span className="opacity-50">/{target}{unit}</span>
      </span>
    </div>
  )
}

/* ─── Circular arc ring ─────────────────────────────────────────────────── */

interface MacroRingProps {
  label: string
  current: number
  target: number
  unit?: string
  /** CSS color value used for the arc stroke — use a var() or hex */
  strokeColor: string
}

const R = 36
const C = 2 * Math.PI * R  // ≈ 226.2

export function MacroRing({ label, current, target, unit = 'g', strokeColor }: MacroRingProps) {
  const pct = Math.min(1, target > 0 ? current / target : 0)
  const offset = C * (1 - pct)
  const over = current > target

  return (
    <div className="surface flex flex-col items-center gap-2 px-2 py-4">
      {/* Arc */}
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          className="size-[4.75rem]"
          aria-hidden
        >
          {/* Track */}
          <circle
            cx="50" cy="50" r={R}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8.5"
            opacity={0.14}
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={R}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8.5"
            strokeDasharray={C}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            opacity={over ? 0.7 : 1}
            style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="tabular text-[1rem] font-black leading-none">{Math.round(current)}</span>
          <span className="text-[0.5rem] font-semibold uppercase tracking-wider text-muted-foreground">{unit}</span>
        </div>
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-[0.75rem] font-bold">{label}</p>
        <p className="text-[0.625rem] text-muted-foreground tabular">{target}{unit} goal</p>
      </div>
    </div>
  )
}
