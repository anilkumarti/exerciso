import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, CircleCheck, Dumbbell, Timer } from 'lucide-react'
import { getSession } from '@/lib/queries/workout-sessions'
import {
  logSet,
  finishSession,
  abandonSession,
} from '@/lib/actions/workout-sessions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageShell } from '@/components/shared/page-shell'
import { ConfirmAction } from '@/components/shared/confirm-action'
import { SessionTimer } from '@/components/workout/session-timer'

function formatStatus(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession(id)
  if (!session) notFound()

  const isActive = session.status === 'in_progress'
  const totalSets = session.exercises.reduce((n, ex) => n + ex.sets.length, 0)

  return (
    <PageShell>
      {/* Hero header — gradient while live, plain once finished */}
      <div
        className={`mt-6 mb-5 rounded-2xl p-5 ${
          isActive
            ? 'bg-brand-gradient shadow-hero text-white'
            : 'surface'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase ${
                isActive ? 'opacity-90' : 'text-muted-foreground'
              }`}
            >
              {isActive ? (
                <>
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                  </span>
                  In progress
                </>
              ) : (
                <>
                  <CircleCheck className="size-3.5" />
                  {formatStatus(session.status)}
                </>
              )}
            </p>
            <h1 className="mt-1 truncate text-2xl leading-tight font-bold">
              {session.plan_day_name_snapshot ?? 'Workout'}
            </h1>
          </div>
        </div>

        <div
          className={`mt-4 flex items-center gap-5 text-sm ${
            isActive ? 'text-white/90' : 'text-muted-foreground'
          }`}
        >
          {isActive ? (
            <SessionTimer startedAt={session.started_at} />
          ) : (
            <span className="tabular inline-flex items-center gap-1.5">
              <Timer className="size-4" />
              {session.duration_seconds
                ? formatDuration(session.duration_seconds)
                : '—'}
            </span>
          )}
          <span className="tabular inline-flex items-center gap-1.5">
            <Dumbbell className="size-4" />
            {session.exercises.length} exercises
          </span>
          <span className="tabular inline-flex items-center gap-1.5">
            <Check className="size-4" />
            {totalSets} sets
          </span>
        </div>

        {isActive && (
          <div className="mt-4 flex gap-2">
            <form
              action={finishSession.bind(null, id, session.started_at)}
              className="flex-1"
            >
              <Button
                type="submit"
                className="w-full bg-white text-[color:var(--grad-from)] hover:bg-white/90"
              >
                Finish workout
              </Button>
            </form>
            <ConfirmAction
              action={abandonSession.bind(null, id)}
              message="Abandon this workout? All logged sets will be saved but the session won't count as completed."
            >
              <Button
                type="submit"
                variant="ghost"
                className="text-white/80 hover:bg-white/15 hover:text-white"
              >
                Abandon
              </Button>
            </ConfirmAction>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="flex flex-col gap-3">
        {session.exercises.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No exercises in this session.
          </p>
        )}

        {session.exercises.map((ex) => {
          const nextSetNumber = ex.sets.length + 1
          const logSetAction = logSet.bind(null, ex.id, id, nextSetNumber)

          return (
            <div key={ex.id} className="surface overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <p className="min-w-0 truncate font-semibold">
                  {ex.exercise_name_snapshot}
                </p>
                {ex.sets.length > 0 && (
                  <span className="tabular shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-[var(--success)]">
                    {ex.sets.length} {ex.sets.length === 1 ? 'set' : 'sets'}
                  </span>
                )}
              </div>

              {/* Logged sets */}
              {ex.sets.length > 0 && (
                <div className="border-t border-border">
                  <div className="grid grid-cols-3 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                    <span>Set</span>
                    <span>Weight</span>
                    <span>Reps</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {ex.sets.map((s) => (
                      <li
                        key={s.id}
                        className="tabular grid grid-cols-3 px-4 py-2 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {s.set_number}
                        </span>
                        <span className="font-medium">
                          {s.weight_kg != null ? `${s.weight_kg} kg` : '—'}
                        </span>
                        <span className="font-medium">{s.reps ?? '—'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Log next set */}
              {isActive && !ex.was_skipped && (
                <form
                  // Remount after each logged set so the inputs clear
                  key={nextSetNumber}
                  action={logSetAction}
                  className="flex items-end gap-2 border-t border-border bg-muted/40 px-3 py-3"
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Weight (kg)
                    </label>
                    <Input
                      name="weight_kg"
                      type="number"
                      step="0.5"
                      min="0"
                      inputMode="decimal"
                      placeholder="0"
                      className="tabular h-10 bg-card text-base"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Reps
                    </label>
                    <Input
                      name="reps"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      placeholder="0"
                      className="tabular h-10 bg-card text-base"
                    />
                  </div>
                  <Button type="submit" className="h-10 shrink-0 px-4">
                    Log {nextSetNumber}
                  </Button>
                </form>
              )}
            </div>
          )
        })}
      </div>

      {!isActive && (
        <div className="mt-6 text-center">
          <Link
            href="/workout/history"
            className="text-sm font-medium text-primary hover:underline"
          >
            View history →
          </Link>
        </div>
      )}
    </PageShell>
  )
}
