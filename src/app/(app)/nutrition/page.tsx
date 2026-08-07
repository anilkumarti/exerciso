import Link from 'next/link'
import { cookies } from 'next/headers'
import { Moon, Trash2, UtensilsCrossed } from 'lucide-react'
import { getTodayLog, getRecentFoods, getTargetsForGoal, getWeeklyHistory } from '@/lib/queries/nutrition'
import { getProfile } from '@/lib/queries/profile'
import { deleteFood } from '@/lib/actions/nutrition'
import { suggestMeals } from '@/data/food-database'
import { MacroBar } from '@/components/nutrition/macro-bar'
import { AddFoodSheet } from '@/components/nutrition/add-food-sheet'
import { DayModeToggle } from '@/components/nutrition/day-mode-toggle'
import { MealSuggestions } from '@/components/nutrition/meal-suggestions'
import { SavedMealsSection } from '@/components/nutrition/saved-meals-section'
import { SaveMealButton } from '@/components/nutrition/save-meal-button'
import { SectionHeader } from '@/components/shared/page-shell'

const MEAL_LABELS: Record<string, string> = {
  breakfast:    'Breakfast',
  lunch:        'Lunch',
  dinner:       'Dinner',
  snack:        'Snack',
  pre_workout:  'Pre-workout',
  post_workout: 'Post-workout',
}

const MEAL_ORDER = ['breakfast', 'pre_workout', 'lunch', 'dinner', 'post_workout', 'snack']

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

export default async function NutritionPage() {
  const today = todayString()
  const cookieStore = await cookies()
  const dayMode = (cookieStore.get('nutrition_day_mode')?.value as 'rest' | 'training') ?? 'training'

  const [log, recentFoods, profile, weeklyDays] = await Promise.all([
    getTodayLog(today),
    getRecentFoods(10),
    getProfile(),
    getWeeklyHistory(),
  ])

  const baseTargets = getTargetsForGoal(profile?.fitness_goal ?? 'maintain')
  const targets = dayMode === 'rest'
    ? { ...baseTargets, calories: Math.round(baseTargets.calories * 0.85) }
    : baseTargets

  // Protein streak: consecutive days from today (most-recent first) where logged and protein ≥ target
  let streak = 0
  for (const day of [...weeklyDays].reverse()) {
    if (day.entries_count > 0 && day.protein_g >= targets.protein_g) {
      streak++
    } else if (day.entries_count > 0) {
      break
    }
  }

  const entries = log?.entries ?? []
  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein_g: acc.protein_g + e.protein_g,
      carbs_g: acc.carbs_g + e.carbs_g,
      fat_g: acc.fat_g + e.fat_g,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  )

  const eaten = Math.round(totals.calories)
  const remaining = Math.max(0, targets.calories - eaten)
  const remainingProtein = Math.max(0, targets.protein_g - totals.protein_g)
  const over = eaten > targets.calories

  const mealSuggestions = !over && remaining >= 300
    ? suggestMeals(remaining, remainingProtein)
    : []

  const grouped = MEAL_ORDER.reduce<Record<string, typeof entries>>((acc, meal) => {
    const items = entries.filter(e => e.meal_type === meal)
    if (items.length) acc[meal] = items
    return acc
  }, {})

  return (
    <div className="mx-auto w-full max-w-lg pb-28">
      {/* Header */}
      <div className="px-4 pt-8 pb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{formatDate(today)}</p>
          <h1 className="mt-0.5 text-[1.75rem] leading-tight font-bold">Nutrition</h1>
          <div className="mt-2.5 flex items-center gap-2">
            <DayModeToggle mode={dayMode} />
            {streak >= 2 && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                🔥 {streak}-day streak
              </span>
            )}
          </div>
        </div>
        <Link
          href="/nutrition/history"
          className="mt-9 text-xs font-medium text-primary hover:underline"
        >
          This week →
        </Link>
      </div>

      {/* Calorie hero */}
      <div className="mx-4 mb-4 rounded-2xl bg-brand-gradient p-5 text-white shadow-hero">
        {dayMode === 'rest' && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
            <Moon className="size-3" /> Rest day target
          </div>
        )}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase opacity-80">
              {over ? 'Over target' : 'Remaining'}
            </p>
            <p className="tabular mt-1 text-5xl leading-none font-bold">
              {over ? `+${eaten - targets.calories}` : remaining}
            </p>
            <p className="mt-1 text-sm opacity-80">calories</p>
          </div>
          <div className="text-right text-sm space-y-0.5">
            <p className="opacity-80"><span className="font-semibold text-white">{eaten}</span> eaten</p>
            <p className="opacity-80"><span className="font-semibold text-white">{targets.calories}</span> target</p>
          </div>
        </div>
      </div>

      {/* Macro bars */}
      <div className="mx-4 mb-6 surface p-4 flex flex-col gap-4">
        <MacroBar label="Protein" current={totals.protein_g} target={targets.protein_g} color="green" hero />
        <div className="border-t border-border" />
        <MacroBar label="Carbs" current={totals.carbs_g} target={targets.carbs_g} color="amber" />
        <MacroBar label="Fat"   current={totals.fat_g}   target={targets.fat_g}   color="red" />
      </div>

      {/* Meal suggestions (shown when calories remaining ≥ 300) */}
      {mealSuggestions.length > 0 && (
        <MealSuggestions
          suggestions={mealSuggestions}
          remainingCal={remaining}
          remainingProtein={remainingProtein}
          date={today}
        />
      )}

      {/* Saved meals (renders client-side from localStorage) */}
      <SavedMealsSection date={today} />

      {/* Food log */}
      <div className="px-4 flex flex-col gap-5">
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UtensilsCrossed className="size-7" />
            </div>
            <p className="font-semibold">Nothing logged yet</p>
            <p className="mx-auto max-w-xs text-sm text-muted-foreground">
              Tap the + button to log your first meal.
            </p>
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([meal, items]) => {
              const mealCal  = Math.round(items.reduce((s, e) => s + e.calories,  0))
              const mealProt = Math.round(items.reduce((s, e) => s + e.protein_g, 0))
              return (
                <section key={meal}>
                  <SectionHeader title={MEAL_LABELS[meal] ?? meal} />
                  <div className="surface overflow-hidden divide-y divide-border">
                    {items.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{entry.food_name_snapshot}</p>
                          <p className="mt-0.5 tabular text-xs text-muted-foreground">
                            {Math.round(entry.calories)} cal
                            {entry.protein_g > 0 && <> · {Math.round(entry.protein_g)}g protein</>}
                            {entry.carbs_g > 0 && <> · {Math.round(entry.carbs_g)}g carbs</>}
                            {entry.fat_g > 0 && <> · {Math.round(entry.fat_g)}g fat</>}
                          </p>
                        </div>
                        <form action={deleteFood.bind(null, entry.id)}>
                          <button
                            type="submit"
                            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            aria-label={`Delete ${entry.food_name_snapshot}`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </form>
                      </div>
                    ))}
                    <div className="flex items-center justify-between bg-muted/40 px-4 py-2">
                      <span className="text-xs text-muted-foreground">Subtotal</span>
                      <span className="tabular text-xs font-semibold">
                        {mealCal} cal · {mealProt}g protein
                      </span>
                    </div>
                  </div>
                </section>
              )
            })}
            <div className="flex justify-center pt-1 pb-2">
              <SaveMealButton entries={entries} />
            </div>
          </>
        )}
      </div>

      <AddFoodSheet date={today} recentFoods={recentFoods} />
    </div>
  )
}
