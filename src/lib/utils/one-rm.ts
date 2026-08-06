/**
 * Epley formula: estimated 1RM = weight × (1 + reps / 30)
 * Guard: returns null if reps <= 0 or weight <= 0 to prevent false PRs.
 */
export function epley1RM(weightKg: number, reps: number): number | null {
  if (reps <= 0 || weightKg <= 0) return null
  if (reps === 1) return weightKg // true max — no calculation needed
  return weightKg * (1 + reps / 30)
}

/**
 * Weight bucket for max_reps_at_weight PR comparisons.
 * Snaps to nearest 0.25 kg to absorb lbs→kg rounding drift.
 */
export function weightBucket(weightKg: number): number {
  return Math.round(weightKg * 4) / 4
}
