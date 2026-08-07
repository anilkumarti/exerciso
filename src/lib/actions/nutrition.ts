'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'

async function getUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

async function getOrCreateLog(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  userId: string,
  date: string,
): Promise<string> {
  const { data: existing } = await supabase
    .from('nutrition_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('logged_date', date)
    .maybeSingle()

  if (existing) return existing.id

  const { data: newLog, error } = await supabase
    .from('nutrition_logs')
    .insert({ user_id: userId, logged_date: date })
    .select('id')
    .single()

  if (error || !newLog) throw new Error('Failed to create nutrition log')
  return newLog.id
}

function revalidateNutrition() {
  revalidatePath('/nutrition')
  revalidatePath('/nutrition/history')
  revalidatePath('/dashboard')
}

export async function logFood(formData: FormData) {
  const { supabase, user } = await getUser()

  const date = formData.get('date') as string
  const foodName = (formData.get('food_name') as string)?.trim()
  const mealType = (formData.get('meal_type') as string) || 'snack'
  const calories = Math.round(parseFloat(formData.get('calories') as string) || 0)
  const protein_g = parseFloat(formData.get('protein_g') as string) || 0
  const carbs_g = parseFloat(formData.get('carbs_g') as string) || 0
  const fat_g = parseFloat(formData.get('fat_g') as string) || 0
  const quantity_grams = parseFloat(formData.get('quantity_grams') as string) || 100

  if (!foodName || calories <= 0) return

  const logId = await getOrCreateLog(supabase, user.id, date)

  await supabase.from('food_entries').insert({
    nutrition_log_id: logId,
    user_id: user.id,
    food_name_snapshot: foodName,
    meal_type: mealType,
    quantity_grams,
    calories,
    protein_g,
    carbs_g,
    fat_g,
    fiber_g: 0,
  })

  revalidateNutrition()
}

export async function deleteFood(entryId: string) {
  const { supabase, user } = await getUser()

  await supabase
    .from('food_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id)

  revalidateNutrition()
}
