import Link from 'next/link'
import { getWorkoutPlans } from '@/lib/queries/workout-plans'
import { setActivePlan, deletePlan } from '@/lib/actions/workout-plans'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const SPLIT_LABELS: Record<string, string> = {
  full_body: 'Full Body',
  upper_lower: 'Upper/Lower',
  push_pull_legs: 'Push/Pull/Legs',
  bro_split: 'Bro Split',
  custom: 'Custom',
}

export default async function WorkoutPage() {
  const plans = await getWorkoutPlans()
  const active = plans.find((p) => p.is_active)
  const inactive = plans.filter((p) => !p.is_active)

  return (
    <div className="px-4 pb-6 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Plans</h1>
        <Link href="/workout/plans/new">
          <Button size="sm">+ New Plan</Button>
        </Link>
      </div>

      {plans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <p className="text-4xl">🏋️</p>
          <p className="font-semibold text-lg">No plans yet</p>
          <p className="text-muted-foreground text-sm">Create your first workout plan to get started.</p>
          <Link href="/workout/plans/new">
            <Button className="mt-2">Create Plan</Button>
          </Link>
        </div>
      )}

      {active && (
        <section className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Active Plan</p>
          <PlanCard plan={active} isActive />
        </section>
      )}

      {inactive.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {active ? 'Other Plans' : 'Plans'}
          </p>
          <div className="flex flex-col gap-3">
            {inactive.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function PlanCard({ plan, isActive }: { plan: Awaited<ReturnType<typeof getWorkoutPlans>>[0]; isActive?: boolean }) {
  const totalExercises = plan.days.reduce((sum, d) => sum + d.exercises.length, 0)

  return (
    <div className={`rounded-2xl border bg-card p-4 flex flex-col gap-3 ${isActive ? 'border-primary ring-1 ring-primary' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/workout/plans/${plan.id}`} className="font-semibold text-base truncate hover:underline">
              {plan.name}
            </Link>
            {isActive && <Badge variant="default" className="text-xs shrink-0">Active</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {SPLIT_LABELS[plan.split_type] ?? plan.split_type} · {plan.days.length} day{plan.days.length !== 1 ? 's' : ''} · {totalExercises} exercise{totalExercises !== 1 ? 's' : ''}
          </p>
          {plan.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`/workout/plans/${plan.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">View</Button>
        </Link>
        {!isActive && (
          <form action={setActivePlan.bind(null, plan.id)}>
            <Button variant="outline" size="sm" type="submit">Set Active</Button>
          </form>
        )}
        <form action={deletePlan.bind(null, plan.id)}>
          <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:text-destructive">Delete</Button>
        </form>
      </div>
    </div>
  )
}
