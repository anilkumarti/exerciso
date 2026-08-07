import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarPlus, Play, Plus, Trash2, X } from 'lucide-react'
import { getWorkoutPlan } from '@/lib/queries/workout-plans'
import {
  setActivePlan,
  deletePlan,
  createDay,
  deleteDay,
  removeExerciseFromDay,
} from '@/lib/actions/workout-plans'
import { startSession } from '@/lib/actions/workout-sessions'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageShell, PageHeader } from '@/components/shared/page-shell'
import { ConfirmAction } from '@/components/shared/confirm-action'

const SPLIT_LABELS: Record<string, string> = {
  full_body: 'Full Body',
  upper_lower: 'Upper/Lower',
  push_pull_legs: 'Push/Pull/Legs',
  bro_split: 'Bro Split',
  custom: 'Custom',
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [plan, supabase] = await Promise.all([getWorkoutPlan(id), getSupabaseServerClient()])
  if (!plan) notFound()

  const { count: activeCount } = await supabase
    .from('workout_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'in_progress')
  const hasActiveSession = (activeCount ?? 0) > 0

  const createDayWithPlan = createDay.bind(null, id)

  return (
    <PageShell>
      <PageHeader title={plan.name} backHref="/workout" />

      {/* Meta badges */}
      <div className="-mt-3 mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {SPLIT_LABELS[plan.split_type] ?? plan.split_type}
        </span>
        {plan.is_active && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            Active
          </span>
        )}
      </div>

      {plan.description && (
        <p className="mb-5 text-sm text-muted-foreground">{plan.description}</p>
      )}

      {/* Plan-level actions */}
      <div className="mb-6 flex items-center gap-2">
        {!plan.is_active && (
          <form action={setActivePlan.bind(null, id)} className="flex-1">
            <Button size="sm" type="submit" className="w-full">
              Set as active
            </Button>
          </form>
        )}
        <ConfirmAction
          action={deletePlan.bind(null, id)}
          message="Delete this plan? All training days and exercises will be permanently removed."
        >
          <Button
            size="sm"
            variant="ghost"
            type="submit"
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Delete plan
          </Button>
        </ConfirmAction>
      </div>

      {/* Days */}
      <div className="flex flex-col gap-3">
        {plan.days.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No days yet — add your first training day below.
          </p>
        )}

        {plan.days.map((day) => (
          <div key={day.id} className="surface overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
              <h2 className="min-w-0 truncate font-semibold">{day.name}</h2>
              <div className="flex shrink-0 items-center gap-1.5">
                {hasActiveSession ? (
                  <ConfirmAction
                    action={startSession.bind(null, id, day.id, day.name)}
                    message="You have a workout in progress. Starting a new one will abandon the current session. Continue?"
                  >
                    <Button size="sm" type="submit" className="gap-1">
                      <Play className="size-3 fill-current" />
                      Start
                    </Button>
                  </ConfirmAction>
                ) : (
                  <form action={startSession.bind(null, id, day.id, day.name)}>
                    <Button size="sm" type="submit" className="gap-1">
                      <Play className="size-3 fill-current" />
                      Start
                    </Button>
                  </form>
                )}
                <ConfirmAction
                  action={deleteDay.bind(null, day.id, id)}
                  message={`Delete "${day.name}"? All exercises in this day will be removed.`}
                >
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    type="submit"
                    aria-label={`Delete ${day.name}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </ConfirmAction>
              </div>
            </div>

            {day.exercises.length === 0 ? (
              <p className="px-4 py-4 text-center text-xs text-muted-foreground">
                No exercises yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {day.exercises.map((ex, i) => (
                  <li key={ex.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="tabular w-5 shrink-0 text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {ex.exercise?.name ?? '—'}
                      </p>
                      <p className="tabular text-xs text-muted-foreground">
                        {ex.target_sets} × {ex.target_reps} · {ex.rest_seconds}s rest
                      </p>
                    </div>
                    <ConfirmAction
                      action={removeExerciseFromDay.bind(null, ex.id, id)}
                      message={`Remove "${ex.exercise?.name ?? 'this exercise'}" from the day?`}
                    >
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        type="submit"
                        aria-label="Remove exercise"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </ConfirmAction>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-border bg-muted/40 px-3 py-2">
              <Link href={`/workout/plans/${id}/days/${day.id}/add`}>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <Plus className="size-3.5" />
                  Add exercise
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add day */}
      <div className="mt-4 rounded-2xl border border-dashed border-border p-4">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-medium">
          <CalendarPlus className="size-4 text-muted-foreground" />
          Add training day
        </p>
        <form action={createDayWithPlan} className="flex gap-2">
          <Input
            name="name"
            placeholder="e.g. Push Day"
            required
            className="h-9 flex-1"
          />
          <Button type="submit" size="sm">
            Add
          </Button>
        </form>
      </div>
    </PageShell>
  )
}
