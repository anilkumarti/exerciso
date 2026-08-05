export type SplitType = 'push_pull_legs' | 'upper_lower' | 'full_body' | 'custom'
export type SetType = 'warmup' | 'working' | 'drop_set' | 'failure'
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'
export type PRType = 'estimated_1rm' | 'max_weight' | 'max_reps_at_weight' | 'max_volume_session'

export interface WorkoutPlan {
  id: string
  user_id: string
  name: string
  description: string | null
  split_type: SplitType
  days_per_week: number
  is_active: boolean
  is_archived: boolean
  notes: string | null
  created_at: string
  updated_at: string
  days?: WorkoutPlanDay[]
}

export interface WorkoutPlanDay {
  id: string
  plan_id: string
  name: string
  day_number: number
  notes: string | null
  exercises?: PlanExercise[]
}

export interface PlanExercise {
  id: string
  plan_day_id: string
  exercise_id: string
  order_index: number
  target_sets: number
  target_reps_min: number
  target_reps_max: number
  target_weight_kg: number | null
  target_rpe: number | null
  rest_seconds: number
  notes: string | null
  is_optional: boolean
  exercise?: Exercise
}

export interface WorkoutSession {
  id: string
  user_id: string
  plan_id: string | null
  plan_day_id: string | null
  plan_day_name_snapshot: string | null
  started_at: string
  completed_at: string | null
  duration_seconds: number | null
  status: SessionStatus
  total_volume_kg: number | null
  notes: string | null
  perceived_difficulty: number | null
  body_weight_at_time_kg: number | null
  exercises?: SessionExercise[]
}

export interface SessionExercise {
  id: string
  session_id: string
  user_id: string
  exercise_id: string
  exercise_name_snapshot: string
  order_index: number
  plan_exercise_id: string | null
  notes: string | null
  was_substituted: boolean
  was_skipped: boolean
  substituted_for_exercise_id: string | null
  sets?: ExerciseSet[]
}

export interface ExerciseSet {
  id: string
  session_exercise_id: string
  user_id: string
  set_number: number
  set_type: SetType
  target_reps: number | null
  target_weight_kg: number | null
  actual_reps: number | null
  actual_weight_kg: number | null
  rpe: number | null
  is_completed: boolean
  is_personal_record: boolean
  completed_at: string | null
  rest_seconds_taken: number | null
  notes: string | null
}

export interface PersonalRecord {
  id: string
  user_id: string
  exercise_id: string
  pr_type: PRType
  value: number
  unit: string
  achieved_at: string
  session_id: string | null
  set_id: string | null
  previous_value: number | null
}

export interface Exercise {
  id: string
  name: string
  slug: string
  description: string | null
  category: 'compound' | 'isolation'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  is_unilateral: boolean
  recommended_sets_min: number | null
  recommended_sets_max: number | null
  recommended_reps_min: number | null
  recommended_reps_max: number | null
  recommended_rest_seconds: number | null
  instructions: { step: number; text: string }[] | null
  form_tips: string | null
  breathing_tips: string | null
  common_mistakes: string[] | null
  safety_notes: string | null
  is_archived: boolean
  muscles?: ExerciseMuscle[]
  equipment?: ExerciseEquipment[]
  videos?: ExerciseVideo[]
  alternatives?: ExerciseAlternative[]
}

export interface MuscleGroup {
  id: string
  name: string
  common_name: string | null
  region: 'upper' | 'lower' | 'core'
}

export interface ExerciseMuscle {
  exercise_id: string
  muscle_group_id: string
  role: 'primary' | 'secondary'
  muscle_group?: MuscleGroup
}

export interface EquipmentType {
  id: string
  name: string
  category: string | null
}

export interface ExerciseEquipment {
  exercise_id: string
  equipment_id: string
  is_required: boolean
  equipment?: EquipmentType
}

export interface ExerciseVideo {
  id: string
  exercise_id: string
  provider: 'youtube' | 'vimeo'
  video_id: string
  title: string | null
  thumbnail_url: string | null
  duration_seconds: number | null
  is_primary: boolean
}

export interface ExerciseAlternative {
  exercise_id: string
  alternative_exercise_id: string
  reason: string | null
  alternative?: Exercise
}
