'use client'

import { useState, useEffect, useTransition } from 'react'
import { BookmarkX, UtensilsCrossed } from 'lucide-react'
import { logMeal } from '@/lib/actions/nutrition'
import type { MealEntryPayload } from '@/lib/actions/nutrition'
import { cn } from '@/lib/utils'

export type { MealEntryPayload }

export interface SavedMeal {
  id: string
  name: string
  entries: MealEntryPayload[]
  total_calories: number
  total_protein_g: number
}

const STORAGE_KEY = 'exerciso_saved_meals'

export function getSavedMeals(): SavedMeal[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const UPDATED_EVENT = 'exerciso:saved-meals-updated'

export function persistSavedMeal(meal: Omit<SavedMeal, 'id'>): void {
  const meals = getSavedMeals()
  meals.unshift({ ...meal, id: Date.now().toString() })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals))
  window.dispatchEvent(new CustomEvent(UPDATED_EVENT))
}

export function removeSavedMeal(id: string): void {
  const meals = getSavedMeals().filter(m => m.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals))
  window.dispatchEvent(new CustomEvent(UPDATED_EVENT))
}

export function SavedMealsSection({ date }: { date: string }) {
  const [meals, setMeals] = useState<SavedMeal[]>([])
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)
    setMeals(getSavedMeals())
    const onUpdate = () => setMeals(getSavedMeals())
    window.addEventListener('exerciso:saved-meals-updated', onUpdate)
    return () => window.removeEventListener('exerciso:saved-meals-updated', onUpdate)
  }, [])

  if (!mounted || meals.length === 0) return null

  function handleDelete(id: string) {
    removeSavedMeal(id)
    setMeals(getSavedMeals())
  }

  function handleLog(meal: SavedMeal) {
    startTransition(async () => {
      await logMeal(meal.entries, date)
    })
  }

  return (
    <div className="px-4 mb-6">
      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Saved meals
      </p>
      <div className="flex flex-col gap-2">
        {meals.map(meal => (
          <div key={meal.id} className="surface flex items-center gap-3 px-4 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UtensilsCrossed className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{meal.name}</p>
              <p className="tabular mt-0.5 text-xs text-muted-foreground">
                {meal.total_calories} cal · {Math.round(meal.total_protein_g)}g protein · {meal.entries.length} items
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleLog(meal)}
                disabled={isPending}
                className={cn(
                  'rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity',
                  isPending && 'opacity-50',
                )}
              >
                Log
              </button>
              <button
                onClick={() => handleDelete(meal.id)}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label={`Delete ${meal.name}`}
              >
                <BookmarkX className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
