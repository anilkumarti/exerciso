export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'pre_workout'
  | 'post_workout'

export interface NutritionLog {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  calorie_target_override: number | null
  protein_target_override_g: number | null
  carbs_target_override_g: number | null
  fat_target_override_g: number | null
  notes: string | null
  entries?: FoodEntry[]
}

export interface FoodEntry {
  id: string
  nutrition_log_id: string
  user_id: string
  meal_type: MealType
  food_name: string
  brand: string | null
  quantity: number
  serving_unit: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number | null
  sugar_g: number | null
  sodium_mg: number | null
  food_db_id: string | null
  logged_at: string
}

export interface FoodDatabase {
  id: string
  name: string
  brand: string | null
  barcode: string | null
  serving_size_g: number | null
  calories_per_100g: number | null
  protein_per_100g: number | null
  carbs_per_100g: number | null
  fat_per_100g: number | null
  fiber_per_100g: number | null
  source: 'user_created' | 'usda' | 'open_food_facts'
  is_verified: boolean
  created_by: string | null
}

export interface MacroTotals {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface DailyNutritionSummary {
  date: string
  totals: MacroTotals
  targets: MacroTotals
  remaining: MacroTotals
  entries_count: number
}
