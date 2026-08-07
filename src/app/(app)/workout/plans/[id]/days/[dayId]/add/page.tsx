import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getExercises } from '@/lib/queries/exercises'
import { addExerciseToDay } from '@/lib/actions/workout-plans'
import { MUSCLE_GROUP_LABELS } from '@/types/exercises'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageShell, PageHeader } from '@/components/shared/page-shell'
import { AddExerciseSearch } from '@/components/workout/add-exercise-search'

export default async function AddExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; dayId: string }>
  searchParams: Promise<{ q?: string; exercise?: string; name?: string }>
}) {
  const { id, dayId } = await params
  const { q, exercise: selectedId, name: selectedName } = await searchParams

  const exercises = await getExercises({ search: q })

  // Step 2 — configure sets/reps/rest for the chosen exercise
  if (selectedId && selectedName) {
    const action = addExerciseToDay.bind(null, dayId, id, selectedId)
    return (
      <PageShell>
        <PageHeader
          title="Configure"
          subtitle="Set your targets for this exercise."
          backHref={`/workout/plans/${id}/days/${dayId}/add`}
        />

        <div className="surface mb-6 p-4">
          <p className="font-semibold">{selectedName}</p>
        </div>

        <form action={action} className="flex flex-col gap-6">
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="target_sets">Sets</Label>
              <Input
                id="target_sets"
                name="target_sets"
                type="number"
                min={1}
                max={20}
                defaultValue={3}
                inputMode="numeric"
                className="tabular h-11 text-base"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="target_reps">Reps</Label>
              <Input
                id="target_reps"
                name="target_reps"
                placeholder="8-12"
                defaultValue="8-12"
                className="tabular h-11 text-base"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="rest_seconds">Rest (s)</Label>
              <Input
                id="rest_seconds"
                name="rest_seconds"
                type="number"
                min={0}
                max={600}
                defaultValue={90}
                inputMode="numeric"
                className="tabular h-11 text-base"
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="h-11 w-full">
            Add to day
          </Button>
        </form>
      </PageShell>
    )
  }

  // Step 1 — pick an exercise
  return (
    <PageShell>
      <PageHeader title="Add exercise" backHref={`/workout/plans/${id}`} />

      <AddExerciseSearch defaultValue={q} />

      {exercises.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No exercises found.
        </p>
      ) : (
        <ul className="surface divide-y divide-border overflow-hidden">
          {exercises.map((ex) => {
            const primaryMuscles = ex.muscles
              ?.filter((m) => m.is_primary)
              .map((m) => MUSCLE_GROUP_LABELS[m.muscle_group])
              .join(', ')
            return (
              <li key={ex.id}>
                <Link
                  href={`/workout/plans/${id}/days/${dayId}/add?exercise=${ex.id}&name=${encodeURIComponent(ex.name)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ex.name}</p>
                    {primaryMuscles && (
                      <p className="truncate text-xs text-muted-foreground">
                        {primaryMuscles}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </PageShell>
  )
}
