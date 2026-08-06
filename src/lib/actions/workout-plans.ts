'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { SplitType } from '@/types/database'

async function getUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

/**
 * The dashboard summarises plans, days and exercise counts, so any plan
 * mutation has to invalidate it alongside the plan-specific routes.
 */
function revalidatePlan(planId?: string) {
  revalidatePath('/dashboard')
  revalidatePath('/workout')
  if (planId) revalidatePath(`/workout/plans/${planId}`)
}

export async function createPlan(formData: FormData) {
  const { supabase, user } = await getUser()
  const name = formData.get('name') as string
  const description = (formData.get('description') as string) || null
  const split_type = ((formData.get('split_type') as string) ||
    'custom') as SplitType

  const { data, error } = await supabase
    .from('workout_plans')
    .insert({ user_id: user.id, name, description, split_type })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePlan()
  redirect(`/workout/plans/${data.id}`)
}

export async function deletePlan(id: string) {
  const { supabase } = await getUser()
  const { error } = await supabase.from('workout_plans').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePlan()
  redirect('/workout')
}

export async function setActivePlan(id: string) {
  const { supabase, user } = await getUser()
  await supabase
    .from('workout_plans')
    .update({ is_active: false })
    .eq('user_id', user.id)
  await supabase.from('workout_plans').update({ is_active: true }).eq('id', id)
  revalidatePlan(id)
}

export async function createDay(planId: string, formData: FormData) {
  const { supabase, user } = await getUser()
  const name = formData.get('name') as string

  const { data: existing } = await supabase
    .from('workout_plan_days')
    .select('id')
    .eq('plan_id', planId)
  const day_order = (existing ?? []).length

  const { error } = await supabase
    .from('workout_plan_days')
    .insert({ plan_id: planId, user_id: user.id, name, day_order })

  if (error) throw new Error(error.message)
  revalidatePlan(planId)
}

export async function deleteDay(dayId: string, planId: string) {
  const { supabase } = await getUser()
  const { error } = await supabase
    .from('workout_plan_days')
    .delete()
    .eq('id', dayId)
  if (error) throw new Error(error.message)
  revalidatePlan(planId)
}

export async function addExerciseToDay(
  dayId: string,
  planId: string,
  exerciseId: string,
  formData: FormData,
) {
  const { supabase, user } = await getUser()
  const target_sets = parseInt(formData.get('target_sets') as string) || 3
  const target_reps = (formData.get('target_reps') as string) || '8-12'
  const rest_seconds = parseInt(formData.get('rest_seconds') as string) || 90

  const { data: existing } = await supabase
    .from('plan_exercises')
    .select('id')
    .eq('plan_day_id', dayId)
  const exercise_order = (existing ?? []).length

  const { error } = await supabase.from('plan_exercises').insert({
    plan_day_id: dayId,
    user_id: user.id,
    exercise_id: exerciseId,
    exercise_order,
    target_sets,
    target_reps,
    rest_seconds,
  })

  if (error) throw new Error(error.message)
  revalidatePlan(planId)
  redirect(`/workout/plans/${planId}`)
}

export async function removeExerciseFromDay(exerciseId: string, planId: string) {
  const { supabase } = await getUser()
  const { error } = await supabase
    .from('plan_exercises')
    .delete()
    .eq('id', exerciseId)
  if (error) throw new Error(error.message)
  revalidatePlan(planId)
}
