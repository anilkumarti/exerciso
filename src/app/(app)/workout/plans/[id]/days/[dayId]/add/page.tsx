import Link from 'next/link'
import { getExercises } from '@/lib/queries/exercises'
import { addExerciseToDay } from '@/lib/actions/workout-plans'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  if (selectedId && selectedName) {
    const action = addExerciseToDay.bind(null, dayId, id, selectedId)
    return (
      <div className="px-4 pb-6 pt-8 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/workout/plans/${id}/days/${dayId}/add`} className="text-muted-foreground hover:text-foreground">
            ← Back
          </Link>
          <h1 className="text-xl font-bold">Configure Exercise</h1>
        </div>

        <div className="rounded-2xl border bg-card p-4 mb-6">
          <p className="font-semibold">{selectedName}</p>
        </div>

        <form action={action} className="flex flex-col gap-5">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label htmlFor="target_sets">Sets</Label>
              <Input id="target_sets" name="target_sets" type="number" min={1} max={20} defaultValue={3} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <Label htmlFor="target_reps">Reps</Label>
              <Input id="target_reps" name="target_reps" placeholder="e.g. 8-12" defaultValue="8-12" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <Label htmlFor="rest_seconds">Rest (s)</Label>
              <Input id="rest_seconds" name="rest_seconds" type="number" min={0} max={600} defaultValue={90} />
            </div>
          </div>
          <Button type="submit">Add to Day</Button>
        </form>
      </div>
    )
  }

  return (
    <div className="px-4 pb-6 pt-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/workout/plans/${id}`} className="text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Add Exercise</h1>
      </div>

      <form className="mb-4">
        <input type="hidden" name="exercise" value="" />
        <Input name="q" defaultValue={q ?? ''} placeholder="Search exercises…" autoFocus />
      </form>

      <div className="flex flex-col gap-1">
        {exercises.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No exercises found.</p>
        )}
        {exercises.map((ex) => (
          <Link
            key={ex.id}
            href={`/workout/plans/${id}/days/${dayId}/add?exercise=${ex.id}&name=${encodeURIComponent(ex.name)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{ex.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {ex.muscles?.map((m) => m.muscle_group).join(', ')}
              </p>
            </div>
            <span className="text-muted-foreground text-sm">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
