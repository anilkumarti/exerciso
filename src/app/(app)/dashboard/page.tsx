import Link from 'next/link'
import {
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Flame,
  Play,
  Settings,
  Timer,
} from 'lucide-react'
import { getDashboardData } from '@/lib/queries/dashboard'
import { getProfile } from '@/lib/queries/profile'
import { startSession } from '@/lib/actions/workout-sessions'
import { Button } from '@/components/ui/button'
import {
  EmptyState,
  PageShell,
  SectionHeader,
  StatTile,
} from '@/components/shared/page-shell'

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
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default async function DashboardPage() {
  const [{ activeSession, activePlan, recentSessions, weeklyCount }, profile] =
    await Promise.all([getDashboardData(), getProfile()])

  const firstName = profile?.display_name?.split(' ')[0] ?? null
  const totalDays = activePlan?.days.length ?? 0

  return (
    <PageShell>
      {/* Greeting */}
      <header className="flex items-start justify-between gap-3 pt-8 pb-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {greeting()}
          </p>
          <h1 className="mt-0.5 truncate text-[1.75rem] leading-tight font-bold">
            {firstName ?? 'Welcome back'}
          </h1>
        </div>
        <Link
          href="/settings/profile"
          aria-label="Settings"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors hover:text-foreground"
        >
          <Settings className="size-[1.15rem]" />
        </Link>
      </header>

      {/* Resume active session — highest priority action */}
      {activeSession && (
        <Link href={`/workout/session/${activeSession.id}`} className="mb-5 block">
          <div className="bg-brand-gradient shadow-hero flex items-center gap-4 rounded-2xl p-4 text-white transition-transform active:scale-[0.99]">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Play className="size-5 fill-current" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase opacity-90">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                </span>
                In progress
              </p>
              <p className="mt-0.5 truncate font-semibold">
                {activeSession.plan_day_name_snapshot ?? 'Workout'}
              </p>
            </div>
            <ChevronRight className="size-5 shrink-0 opacity-80" />
          </div>
        </Link>
      )}

      {/* Weekly stats */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatTile
          label="This week"
          value={weeklyCount}
          hint={weeklyCount === 1 ? 'workout done' : 'workouts done'}
          icon={Flame}
        />
        <StatTile
          label="Plan days"
          value={totalDays}
          hint={activePlan ? activePlan.name : 'No active plan'}
          icon={CalendarDays}
        />
      </div>

      {/* Active plan */}
      <section className="mb-6">
        <SectionHeader
          title="Active plan"
          href={activePlan ? `/workout/plans/${activePlan.id}` : undefined}
          linkLabel="Manage"
        />

        {activePlan ? (
          <div className="surface overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{activePlan.name}</p>
                <p className="text-xs text-muted-foreground">
                  {SPLIT_LABELS[activePlan.split_type] ?? activePlan.split_type}
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                Active
              </span>
            </div>

            {activePlan.days.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No training days yet.
                </p>
                <Link href={`/workout/plans/${activePlan.id}`}>
                  <Button size="sm" variant="outline" className="mt-3">
                    Add a day
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {activePlan.days.map((day) => (
                  <li
                    key={day.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Dumbbell className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {day.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {day.exercise_count}{' '}
                          {day.exercise_count === 1 ? 'exercise' : 'exercises'}
                        </p>
                      </div>
                    </div>
                    <form
                      action={startSession.bind(
                        null,
                        activePlan.id,
                        day.id,
                        day.name
                      )}
                    >
                      <Button size="sm" type="submit" className="gap-1">
                        <Play className="size-3 fill-current" />
                        Start
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <EmptyState
            icon={Dumbbell}
            title="No active plan"
            description="Create a training plan to start tracking your workouts."
            action={
              <Link href="/workout/plans/new">
                <Button size="sm">Create a plan</Button>
              </Link>
            }
          />
        )}
      </section>

      {/* Recent workouts */}
      {recentSessions.length > 0 && (
        <section>
          <SectionHeader title="Recent workouts" href="/workout/history" />
          <ul className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              <li key={s.id}>
                <Link href={`/workout/session/${s.id}`} className="block">
                  <div className="surface flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success/10 text-[var(--success)]">
                      <Dumbbell className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {s.plan_day_name_snapshot ?? 'Workout'}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatDate(s.started_at)}</span>
                        <span aria-hidden>·</span>
                        <span>{s.exercise_count} ex</span>
                        {formatDuration(s.duration_seconds) && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="inline-flex items-center gap-1">
                              <Timer className="size-3" />
                              {formatDuration(s.duration_seconds)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  )
}
