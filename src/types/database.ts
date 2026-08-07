export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type SplitType = 'full_body' | 'upper_lower' | 'push_pull_legs' | 'bro_split' | 'custom'
export type SetType = 'normal' | 'warmup' | 'dropset' | 'failure'
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'
export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'evening_snack' | 'snack' | 'dinner' | 'supper' | 'pre_workout' | 'post_workout'
export type WeightUnit = 'kg' | 'lbs'
export type HeightUnit = 'cm' | 'ft_in'
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active'
export type FitnessGoal = 'lose_weight' | 'build_muscle' | 'maintain' | 'improve_endurance' | 'increase_strength'
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms' | 'core' | 'glutes' | 'quads' | 'hamstrings' | 'calves' | 'full_body'
export type EquipmentType = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'kettlebell' | 'resistance_band' | 'smith_machine' | 'other'

// ── Row types ────────────────────────────────────────────────────────────────

type ProfileRow = {
  id: string; display_name: string | null; avatar_url: string | null
  date_of_birth: string | null; weight_unit: WeightUnit; height_unit: HeightUnit
  height_cm: number | null; goal_weight_kg: number | null; activity_level: ActivityLevel
  fitness_goal: FitnessGoal; onboarding_done: boolean; created_at: string; updated_at: string
}
type ExerciseRow = {
  id: string; name: string; description: string | null; instructions: string | null
  is_custom: boolean; created_by: string | null; created_at: string; updated_at: string
}
type ExerciseMuscleRow = { exercise_id: string; muscle_group: MuscleGroup; is_primary: boolean }
type ExerciseEquipmentRow = { exercise_id: string; equipment_type: EquipmentType }
type ExerciseVideoRow = { id: string; exercise_id: string; youtube_id: string; title: string | null; is_primary: boolean; created_at: string }
type ExerciseAlternativeRow = { exercise_id: string; alternative_id: string }
type WorkoutPlanRow = {
  id: string; user_id: string; name: string; description: string | null
  split_type: SplitType; is_active: boolean; created_at: string; updated_at: string
}
type WorkoutPlanDayRow = {
  id: string; plan_id: string; user_id: string; name: string
  day_order: number; created_at: string; updated_at: string
}
type PlanExerciseRow = {
  id: string; plan_day_id: string; user_id: string; exercise_id: string
  exercise_order: number; target_sets: number; target_reps: string
  target_weight_kg: number | null; rest_seconds: number; notes: string | null
  created_at: string; updated_at: string
}
type WorkoutSessionRow = {
  id: string; user_id: string; plan_id: string | null; plan_day_id: string | null
  plan_day_name_snapshot: string | null; status: SessionStatus; started_at: string
  completed_at: string | null; duration_seconds: number | null; notes: string | null
  created_at: string; updated_at: string
}
type SessionExerciseRow = {
  id: string; session_id: string; user_id: string; plan_exercise_id: string | null
  exercise_id: string; exercise_name_snapshot: string; exercise_order: number
  was_skipped: boolean; notes: string | null; created_at: string; updated_at: string
}
type ExerciseSetRow = {
  id: string; session_exercise_id: string; user_id: string; set_number: number
  set_type: SetType; weight_kg: number | null; reps: number | null
  duration_seconds: number | null; rpe: number | null; is_completed: boolean
  logged_at: string; created_at: string; updated_at: string
}
type WeightEntryRow = { id: string; user_id: string; weight_kg: number; logged_at: string; notes: string | null; created_at: string }
type NutritionLogRow = { id: string; user_id: string; logged_date: string; notes: string | null; created_at: string; updated_at: string }
type FoodEntryRow = {
  id: string; nutrition_log_id: string; user_id: string; food_db_id: string | null
  food_name_snapshot: string; meal_type: MealType; quantity_grams: number
  calories: number; protein_g: number; carbs_g: number; fat_g: number; fiber_g: number
  created_at: string; updated_at: string
}

// ── Explicit Insert types (fields with DB defaults or nullable are optional) ──

type WorkoutPlanInsert = {
  id?: string; user_id: string; name: string; description?: string | null
  split_type: SplitType; is_active?: boolean
}
type PlanExerciseInsert = {
  id?: string; plan_day_id: string; user_id: string; exercise_id: string
  exercise_order: number; target_sets: number; target_reps: string
  target_weight_kg?: number | null; rest_seconds: number; notes?: string | null
}
type WorkoutSessionInsert = {
  id?: string; user_id: string; plan_id?: string | null; plan_day_id?: string | null
  plan_day_name_snapshot?: string | null; status: SessionStatus; started_at?: string
  completed_at?: string | null; duration_seconds?: number | null; notes?: string | null
}
type SessionExerciseInsert = {
  id?: string; session_id: string; user_id: string; plan_exercise_id?: string | null
  exercise_id: string; exercise_name_snapshot: string; exercise_order: number
  was_skipped?: boolean; notes?: string | null
}
type ExerciseSetInsert = {
  id?: string; session_exercise_id: string; user_id: string; set_number: number
  set_type?: SetType; weight_kg?: number | null; reps?: number | null
  duration_seconds?: number | null; rpe?: number | null; is_completed: boolean; logged_at?: string
}

// ── Database interface ────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow> & { id: string }; Update: Partial<ProfileRow>; Relationships: [] }
      exercises: { Row: ExerciseRow; Insert: Omit<ExerciseRow, 'id' | 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<ExerciseRow>; Relationships: [] }
      exercise_muscles: { Row: ExerciseMuscleRow; Insert: ExerciseMuscleRow; Update: Partial<ExerciseMuscleRow>; Relationships: [] }
      exercise_equipment: { Row: ExerciseEquipmentRow; Insert: ExerciseEquipmentRow; Update: Partial<ExerciseEquipmentRow>; Relationships: [] }
      exercise_videos: { Row: ExerciseVideoRow; Insert: Omit<ExerciseVideoRow, 'id' | 'created_at'> & { id?: string }; Update: Partial<ExerciseVideoRow>; Relationships: [] }
      exercise_alternatives: { Row: ExerciseAlternativeRow; Insert: ExerciseAlternativeRow; Update: Partial<ExerciseAlternativeRow>; Relationships: [] }
      workout_plans: { Row: WorkoutPlanRow; Insert: WorkoutPlanInsert; Update: Partial<WorkoutPlanRow>; Relationships: [] }
      workout_plan_days: { Row: WorkoutPlanDayRow; Insert: Omit<WorkoutPlanDayRow, 'id' | 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<WorkoutPlanDayRow>; Relationships: [] }
      plan_exercises: { Row: PlanExerciseRow; Insert: PlanExerciseInsert; Update: Partial<PlanExerciseRow>; Relationships: [] }
      workout_sessions: { Row: WorkoutSessionRow; Insert: WorkoutSessionInsert; Update: Partial<WorkoutSessionRow>; Relationships: [] }
      session_exercises: { Row: SessionExerciseRow; Insert: SessionExerciseInsert; Update: Partial<SessionExerciseRow>; Relationships: [] }
      exercise_sets: { Row: ExerciseSetRow; Insert: ExerciseSetInsert; Update: Partial<ExerciseSetRow>; Relationships: [] }
      weight_entries: { Row: WeightEntryRow; Insert: Omit<WeightEntryRow, 'id' | 'created_at'> & { id?: string }; Update: Partial<WeightEntryRow>; Relationships: [] }
      nutrition_logs: { Row: NutritionLogRow; Insert: Omit<NutritionLogRow, 'id' | 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<NutritionLogRow>; Relationships: [] }
      food_entries: { Row: FoodEntryRow; Insert: Omit<FoodEntryRow, 'id' | 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<FoodEntryRow>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      split_type: SplitType; set_type: SetType; session_status: SessionStatus
      muscle_group: MuscleGroup; equipment_type: EquipmentType
    }
  }
}
