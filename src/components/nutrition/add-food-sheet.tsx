'use client'

import { useRef, useState, useTransition } from 'react'
import { Plus, X, Zap } from 'lucide-react'
import { logFood } from '@/lib/actions/nutrition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { RecentFood } from '@/lib/queries/nutrition'

const MEAL_TYPES = [
  { value: 'breakfast',    label: 'Breakfast' },
  { value: 'lunch',        label: 'Lunch' },
  { value: 'dinner',       label: 'Dinner' },
  { value: 'snack',        label: 'Snack' },
  { value: 'pre_workout',  label: 'Pre-workout' },
  { value: 'post_workout', label: 'Post-workout' },
]

interface Props {
  date: string
  recentFoods: RecentFood[]
  defaultMeal?: string
}

export function AddFoodSheet({ date, recentFoods, defaultMeal = 'snack' }: Props) {
  const [open, setOpen] = useState(false)
  const [mealType, setMealType] = useState(defaultMeal)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function prefill(food: RecentFood) {
    if (!formRef.current) return
    const f = formRef.current
    ;(f.elements.namedItem('food_name') as HTMLInputElement).value = food.food_name_snapshot
    ;(f.elements.namedItem('calories') as HTMLInputElement).value = String(food.calories)
    ;(f.elements.namedItem('protein_g') as HTMLInputElement).value = String(food.protein_g)
    ;(f.elements.namedItem('carbs_g') as HTMLInputElement).value = String(food.carbs_g)
    ;(f.elements.namedItem('fat_g') as HTMLInputElement).value = String(food.fat_g)
    ;(f.elements.namedItem('quantity_grams') as HTMLInputElement).value = String(food.quantity_grams)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await logFood(formData)
      formRef.current?.reset()
      setMealType(defaultMeal)
      setOpen(false)
    })
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary shadow-raised text-primary-foreground transition-transform active:scale-95"
        aria-label="Add food"
      >
        <Plus className="size-6" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sheet */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border-t border-border bg-card shadow-raised transition-transform duration-300',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
        style={{ maxHeight: '92dvh' }}
      >
        {/* Handle */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
          <h2 className="text-base font-semibold">Add food</h2>
          <button onClick={() => setOpen(false)} className="rounded-full p-1 text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 pb-6">
          {/* Recent foods */}
          {recentFoods.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Zap className="size-3" /> Quick add
              </p>
              <div className="flex flex-wrap gap-2">
                {recentFoods.map((food) => (
                  <button
                    key={food.food_name_snapshot}
                    type="button"
                    onClick={() => prefill(food)}
                    className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                  >
                    {food.food_name_snapshot}
                    <span className="ml-1.5 opacity-60">{food.calories} cal</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="hidden" name="date" value={date} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="food_name">Food name</Label>
              <Input
                id="food_name"
                name="food_name"
                placeholder="e.g. Chicken breast"
                required
                className="h-11 text-base"
                autoComplete="off"
              />
            </div>

            {/* Meal type */}
            <div className="flex flex-col gap-1.5">
              <Label>Meal</Label>
              <input type="hidden" name="meal_type" value={mealType} />
              <div className="grid grid-cols-3 gap-2">
                {MEAL_TYPES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMealType(m.value)}
                    className={cn(
                      'rounded-xl border px-2 py-2 text-xs font-medium transition-colors',
                      mealType === m.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50',
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  placeholder="0"
                  required
                  className="tabular h-11 text-base"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="protein_g">Protein (g) *</Label>
                <Input
                  id="protein_g"
                  name="protein_g"
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="0"
                  required
                  className="tabular h-11 text-base"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="carbs_g">Carbs (g)</Label>
                <Input
                  id="carbs_g"
                  name="carbs_g"
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="0"
                  className="tabular h-11 text-base"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fat_g">Fat (g)</Label>
                <Input
                  id="fat_g"
                  name="fat_g"
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="0"
                  className="tabular h-11 text-base"
                />
              </div>
            </div>

            <input type="hidden" name="quantity_grams" value="100" />

            <Button type="submit" size="lg" className="h-11 w-full" disabled={isPending}>
              {isPending ? 'Saving…' : 'Add food'}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
