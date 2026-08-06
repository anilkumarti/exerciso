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

/**
 * The dashboard shows the in-progress banner, weekly count and recent
 * sessions, so every session mutation has to invalidate it too.
 */
function revalidateSessions(sessionId?: string) {
  revalidatePath('/dashboard')
  revalidatePath('/workout')
  revalidatePath('/workout/history')
  if (sessionId) revalidatePath(`/workout/session/${sessionId}`)
}

export async function startSession(
  planId: string,
  planDayId: string,
  dayName: string
) {
  const { supabase, user } = await getUser()

  // Only one session can be live at a time — retire any earlier one first
  await supabase
    .from('workout_sessions')
    .update({ status: 'abandoned' })
    .eq('user_id', user.id)
    .eq('status', 'in_progress')

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

  // Snapshot the plan's exercises into the session
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

    const { error: seedError } = await supabase
      .from('session_exercises')
      .insert(sessionExercises)
    if (seedError) throw new Error(seedError.message)
  }

  revalidateSessions()
  redirect(`/workout/session/${session.id}`)
}

export async function logSet(
  sessionExerciseId: string,
  sessionId: string,
  setNumber: number,
  formData: FormData
) {
  const { supabase, user } = await getUser()

  const weightRaw = formData.get('weight_kg') as string
  const repsRaw = formData.get('reps') as string
  const weight_kg = weightRaw ? parseFloat(weightRaw) : null
  const reps = repsRaw ? parseInt(repsRaw) : null

  // Nothing to record — avoid inserting an empty set row
  if (weight_kg === null && reps === null) return

  const { error } = await supabase.from('exercise_sets').insert({
    session_exercise_id: sessionExerciseId,
    user_id: user.id,
    set_number: setNumber,
    weight_kg,
    reps,
    is_completed: true,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/workout/session/${sessionId}`)
}

export async function finishSession(sessionId: string, startedAt: string) {
  const { supabase } = await getUser()

  const duration_seconds = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / 1000
  )

  const { error } = await supabase
    .from('workout_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      duration_seconds,
    })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)

  revalidateSessions(sessionId)
  redirect('/workout/history')
}

export async function abandonSession(sessionId: string) {
  const { supabase } = await getUser()

  const { error } = await supabase
    .from('workout_sessions')
    .update({ status: 'abandoned' })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)

  revalidateSessions(sessionId)
  redirect('/workout')
}
