import Link from 'next/link'
import { ChevronRight, Dumbbell, History, Timer } from 'lucide-react'
import { getSessionHistory } from '@/lib/queries/workout-sessions'
import { Button } from '@/components/ui/button'
import { EmptyState, PageShell, PageHeader } from '@/components/shared/page-shell'

function formatDuration(seconds: number | null) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  return `${m}m`
}

function formatStatus(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/** Groups sessions under "This week" / "Earlier" for easier scanning. */
function bucketOf(iso: string) {
  const d = new Date(iso)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return d >= weekAgo ? 'This week' : 'Earlier'
}

export default async function HistoryPage() {
  const sessions = await getSessionHistory()

  const groups = sessions.reduce<Record<string, typeof sessions>>((acc, s) => {
    const key = bucketOf(s.started_at)
    ;(acc[key] ??= []).push(s)
    return acc
  }, {})

  return (
    <PageShell>
      <PageHeader
        title="History"
        subtitle={
          sessions.length > 0
            ? `${sessions.length} ${sessions.length === 1 ? 'workout' : 'workouts'} logged`
            : undefined
        }
        backHref="/workout"
      />

      {sessions.length === 0 && (
        <EmptyState
          icon={History}
          title="No workouts yet"
          description="Completed workouts will appear here."
          action={
            <Link href="/workout">
              <Button size="sm">Go to plans</Button>
            </Link>
          }
        />
      )}

      {Object.entries(groups).map(([label, items]) => (
        <section key={label} className="mb-6">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <ul className="flex flex-col gap-2">
            {items.map((s) => {
              const completed = s.status === 'completed'
              return (
                <li key={s.id}>
                  <Link href={`/workout/session/${s.id}`} className="block">
                    <div className="surface flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                          completed
                            ? 'bg-success/10 text-[var(--success)]'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Dumbbell className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {s.plan_day_name_snapshot ?? 'Workout'}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                          <span>{formatDate(s.started_at)}</span>
                          <span aria-hidden>·</span>
                          <span>
                            {s.exercise_count}{' '}
                            {s.exercise_count === 1 ? 'exercise' : 'exercises'}
                          </span>
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
                      {!completed && (
                        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {formatStatus(s.status)}
                        </span>
                      )}
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </PageShell>
  )
}
