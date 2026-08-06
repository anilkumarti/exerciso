'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getWorkoutPlan } from '@/lib/queries/workout-plans'

async function getUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

export async function startSession(planId: string, planDayId: string, dayName: string) {
  const { supabase, user } = await getUser()

  // Abandon any existing in_progress session
  await supabase
    .from('workout_sessions')
    .update({ status: 'abandoned' })
    .eq('user_id', user.id)
    .eq('status', 'in_progress')

  // Create the session
  const { data: session, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: user.id,
      plan_id: planId,
      plan_day_id: planDayId,
      plan_day_name_snapshot: dayName,
      status: 'in_progress',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // Load plan exercises for this day and create session_exercises
  const plan = await getWorkoutPlan(planId)
  const day = plan?.days.find((d) => d.id === planDayId)

  if (day && day.exercises.length > 0) {
    const sessionExercises = day.exercises.map((ex) => ({
      session_id: session.id,
      user_id: user.id,
      plan_exercise_id: ex.id,
      exercise_id: ex.exercise_id,
      exercise_name_snapshot: ex.exercise?.name ?? 'Unknown',
      exercise_order: ex.exercise_order,
    }))

    await supabase.from('session_exercises').insert(sessionExercises)
  }

  redirect(`/workout/session/${session.id}`)
}

export async function logSet(sessionExerciseId: string, sessionId: string, setNumber: number, formData: FormData) {
  const { supabase, user } = await getUser()

  const weight_kg = formData.get('weight_kg') ? parseFloat(formData.get('weight_kg') as string) : null
  const reps = formData.get('reps') ? parseInt(formData.get('reps') as string) : null

  await supabase.from('exercise_sets').insert({
    session_exercise_id: sessionExerciseId,
    user_id: user.id,
    set_number: setNumber,
    weight_kg,
    reps,
    is_completed: true,
  })

  revalidatePath(`/workout/session/${sessionId}`)
}

export async function finishSession(sessionId: string, startedAt: string) {
  const { supabase } = await getUser()

  const duration_seconds = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)

  await supabase
    .from('workout_sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString(), duration_seconds })
    .eq('id', sessionId)

  revalidatePath('/workout')
  revalidatePath('/workout/history')
  redirect('/workout/history')
}

export async function abandonSession(sessionId: string) {
  const { supabase } = await getUser()

  await supabase
    .from('workout_sessions')
    .update({ status: 'abandoned' })
    .eq('id', sessionId)

  revalidatePath('/workout')
  redirect('/workout')
}
