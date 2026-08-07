'use client'

import { useTransition } from 'react'
import { Dumbbell, Moon } from 'lucide-react'
import { setDayMode } from '@/lib/actions/nutrition'
import { cn } from '@/lib/utils'

export function DayModeToggle({ mode }: { mode: 'rest' | 'training' }) {
  const [isPending, startTransition] = useTransition()
  const next = mode === 'training' ? 'rest' : 'training'

  return (
    <button
      onClick={() => startTransition(() => setDayMode(next))}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
        mode === 'rest'
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
          : 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
        isPending && 'opacity-50',
      )}
      aria-label={`Switch to ${next} day`}
    >
      {mode === 'rest' ? (
        <><Moon className="size-3" /> Rest day</>
      ) : (
        <><Dumbbell className="size-3" /> Training</>
      )}
    </button>
  )
}
