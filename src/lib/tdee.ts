import type { ActivityLevel, FitnessGoal } from '@/types/database'
import type { MacroTargets } from '@/lib/queries/nutrition'
import type { Profile } from '@/lib/queries/profile'

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary:         1.2,
  lightly_active:    1.375,
  moderately_active: 1.55,
  very_active:       1.725,
  extra_active:      1.9,
}

// Calorie delta on top of TDEE
const GOAL_CAL_DELTA: Record<FitnessGoal, number> = {
  lose_weight:       -500,
  build_muscle:      +300,
  maintain:            0,
  improve_endurance: +100,
  increase_strength: +250,
}

// Protein in grams per kg body weight
const PROTEIN_PER_KG: Record<FitnessGoal, number> = {
  lose_weight:       2.2,
  build_muscle:      2.0,
  maintain:          1.6,
  improve_endurance: 1.4,
  increase_strength: 2.0,
}

// Fat as fraction of total calories
const FAT_RATIO: Record<FitnessGoal, number> = {
  lose_weight:       0.28,
  build_muscle:      0.25,
  maintain:          0.27,
  improve_endurance: 0.22,
  increase_strength: 0.25,
}

// Static fallback when profile data is incomplete
export const STATIC_TARGETS: Record<FitnessGoal, MacroTargets> = {
  lose_weight:       { calories: 1800, protein_g: 160, carbs_g: 150, fat_g: 60 },
  build_muscle:      { calories: 2500, protein_g: 180, carbs_g: 250, fat_g: 80 },
  maintain:          { calories: 2200, protein_g: 150, carbs_g: 230, fat_g: 73 },
  improve_endurance: { calories: 2400, protein_g: 140, carbs_g: 280, fat_g: 65 },
  increase_strength: { calories: 2600, protein_g: 190, carbs_g: 260, fat_g: 85 },
}

function ageFromDob(dob: string): number {
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return Math.max(age, 1)
}

/**
 * Returns personalized macro targets using Mifflin-St Jeor (gender-neutral average).
 * Falls back to static table when weight, height, or date_of_birth are missing.
 */
export function calculateTargets(
  profile: Profile,
  weightKg: number | null,
): { targets: MacroTargets; isPersonalized: boolean } {
  const goal = profile.fitness_goal
  const hasData = !!weightKg && !!profile.height_cm && !!profile.date_of_birth

  if (!hasData) {
    return { targets: STATIC_TARGETS[goal], isPersonalized: false }
  }

  const age = ageFromDob(profile.date_of_birth!)
  // Mifflin-St Jeor with gender-neutral offset (average of male +5 and female -161)
  const bmr = 10 * weightKg! + 6.25 * profile.height_cm! - 5 * age - 78
  const tdee = bmr * ACTIVITY_MULTIPLIERS[profile.activity_level]
  const calories = Math.max(1200, Math.round(tdee + GOAL_CAL_DELTA[goal]))

  const protein_g = Math.round(weightKg! * PROTEIN_PER_KG[goal])
  const fat_g = Math.round((calories * FAT_RATIO[goal]) / 9)
  const carbs_g = Math.max(50, Math.round((calories - protein_g * 4 - fat_g * 9) / 4))

  return { targets: { calories, protein_g, carbs_g, fat_g }, isPersonalized: true }
}
