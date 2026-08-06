import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Exercise, ExerciseWithAlternatives, MuscleGroup, EquipmentType } from '@/types/exercises'

export interface ExerciseFilters {
  search?: string
  muscle?: MuscleGroup
  equipment?: EquipmentType
}

export async function getExercises(filters: ExerciseFilters = {}): Promise<Exercise[]> {
  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from('exercises')
    .select(`
      id, name, description, is_custom, created_at,
      muscles:exercise_muscles(muscle_group, is_primary),
      equipment:exercise_equipment(equipment_type),
      videos:exercise_videos(id, youtube_id, title, is_primary)
    `)
    .order('name')

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  // Filter by muscle group: check if any exercise_muscles row matches
  if (filters.muscle) {
    const { data: exerciseIds } = await supabase
      .from('exercise_muscles')
      .select('exercise_id')
      .eq('muscle_group', filters.muscle)
    if (exerciseIds) {
      query = query.in('id', (exerciseIds as { exercise_id: string }[]).map((r) => r.exercise_id))
    }
  }

  // Filter by equipment type
  if (filters.equipment) {
    const { data: exerciseIds } = await supabase
      .from('exercise_equipment')
      .select('exercise_id')
      .eq('equipment_type', filters.equipment)
    if (exerciseIds) {
      query = query.in('id', (exerciseIds as { exercise_id: string }[]).map((r) => r.exercise_id))
    }
  }

  const { data, error } = await query.limit(200)

  if (error) throw new Error(error.message)
  return (data ?? []) as Exercise[]
}

export async function getExercise(id: string): Promise<ExerciseWithAlternatives | null> {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('exercises')
    .select(`
      id, name, description, instructions, is_custom, created_at, updated_at,
      muscles:exercise_muscles(muscle_group, is_primary),
      equipment:exercise_equipment(equipment_type),
      videos:exercise_videos(id, youtube_id, title, is_primary)
    `)
    .eq('id', id)
    .single()

  if (error || !data) return null

  // Fetch alternatives separately to avoid deep nesting complexity
  const { data: altLinks } = await supabase
    .from('exercise_alternatives')
    .select('alternative_id')
    .eq('exercise_id', id)

  let alternatives: Exercise[] = []
  const altLinksTyped = (altLinks ?? []) as { alternative_id: string }[]
  if (altLinksTyped.length > 0) {
    const altIds = altLinksTyped.map((a) => a.alternative_id)
    const { data: altExercises } = await supabase
      .from('exercises')
      .select(`
        id, name, description, is_custom, created_at,
        muscles:exercise_muscles(muscle_group, is_primary),
        equipment:exercise_equipment(equipment_type),
        videos:exercise_videos(id, youtube_id, title, is_primary)
      `)
      .in('id', altIds)
      .order('name')
    alternatives = (altExercises ?? []) as Exercise[]
  }

  return { ...(data as object), alternatives } as ExerciseWithAlternatives
}
