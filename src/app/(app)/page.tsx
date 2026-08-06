import Link from 'next/link'
import { getDashboardData } from '@/lib/queries/dashboard'
import { startSession } from '@/lib/actions/workout-sessions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const SPLIT_LABELS: Record<string, string> = {
  full_body: 'Full Body',
  upper_lower: 'Upper/Lower',
  push_pull_legs: 'Push/Pull/Legs',
  bro_split: 'Bro Split',
  custom: 'Custom',
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDuration(s: number | null) {
  if (!s) return null
  const m = Math.floor(s / 60)
  return `${m}m`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default async function DashboardPage() {
  const { activeSession, activePlan, recentSessions, weeklyCount } = await getDashboardData()

  return (
    <div className="px-4 pb-8 pt-10 max-w-lg mx-auto flex flex-col gap-5">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">{greeting()}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {weeklyCount === 0
            ? 'No workouts yet this week — let\'s go!'
            : `${weeklyCount} workout${weeklyCount !== 1 ? 's' : ''} completed this week`}
        </p>
      </div>

      {/* Resume active session banner */}
      {activeSession && (
        <Link href={`/workout/session/${activeSession.id}`} className="block">
          <div className="rounded-2xl bg-primary text-primary-foreground p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium opacity-75 uppercase tracking-wide">In Progress</p>
              <p className="font-semibold mt-0.5">{activeSession.plan_day_name_snapshot ?? 'Workout'}</p>
            </div>
            <span className="text-primary-foreground/80 text-lg">▶</span>
          </div>
        </Link>
      )}

      {/* Active plan */}
      {activePlan ? (
        <div className="rounded-2xl border bg-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Active Plan</p>
              <Link href={`/workout/plans/${activePlan.id}`} className="font-semibold hover:underline">
                {activePlan.name}
              </Link>
            </div>
            <Badge variant="secondary">{SPLIT_LABELS[activePlan.split_type] ?? activePlan.split_type}</Badge>
          </div>

          {activePlan.days.length === 0 ? (
            <p className="text-sm text-muted-foreground">No days added yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {activePlan.days.map((day) => (
                <div key={day.id} className="flex items-center justify-between gap-2 py-1 border-t first:border-t-0">
                  <div>
                    <p className="text-sm font-medium">{day.name}</p>
                    <p className="text-xs text-muted-foreground">{day.exercise_count} exercise{day.exercise_count !== 1 ? 's' : ''}</p>
                  </div>
                  <form action={startSession.bind(null, activePlan.id, day.id, day.name)}>
                    <Button size="sm" type="submit" variant="outline">Start</Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-6 flex flex-col items-center gap-3 text-center">
          <p className="text-muted-foreground text-sm">No active plan yet</p>
          <Link href="/workout">
            <Button size="sm">Set up a plan</Button>
          </Link>
        </div>
      )}

      {/* Recent workouts */}
      {recentSessions.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Recent Workouts</p>
            <Link href="/workout/history" className="text-xs text-primary hover:underline">See all</Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              <Link key={s.id} href={`/workout/session/${s.id}`} className="block">
                <div className="rounded-xl border bg-card px-4 py-3 flex items-center justify-between gap-2 hover:bg-muted/40 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{s.plan_day_name_snapshot ?? 'Workout'}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.started_at)} · {s.exercise_count} exercise{s.exercise_count !== 1 ? 's' : ''}
                      {formatDuration(s.duration_seconds) ? ` · ${formatDuration(s.duration_seconds)}` : ''}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state when nothing */}
      {recentSessions.length === 0 && !activePlan && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
          <p className="text-4xl">💪</p>
          <p className="font-semibold">Ready to start?</p>
          <p className="text-sm text-muted-foreground">Create a workout plan to get going.</p>
        </div>
      )}
    </div>
  )
}
