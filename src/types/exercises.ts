export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms'
  | 'core' | 'glutes' | 'quads' | 'hamstrings' | 'calves' | 'full_body'

export type EquipmentType =
  | 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight'
  | 'kettlebell' | 'resistance_band' | 'smith_machine' | 'other'

export interface ExerciseMuscle {
  muscle_group: MuscleGroup
  is_primary: boolean
}

export interface ExerciseEquipment {
  equipment_type: EquipmentType
}

export interface ExerciseVideo {
  id: string
  youtube_id: string
  title: string | null
  is_primary: boolean
}

export interface Exercise {
  id: string
  name: string
  description: string | null
  instructions: string | null
  is_custom: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  muscles?: ExerciseMuscle[]
  equipment?: ExerciseEquipment[]
  videos?: ExerciseVideo[]
}

export interface ExerciseWithAlternatives extends Exercise {
  alternatives?: Exercise[]
}

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  core: 'Core',
  glutes: 'Glutes',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
  full_body: 'Full Body',
}

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  cable: 'Cable',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  kettlebell: 'Kettlebell',
  resistance_band: 'Band',
  smith_machine: 'Smith Machine',
  other: 'Other',
}

export const MUSCLE_GROUP_UPPER: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
]
export const MUSCLE_GROUP_LOWER: MuscleGroup[] = [
  'glutes', 'quads', 'hamstrings', 'calves',
]
