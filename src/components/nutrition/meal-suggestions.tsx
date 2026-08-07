'use client'

import { useState, useTransition } from 'react'
import { Sparkles, X } from 'lucide-react'
import { logMeal } from '@/lib/actions/nutrition'
import type { FoodItem } from '@/data/food-database'
import { cn } from '@/lib/utils'

interface Props {
  suggestions: FoodItem[]
  remainingCal: number
  remainingProtein: number
  date: string
}

export function MealSuggestions({ suggestions, remainingCal, remainingProtein, date }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [loggedId, setLoggedId] = useState<string | null>(null)

  if (suggestions.length === 0) return null

  function handleLog(food: FoodItem) {
    setLoggedId(food.id)
    startTransition(async () => {
      await logMeal(
        [{
          food_name: food.name,
          calories: food.calories,
          protein_g: food.protein_g,
          carbs_g: food.carbs_g,
          fat_g: food.fat_g,
          quantity_grams: food.serving_g,
          meal_type: 'snack',
        }],
        date,
      )
      setOpen(false)
      setLoggedId(null)
    })
  }

  return (
    <div className="px-4 mb-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <Sparkles className="size-4 shrink-0" />
          <span className="flex-1 text-left">
            Suggest a meal — {remainingCal} cal &amp; {Math.round(remainingProtein)}g protein left
          </span>
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles className="size-3.5 text-primary" />
              Suggested meals
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="px-4 pb-2 text-xs text-muted-foreground">
            Based on your remaining {remainingCal} cal &amp; {Math.round(remainingProtein)}g protein
          </p>
          <div className="divide-y divide-border">
            {suggestions.map(food => (
              <div key={food.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{food.name}</p>
                  <p className="tabular mt-0.5 text-xs text-muted-foreground">
                    {food.serving_label} · {food.calories} cal · {food.protein_g}g protein
                  </p>
                </div>
                <button
                  onClick={() => handleLog(food)}
                  disabled={isPending}
                  className={cn(
                    'shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity',
                    isPending && loggedId === food.id && 'opacity-50',
                  )}
                >
                  {loggedId === food.id ? 'Adding…' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
