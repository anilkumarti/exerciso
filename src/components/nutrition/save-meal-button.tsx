'use client'

import { useState } from 'react'
import { Bookmark, X } from 'lucide-react'
import { persistSavedMeal, type MealEntryPayload } from './saved-meals-section'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FoodEntryLike {
  food_name_snapshot: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  quantity_grams: number
  meal_type: string
}

export function SaveMealButton({ entries }: { entries: FoodEntryLike[] }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  if (entries.length === 0) return null

  const totalCal = Math.round(entries.reduce((s, e) => s + e.calories, 0))
  const totalProt = entries.reduce((s, e) => s + e.protein_g, 0)

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    const mealEntries: MealEntryPayload[] = entries.map(e => ({
      food_name: e.food_name_snapshot,
      calories: e.calories,
      protein_g: e.protein_g,
      carbs_g: e.carbs_g,
      fat_g: e.fat_g,
      quantity_grams: e.quantity_grams,
      meal_type: e.meal_type,
    }))
    persistSavedMeal({
      name: trimmed,
      entries: mealEntries,
      total_calories: totalCal,
      total_protein_g: totalProt,
    })
    setName('')
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bookmark className="size-3.5" />
        Save today&apos;s log as meal
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 shadow-raised">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Save as meal</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              {entries.length} items · {totalCal} cal · {Math.round(totalProt)}g protein
            </p>
            <Input
              placeholder="Meal name, e.g. Post-workout"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              className="mb-3 h-11 text-base"
            />
            <Button onClick={handleSave} className="h-11 w-full" disabled={!name.trim()}>
              Save
            </Button>
          </div>
        </>
      )}
    </>
  )
}
