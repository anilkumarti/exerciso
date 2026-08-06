import { notFound } from 'next/navigation'
import { getSession } from '@/lib/queries/workout-sessions'
import { logSet, finishSession, abandonSession } from '@/lib/actions/workout-sessions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession(id)
  if (!session) notFound()

  const isActive = session.status === 'in_progress'
  const elapsedSeconds = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000)

  return (
    <div className="px-4 pb-6 pt-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            {session.plan_day_name_snapshot ?? 'Workout'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isActive ? `${formatDuration(elapsedSeconds)} elapsed` : session.status}
          </p>
        </div>
        <Badge variant={isActive ? 'default' : 'secondary'} className="mt-1 shrink-0">
          {isActive ? 'In Progress' : session.status}
        </Badge>
      </div>

      {/* Finish / Abandon */}
      {isActive && (
        <div className="flex gap-2 mt-3 mb-6">
          <form action={finishSession.bind(null, id, session.started_at)} className="flex-1">
            <Button type="submit" className="w-full">Finish Workout</Button>
          </form>
          <form action={abandonSession.bind(null, id)}>
            <Button type="submit" variant="ghost" className="text-destructive hover:text-destructive">Abandon</Button>
          </form>
        </div>
      )}

      {/* Exercises */}
      <div className="flex flex-col gap-5 mt-4">
        {session.exercises.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">No exercises in this session.</p>
        )}

        {session.exercises.map((ex) => {
          const nextSetNumber = ex.sets.length + 1
          const logSetAction = logSet.bind(null, ex.id, id, nextSetNumber)

          return (
            <div key={ex.id} className="rounded-2xl border bg-card p-4 flex flex-col gap-3">
              <p className="font-semibold">{ex.exercise_name_snapshot}</p>

              {/* Logged sets */}
              {ex.sets.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-3 text-xs text-muted-foreground pb-1">
                    <span>Set</span><span>Weight</span><span>Reps</span>
                  </div>
                  {ex.sets.map((s) => (
                    <div key={s.id} className="grid grid-cols-3 text-sm py-1 border-t">
                      <span className="text-muted-foreground">{s.set_number}</span>
                      <span>{s.weight_kg != null ? `${s.weight_kg} kg` : '—'}</span>
                      <span>{s.reps ?? '—'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Log next set */}
              {isActive && !ex.was_skipped && (
                <form action={logSetAction} className="flex gap-2 items-end pt-1">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-muted-foreground">Weight (kg)</label>
                    <Input name="weight_kg" type="number" step="0.5" min="0" placeholder="0" className="h-9" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-muted-foreground">Reps</label>
                    <Input name="reps" type="number" min="1" placeholder="0" className="h-9" />
                  </div>
                  <Button type="submit" size="sm" className="h-9 shrink-0">
                    Log Set {nextSetNumber}
                  </Button>
                </form>
              )}
            </div>
          )
        })}
      </div>

      {!isActive && (
        <div className="mt-6 text-center">
          <a href="/workout/history" className="text-sm text-primary hover:underline">View history →</a>
        </div>
      )}
    </div>
  )
}
