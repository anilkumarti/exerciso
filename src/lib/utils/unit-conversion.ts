import type { WeightUnit } from '@/types/profile'

const KG_TO_LBS = 2.20462
const LBS_TO_KG = 0.453592

export function kgToLbs(kg: number): number {
  return kg * KG_TO_LBS
}

export function lbsToKg(lbs: number): number {
  return lbs * LBS_TO_KG
}

/** Round to nearest 0.5 lbs for clean display */
export function displayWeight(kg: number, unit: WeightUnit): number {
  if (unit === 'kg') return Math.round(kg * 4) / 4 // nearest 0.25 kg
  const lbs = kgToLbs(kg)
  return Math.round(lbs * 2) / 2 // nearest 0.5 lbs
}

export function displayWeightLabel(unit: WeightUnit): string {
  return unit === 'kg' ? 'kg' : 'lbs'
}

/** Convert user input (in their preferred unit) back to kg for storage */
export function inputToKg(value: number, unit: WeightUnit): number {
  if (unit === 'kg') return value
  return lbsToKg(value)
}

/** Weight increment step for +/- buttons based on unit */
export function weightIncrement(unit: WeightUnit, bodyRegion: 'upper' | 'lower' | 'core' = 'upper'): number {
  if (unit === 'lbs') {
    return bodyRegion === 'lower' ? 10 : 5
  }
  return bodyRegion === 'lower' ? 5 : 2.5
}

/** Progressive overload suggestion increment in user's unit */
export function progressionIncrement(unit: WeightUnit, bodyRegion: 'upper' | 'lower' | 'core'): number {
  if (unit === 'lbs') {
    return bodyRegion === 'lower' ? 10 : 5
  }
  return bodyRegion === 'lower' ? 5 : 2.5
}
