'use client'

import { useTransition } from 'react'
import { setDietPref } from '@/lib/actions/nutrition'
import type { DietPref } from '@/data/food-database'
import { cn } from '@/lib/utils'

const OPTIONS: { value: DietPref; label: string; emoji: string }[] = [
  { value: 'veg',        label: 'Veg',      emoji: '🥗' },
  { value: 'eggetarian', label: '+ Egg',    emoji: '🥚' },
  { value: 'non_veg',   label: 'Non-veg',  emoji: '🍗' },
]

export function DietPrefToggle({ pref }: { pref: DietPref }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center rounded-full border border-border bg-muted p-0.5 text-xs font-semibold">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => startTransition(() => setDietPref(opt.value))}
          disabled={isPending}
          className={cn(
            'rounded-full px-2.5 py-1 transition-all',
            pref === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {opt.emoji} {opt.label}
        </button>
      ))}
    </div>
  )
}
