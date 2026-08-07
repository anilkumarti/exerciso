'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { WeightUnit, HeightUnit, ActivityLevel, FitnessGoal } from '@/types/database'

export async function updateProfile(_: unknown, formData: FormData) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const display_name = (formData.get('display_name') as string).trim() || null
  const date_of_birth = (formData.get('date_of_birth') as string) || null
  const weight_unit = formData.get('weight_unit') as WeightUnit
  const height_unit = formData.get('height_unit') as HeightUnit
  const height_cm_raw = formData.get('height_cm') as string
  const goal_weight_kg_raw = formData.get('goal_weight_kg') as string
  const activity_level = formData.get('activity_level') as ActivityLevel
  const fitness_goal = formData.get('fitness_goal') as FitnessGoal

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    display_name,
    date_of_birth,
    weight_unit,
    height_unit,
    height_cm: height_cm_raw ? parseFloat(height_cm_raw) : null,
    goal_weight_kg: goal_weight_kg_raw ? parseFloat(goal_weight_kg_raw) : null,
    activity_level,
    fitness_goal,
  })

  if (error) return { error: error.message }

  revalidatePath('/settings/profile')
  revalidatePath('/dashboard')
  return { success: true }
}

interface OnboardingData {
  fitness_goal: FitnessGoal
  activity_level: ActivityLevel
  date_of_birth: string | null
  height_cm: number | null
  weight_kg: number | null
  weight_unit: WeightUnit
  height_unit: HeightUnit
}

export async function completeOnboarding(data: OnboardingData): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('profiles').upsert({
    id: user.id,
    fitness_goal: data.fitness_goal,
    activity_level: data.activity_level,
    date_of_birth: data.date_of_birth,
    height_cm: data.height_cm,
    weight_unit: data.weight_unit,
    height_unit: data.height_unit,
    onboarding_done: true,
  })

  if (data.weight_kg) {
    await supabase.from('weight_entries').insert({
      user_id: user.id,
      weight_kg: data.weight_kg,
      logged_at: new Date().toISOString().split('T')[0],
      notes: null,
    })
  }

  redirect('/dashboard')
}

export async function skipOnboarding(): Promise<void> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('profiles').upsert({
    id: user.id,
    onboarding_done: true,
  })

  redirect('/dashboard')
}
