export type WeightUnit = 'kg' | 'lbs'
export type HeightUnit = 'cm' | 'ft_in'
export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active'
export type FitnessGoal = 'lose_weight' | 'gain_muscle' | 'maintain' | 'strength' | 'endurance'

export interface Profile {
  id: string
  display_name: string | null
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  height_cm: number | null
  weight_unit: WeightUnit
  height_unit: HeightUnit
  timezone: string
  activity_level: ActivityLevel | null
  fitness_goal: FitnessGoal | null
  weekly_workout_target: number | null
  daily_calorie_target: number | null
  daily_protein_target_g: number | null
  daily_carbs_target_g: number | null
  daily_fat_target_g: number | null
  starting_weight_kg: number | null
  goal_weight_kg: number | null
  created_at: string
  updated_at: string
}
