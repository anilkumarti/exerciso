import { getSupabaseServerClient } from '@/lib/supabase/server'

export interface SetRow {
  id: string
  set_number: number
  weight_kg: number | null
  reps: number | null
  is_completed: boolean
}

export interface SessionExerciseRow {
  id: string
  exercise_name_snapshot: string
  exercise_order: number
  was_skipped: boolean
  plan_exercise_id: string | null
  target_sets: number | null
  target_reps: string | null
  sets: SetRow[]
}

export interface SessionRow {
  id: string
  status: string
  started_at: string
  completed_at: string | null
  duration_seconds: number | null
  plan_day_name_snapshot: string | null
  exercises: SessionExerciseRow[]
}

export async function getSession(id: string): Promise<SessionRow | null> {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      id, status, started_at, completed_at, duration_seconds, plan_day_name_snapshot,
      exercises:session_exercises(
        id, exercise_name_snapshot, exercise_order, was_skipped, plan_exercise_id,
        sets:exercise_sets(id, set_number, weight_kg, reps, is_completed)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) return null

  const session = data as SessionRow
  return {
    ...session,
    exercises: (session.exercises ?? [])
      .sort((a, b) => a.exercise_order - b.exercise_order)
      .map((ex) => ({
        ...ex,
        target_sets: null,
        target_reps: null,
        sets: (ex.sets ?? []).sort((a, b) => a.set_number - b.set_number),
      })),
  }
}

export async function getActiveSession(): Promise<{ id: string } | null> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('workout_sessions')
    .select('id')
    .eq('status', 'in_progress')
    .limit(1)
    .maybeSingle()
  return data as { id: string } | null
}

export interface HistoryRow {
  id: string
  plan_day_name_snapshot: string | null
  status: string
  started_at: string
  completed_at: string | null
  duration_seconds: number | null
  exercise_count: number
}

export async function getSessionHistory(): Promise<HistoryRow[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      id, plan_day_name_snapshot, status, started_at, completed_at, duration_seconds,
      exercises:session_exercises(id)
    `)
    .neq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(20)

  if (error) return []
  return ((data ?? []) as (HistoryRow & { exercises: { id: string }[] })[]).map((s) => ({
    ...s,
    exercise_count: (s.exercises ?? []).length,
  }))
}
