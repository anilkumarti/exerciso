import Link from 'next/link'
import { getSessionHistory } from '@/lib/queries/workout-sessions'

function formatDuration(seconds: number | null) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  return `${m}m`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function HistoryPage() {
  const sessions = await getSessionHistory()

  return (
    <div className="px-4 pb-6 pt-8">
      <h1 className="text-2xl font-bold mb-6">Workout History</h1>

      {sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <p className="text-4xl">📋</p>
          <p className="font-semibold text-lg">No workouts yet</p>
          <p className="text-muted-foreground text-sm">Completed workouts will appear here.</p>
          <Link href="/workout" className="text-sm text-primary hover:underline mt-2">Go to Plans →</Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {sessions.map((s) => (
          <Link key={s.id} href={`/workout/session/${s.id}`} className="block">
            <div className="rounded-2xl border bg-card p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{s.plan_day_name_snapshot ?? 'Workout'}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatDate(s.started_at)} · {s.exercise_count} exercise{s.exercise_count !== 1 ? 's' : ''} · {formatDuration(s.duration_seconds)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {s.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
