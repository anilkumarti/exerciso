import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { WeightUnit, HeightUnit, ActivityLevel, FitnessGoal } from '@/types/database'

export interface Profile {
  id: string
  display_name: string | null
  date_of_birth: string | null
  weight_unit: WeightUnit
  height_unit: HeightUnit
  height_cm: number | null
  goal_weight_kg: number | null
  activity_level: ActivityLevel
  fitness_goal: FitnessGoal
  onboarding_done: boolean
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('id, display_name, date_of_birth, weight_unit, height_unit, height_cm, goal_weight_kg, activity_level, fitness_goal, onboarding_done')
    .eq('id', user.id)
    .maybeSingle()

  return (data as Profile | null) ?? {
    id: user.id,
    display_name: null,
    date_of_birth: null,
    weight_unit: 'kg',
    height_unit: 'cm',
    height_cm: null,
    goal_weight_kg: null,
    activity_level: 'moderately_active',
    fitness_goal: 'build_muscle',
    onboarding_done: false,
  }
}
