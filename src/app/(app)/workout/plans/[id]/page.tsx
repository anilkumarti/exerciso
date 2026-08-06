import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWorkoutPlan } from '@/lib/queries/workout-plans'
import { setActivePlan, deletePlan, createDay, deleteDay, removeExerciseFromDay } from '@/lib/actions/workout-plans'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const SPLIT_LABELS: Record<string, string> = {
  full_body: 'Full Body',
  upper_lower: 'Upper/Lower',
  push_pull_legs: 'Push/Pull/Legs',
  bro_split: 'Bro Split',
  custom: 'Custom',
}

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plan = await getWorkoutPlan(id)
  if (!plan) notFound()

  const createDayWithPlan = createDay.bind(null, id)

  return (
    <div className="px-4 pb-6 pt-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Link href="/workout" className="text-muted-foreground hover:text-foreground shrink-0">
          ← Back
        </Link>
      </div>

      <div className="flex items-start justify-between gap-2 mt-3 mb-1">
        <div>
          <h1 className="text-2xl font-bold leading-tight">{plan.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="secondary">{SPLIT_LABELS[plan.split_type] ?? plan.split_type}</Badge>
            {plan.is_active && <Badge variant="default">Active</Badge>}
          </div>
        </div>
      </div>

      {plan.description && (
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
      )}

      <div className="flex gap-2 mb-6">
        {!plan.is_active && (
          <form action={setActivePlan.bind(null, id)}>
            <Button size="sm" type="submit">Set as Active</Button>
          </form>
        )}
        <form action={deletePlan.bind(null, id)}>
          <Button size="sm" variant="ghost" type="submit" className="text-destructive hover:text-destructive">
            Delete Plan
          </Button>
        </form>
      </div>

      {/* Days */}
      <div className="flex flex-col gap-4">
        {plan.days.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No days yet — add your first training day below.</p>
        )}

        {plan.days.map((day) => {
          const removeFn = removeExerciseFromDay
          return (
            <div key={day.id} className="rounded-2xl border bg-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{day.name}</h2>
                <div className="flex items-center gap-1">
                  <Link href={`/workout/plans/${id}/days/${day.id}/add`}>
                    <Button size="sm" variant="outline">+ Exercise</Button>
                  </Link>
                  <form action={deleteDay.bind(null, day.id, id)}>
                    <Button size="sm" variant="ghost" type="submit" className="text-destructive hover:text-destructive px-2">✕</Button>
                  </form>
                </div>
              </div>

              {day.exercises.length === 0 && (
                <p className="text-xs text-muted-foreground">No exercises yet.</p>
              )}

              {day.exercises.map((ex, i) => (
                <div key={ex.id} className="flex items-center gap-3 py-1.5 border-t first:border-t-0">
                  <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ex.exercise?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">
                      {ex.target_sets} × {ex.target_reps} · {ex.rest_seconds}s rest
                    </p>
                  </div>
                  <form action={removeFn.bind(null, ex.id, id)}>
                    <button type="submit" className="text-muted-foreground hover:text-destructive text-xs px-1">✕</button>
                  </form>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Add Day */}
      <div className="mt-6 rounded-2xl border border-dashed p-4">
        <p className="text-sm font-medium mb-3">Add Day</p>
        <form action={createDayWithPlan} className="flex gap-2">
          <Input name="name" placeholder="e.g. Push Day" required className="flex-1" />
          <Button type="submit" size="sm">Add</Button>
        </form>
      </div>
    </div>
  )
}
