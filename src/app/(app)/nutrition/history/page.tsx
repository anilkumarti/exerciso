import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getWeeklyHistory, getLatestWeight } from '@/lib/queries/nutrition'
import { getProfile } from '@/lib/queries/profile'
import { calculateTargets } from '@/lib/tdee'
import { PageShell, PageHeader } from '@/components/shared/page-shell'
import { MacroBar } from '@/components/nutrition/macro-bar'

function formatDay(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

export default async function NutritionHistoryPage() {
  const [days, profile, latestWeightKg] = await Promise.all([getWeeklyHistory(), getProfile(), getLatestWeight()])
  const { targets } = calculateTargets(
    profile ?? { id: '', display_name: null, date_of_birth: null, weight_unit: 'kg', height_unit: 'cm', height_cm: null, goal_weight_kg: null, activity_level: 'moderately_active', fitness_goal: 'maintain', onboarding_done: false },
    latestWeightKg,
  )

  const daysWithData = days.filter(d => d.entries_count > 0)
  const avgCalories = daysWithData.length
    ? Math.round(daysWithData.reduce((s, d) => s + d.calories, 0) / daysWithData.length)
    : 0
  const avgProtein = daysWithData.length
    ? Math.round(daysWithData.reduce((s, d) => s + d.protein_g, 0) / daysWithData.length)
    : 0

  return (
    <PageShell>
      <PageHeader title="This week" backHref="/nutrition" />

      {/* 7-day averages */}
      {daysWithData.length > 0 && (
        <div className="mb-6 surface p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {daysWithData.length}-day average
          </p>
          <MacroBar label="Calories" current={avgCalories} target={targets.calories} unit="" color="violet" hero />
          <MacroBar label="Protein"  current={avgProtein}  target={targets.protein_g}  color="green" />
        </div>
      )}

      {/* Day list */}
      <div className="flex flex-col gap-3">
        {days.map((day) => {
          const calPct = Math.min(100, targets.calories > 0 ? (day.calories / targets.calories) * 100 : 0)
          const hitTarget = day.calories >= targets.calories * 0.9 && day.calories <= targets.calories * 1.1
          return (
            <Link key={day.date} href="/nutrition">
              <div className="surface overflow-hidden transition-colors hover:bg-muted/40">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{formatDay(day.date)}</p>
                    {day.entries_count > 0 ? (
                      <p className="tabular mt-0.5 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{day.calories}</span> cal
                        {' · '}
                        <span className={day.protein_g >= targets.protein_g ? 'font-semibold text-green-600 dark:text-green-400' : ''}>
                          {day.protein_g}g
                        </span>
                        {' protein'}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-muted-foreground">Not logged</p>
                    )}
                  </div>
                  {day.entries_count > 0 && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          hitTarget
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : day.calories > targets.calories * 1.1
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {hitTarget ? 'On track' : day.calories > targets.calories * 1.1 ? 'Over' : 'Under'}
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {day.entries_count > 0 && (
                  <div className="h-1.5 bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${calPct}%` }}
                    />
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </PageShell>
  )
}
