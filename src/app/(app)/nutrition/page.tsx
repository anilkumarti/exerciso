import Link from 'next/link'
import { Trash2, UtensilsCrossed } from 'lucide-react'
import { getTodayLog, getRecentFoods, getTargetsForGoal } from '@/lib/queries/nutrition'
import { getProfile } from '@/lib/queries/profile'
import { deleteFood } from '@/lib/actions/nutrition'
import { MacroBar } from '@/components/nutrition/macro-bar'
import { AddFoodSheet } from '@/components/nutrition/add-food-sheet'
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
  const [log, recentFoods, profile] = await Promise.all([
    getTodayLog(today),
    getRecentFoods(10),
    getProfile(),
  ])

  const targets = getTargetsForGoal(profile?.fitness_goal ?? 'maintain')
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
  const over = eaten > targets.calories

  const grouped = MEAL_ORDER.reduce<Record<string, typeof entries>>((acc, meal) => {
    const items = entries.filter(e => e.meal_type === meal)
    if (items.length) acc[meal] = items
    return acc
  }, {})

  return (
    <div className="mx-auto w-full max-w-lg pb-28">
      {/* Header */}
      <div className="px-4 pt-8 pb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{formatDate(today)}</p>
          <h1 className="mt-0.5 text-[1.75rem] leading-tight font-bold">Nutrition</h1>
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
          Object.entries(grouped).map(([meal, items]) => {
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
          })
        )}
      </div>

      <AddFoodSheet date={today} recentFoods={recentFoods} />
    </div>
  )
}
