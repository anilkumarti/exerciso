'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Plus, Search, X, Zap } from 'lucide-react'
import { logFood } from '@/lib/actions/nutrition'
import { searchFoods, type FoodItem, type DietPref } from '@/data/food-database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { RecentFood } from '@/lib/queries/nutrition'

const MEAL_TYPES = [
  { value: 'breakfast',      label: 'Breakfast',      emoji: '🌅', time: '6 – 10 AM'  },
  { value: 'morning_snack',  label: 'Morning Snack',  emoji: '🍎', time: '10 AM – 12' },
  { value: 'lunch',          label: 'Lunch',          emoji: '☀️', time: '12 – 3 PM'  },
  { value: 'evening_snack',  label: 'Evening Snack',  emoji: '🫖', time: '3 – 6 PM'   },
  { value: 'dinner',         label: 'Dinner',         emoji: '🌙', time: '7 – 10 PM'  },
  { value: 'supper',         label: 'Supper',         emoji: '🌃', time: '9 PM+'       },
  { value: 'pre_workout',    label: 'Pre-workout',    emoji: '💪', time: 'Before gym'  },
  { value: 'post_workout',   label: 'Post-workout',   emoji: '🥗', time: 'After gym'   },
]

function getMealByTime(): string {
  const h = new Date().getHours()
  if (h >= 6  && h < 10) return 'breakfast'
  if (h >= 10 && h < 12) return 'morning_snack'
  if (h >= 12 && h < 15) return 'lunch'
  if (h >= 15 && h < 19) return 'evening_snack'
  if (h >= 19 && h < 22) return 'dinner'
  return 'supper'
}

interface Props {
  date: string
  recentFoods: RecentFood[]
  dietPref?: DietPref
}

export function AddFoodSheet({ date, recentFoods, dietPref = 'non_veg' }: Props) {
  const [open, setOpen] = useState(false)
  const [mealType, setMealType] = useState('breakfast')
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setMealType(getMealByTime())
  }, [])

  const searchResults = searchQuery.length >= 2 ? searchFoods(searchQuery, dietPref) : []

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

  function prefillFromDb(food: FoodItem) {
    if (!formRef.current) return
    const f = formRef.current
    ;(f.elements.namedItem('food_name') as HTMLInputElement).value = food.name
    ;(f.elements.namedItem('calories') as HTMLInputElement).value = String(food.calories)
    ;(f.elements.namedItem('protein_g') as HTMLInputElement).value = String(food.protein_g)
    ;(f.elements.namedItem('carbs_g') as HTMLInputElement).value = String(food.carbs_g)
    ;(f.elements.namedItem('fat_g') as HTMLInputElement).value = String(food.fat_g)
    ;(f.elements.namedItem('quantity_grams') as HTMLInputElement).value = String(food.serving_g)
    setSearchQuery('')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await logFood(formData)
      formRef.current?.reset()
      setMealType(getMealByTime())
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
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
          <h2 className="text-base font-semibold">Add food</h2>
          <button onClick={() => setOpen(false)} className="rounded-full p-1 text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 pb-6">
          {/* Food search */}
          <div className="mb-4">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search Indian foods…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-muted pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background"
              />
            </div>

            {searchQuery.length >= 2 ? (
              searchResults.length > 0 ? (
                <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
                  {searchResults.map(food => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => prefillFromDb(food)}
                      className="flex items-center justify-between gap-3 bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.serving_label}</p>
                      </div>
                      <div className="tabular shrink-0 text-right text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground">{food.calories} cal</p>
                        <p>{food.protein_g}g protein</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-3 text-center text-sm text-muted-foreground">No foods found for &ldquo;{searchQuery}&rdquo;</p>
              )
            ) : (
              recentFoods.length > 0 && (
                <>
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
                </>
              )
            )}
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="hidden" name="date" value={date} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="food_name">Food name</Label>
              <Input
                id="food_name"
                name="food_name"
                placeholder="e.g. Dal chawal"
                required
                className="h-11 text-base"
                autoComplete="off"
              />
            </div>

            {/* Meal type */}
            <div className="flex flex-col gap-1.5">
              <Label>Meal</Label>
              <input type="hidden" name="meal_type" value={mealType} />
              <div className="grid grid-cols-2 gap-2">
                {MEAL_TYPES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMealType(m.value)}
                    className={cn(
                      'flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors',
                      mealType === m.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/40',
                    )}
                  >
                    <span className={cn(
                      'text-xs font-semibold',
                      mealType === m.value ? 'text-primary' : 'text-foreground',
                    )}>
                      {m.emoji} {m.label}
                    </span>
                    <span className="mt-0.5 text-[10px] text-muted-foreground">{m.time}</span>
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
