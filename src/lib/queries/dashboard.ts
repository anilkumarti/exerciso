import { getSupabaseServerClient } from '@/lib/supabase/server'

export interface DashboardData {
  activeSession: { id: string; plan_day_name_snapshot: string | null } | null
  activePlan: {
    id: string
    name: string
    split_type: string
    days: { id: string; name: string; exercise_count: number }[]
  } | null
  recentSessions: {
    id: string
    plan_day_name_snapshot: string | null
    started_at: string
    duration_seconds: number | null
    exercise_count: number
  }[]
  weeklyCount: number
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await getSupabaseServerClient()

  const monday = new Date()
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const [activeSessionRes, activePlanRes, recentRes, weeklyRes] = await Promise.all([
    supabase
      .from('workout_sessions')
      .select('id, plan_day_name_snapshot')
      .eq('status', 'in_progress')
      .limit(1)
      .maybeSingle(),

    supabase
      .from('workout_plans')
      .select(`
        id, name, split_type,
        days:workout_plan_days(id, name, day_order, exercises:plan_exercises(id))
      `)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle(),

    supabase
      .from('workout_sessions')
      .select('id, plan_day_name_snapshot, started_at, duration_seconds, exercises:session_exercises(id)')
      .eq('status', 'completed')
      .order('started_at', { ascending: false })
      .limit(3),

    supabase
      .from('workout_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('started_at', monday.toISOString()),
  ])

  const activePlanData = activePlanRes.data as {
    id: string; name: string; split_type: string
    days: { id: string; name: string; day_order: number; exercises: { id: string }[] }[]
  } | null

  const activePlan = activePlanData ? {
    id: activePlanData.id,
    name: activePlanData.name,
    split_type: activePlanData.split_type,
    days: (activePlanData.days ?? [])
      .sort((a, b) => a.day_order - b.day_order)
      .map((d) => ({ id: d.id, name: d.name, exercise_count: (d.exercises ?? []).length })),
  } : null

  const recentSessions = ((recentRes.data ?? []) as {
    id: string; plan_day_name_snapshot: string | null
    started_at: string; duration_seconds: number | null
    exercises: { id: string }[]
  }[]).map((s) => ({
    id: s.id,
    plan_day_name_snapshot: s.plan_day_name_snapshot,
    started_at: s.started_at,
    duration_seconds: s.duration_seconds,
    exercise_count: (s.exercises ?? []).length,
  }))

  return {
    activeSession: (activeSessionRes.data as { id: string; plan_day_name_snapshot: string | null } | null),
    activePlan,
    recentSessions,
    weeklyCount: weeklyRes.count ?? 0,
  }
}
