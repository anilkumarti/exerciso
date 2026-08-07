'use client'

import { useTransition } from 'react'
import { setDietPref } from '@/lib/actions/nutrition'
import type { DietPref } from '@/data/food-database'
import { cn } from '@/lib/utils'

const OPTIONS: { value: DietPref; label: string; desc: string; emoji: string }[] = [
  { value: 'veg',        label: 'Vegetarian',      desc: 'No meat, no eggs',       emoji: '🥗' },
  { value: 'eggetarian', label: 'Eggetarian',       desc: 'Vegetarian + eggs',      emoji: '🥚' },
  { value: 'non_veg',    label: 'Non-vegetarian',   desc: 'All foods including meat', emoji: '🍗' },
]

export function DietPrefSetting({ current }: { current: DietPref }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-2">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => startTransition(() => setDietPref(opt.value))}
          disabled={isPending}
          className={cn(
            'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
            current === opt.value
              ? 'border-primary bg-primary/5'
              : 'border-border hover:bg-muted/50',
          )}
        >
          <span className="text-xl leading-none">{opt.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{opt.label}</p>
            <p className="text-xs text-muted-foreground">{opt.desc}</p>
          </div>
          <div className={cn(
            'size-4 shrink-0 rounded-full border-2 transition-colors',
            current === opt.value
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/30',
          )} />
        </button>
      ))}
    </div>
  )
}
