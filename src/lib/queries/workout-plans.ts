import { getSupabaseServerClient } from '@/lib/supabase/server'

export interface PlanExerciseRow {
  id: string
  plan_day_id: string
  exercise_id: string
  exercise_order: number
  target_sets: number
  target_reps: string
  target_weight_kg: number | null
  rest_seconds: number
  notes: string | null
  exercise: { id: string; name: string } | null
}

export interface PlanDayRow {
  id: string
  plan_id: string
  name: string
  day_order: number
  exercises: PlanExerciseRow[]
}

export interface WorkoutPlanRow {
  id: string
  user_id: string
  name: string
  description: string | null
  split_type: string
  is_active: boolean
  created_at: string
  updated_at: string
  days: PlanDayRow[]
}

export async function getWorkoutPlans(): Promise<WorkoutPlanRow[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('workout_plans')
    .select(`
      id, user_id, name, description, split_type, is_active, created_at, updated_at,
      days:workout_plan_days(
        id, plan_id, name, day_order,
        exercises:plan_exercises(
          id, plan_day_id, exercise_id, exercise_order,
          target_sets, target_reps, target_weight_kg, rest_seconds, notes,
          exercise:exercises(id, name)
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  const plans = (data ?? []) as WorkoutPlanRow[]
  return plans.map((p) => ({
    ...p,
    days: (p.days ?? [])
      .sort((a, b) => a.day_order - b.day_order)
      .map((d) => ({
        ...d,
        exercises: (d.exercises ?? []).sort((a, b) => a.exercise_order - b.exercise_order),
      })),
  }))
}

export async function getWorkoutPlan(id: string): Promise<WorkoutPlanRow | null> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('workout_plans')
    .select(`
      id, user_id, name, description, split_type, is_active, created_at, updated_at,
      days:workout_plan_days(
        id, plan_id, name, day_order,
        exercises:plan_exercises(
          id, plan_day_id, exercise_id, exercise_order,
          target_sets, target_reps, target_weight_kg, rest_seconds, notes,
          exercise:exercises(id, name)
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) return null
  const plan = data as WorkoutPlanRow
  return {
    ...plan,
    days: (plan.days ?? [])
      .sort((a, b) => a.day_order - b.day_order)
      .map((d) => ({
        ...d,
        exercises: (d.exercises ?? []).sort((a, b) => a.exercise_order - b.exercise_order),
      })),
  }
}
