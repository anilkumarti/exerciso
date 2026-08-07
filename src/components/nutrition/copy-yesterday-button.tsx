'use client'

import { useTransition } from 'react'
import { Copy } from 'lucide-react'
import { copyYesterdayLog } from '@/lib/actions/nutrition'

interface Props {
  date: string
  yesterdayCalories: number
  yesterdayProtein: number
  compact?: boolean
}

export function CopyYesterdayButton({ date, yesterdayCalories, yesterdayProtein, compact = false }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleCopy() {
    startTransition(async () => {
      await copyYesterdayLog(date)
    })
  }

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        disabled={isPending}
        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
      >
        <Copy className="size-3" />
        {isPending ? 'Copying…' : "Add yesterday's meals"}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      disabled={isPending}
      className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3.5 text-left transition-colors hover:bg-primary/10 disabled:opacity-60"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Copy className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-primary">
          {isPending ? 'Copying meals…' : 'Same as yesterday'}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {yesterdayCalories} cal · {yesterdayProtein}g protein
        </p>
      </div>
    </button>
  )
}
