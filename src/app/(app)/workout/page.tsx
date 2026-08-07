import Link from 'next/link'
import { CalendarDays, Dumbbell, Layers, Plus, Trash2 } from 'lucide-react'
import { getWorkoutPlans } from '@/lib/queries/workout-plans'
import { setActivePlan, deletePlan } from '@/lib/actions/workout-plans'
import { Button } from '@/components/ui/button'
import { EmptyState, PageShell, PageHeader } from '@/components/shared/page-shell'
import { ConfirmAction } from '@/components/shared/confirm-action'

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
    <PageShell>
      <PageHeader
        title="My plans"
        subtitle={
          plans.length > 0
            ? `${plans.length} ${plans.length === 1 ? 'plan' : 'plans'}`
            : undefined
        }
        action={
          plans.length > 0 ? (
            <Link href="/workout/plans/new" aria-label="New plan">
              <Button size="icon-lg" className="rounded-full">
                <Plus className="size-5" />
              </Button>
            </Link>
          ) : undefined
        }
      />

      {plans.length === 0 && (
        <EmptyState
          icon={Dumbbell}
          title="No plans yet"
          description="Create your first workout plan to start training."
          action={
            <Link href="/workout/plans/new">
              <Button>Create plan</Button>
            </Link>
          }
        />
      )}

      {active && (
        <section className="mb-6">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Active plan
          </p>
          <PlanCard plan={active} isActive />
        </section>
      )}

      {inactive.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {active ? 'Other plans' : 'Plans'}
          </p>
          <div className="flex flex-col gap-3">
            {inactive.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  )
}

function PlanCard({
  plan,
  isActive,
}: {
  plan: Awaited<ReturnType<typeof getWorkoutPlans>>[0]
  isActive?: boolean
}) {
  const totalExercises = plan.days.reduce((sum, d) => sum + d.exercises.length, 0)

  return (
    <div
      className={`surface overflow-hidden ${isActive ? 'ring-2 ring-primary/60' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/workout/plans/${plan.id}`}
            className="min-w-0 flex-1 transition-opacity hover:opacity-70"
          >
            <p className="truncate font-semibold">{plan.name}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Layers className="size-3" />
                {SPLIT_LABELS[plan.split_type] ?? plan.split_type}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3" />
                {plan.days.length} {plan.days.length === 1 ? 'day' : 'days'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Dumbbell className="size-3" />
                {totalExercises} {totalExercises === 1 ? 'exercise' : 'exercises'}
              </span>
            </div>
          </Link>
          {isActive && (
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Active
            </span>
          )}
        </div>

        {plan.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {plan.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-3 py-2">
        <Link href={`/workout/plans/${plan.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View
          </Button>
        </Link>
        {!isActive && (
          <form action={setActivePlan.bind(null, plan.id)}>
            <Button variant="outline" size="sm" type="submit">
              Set active
            </Button>
          </form>
        )}
        <ConfirmAction
          action={deletePlan.bind(null, plan.id)}
          message={`Delete "${plan.name}"? All training days and exercises will be permanently removed.`}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            type="submit"
            aria-label={`Delete ${plan.name}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </ConfirmAction>
      </div>
    </div>
  )
}
