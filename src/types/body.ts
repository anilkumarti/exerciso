export type PhotoAngle = 'front' | 'back' | 'side_left' | 'side_right' | 'other'

export interface WeightEntry {
  id: string
  user_id: string
  weight_kg: number
  recorded_at: string
  notes: string | null
}

export interface BodyMeasurement {
  id: string
  user_id: string
  recorded_at: string // date
  chest_cm: number | null
  waist_cm: number | null
  hips_cm: number | null
  left_arm_cm: number | null
  right_arm_cm: number | null
  left_thigh_cm: number | null
  right_thigh_cm: number | null
  left_calf_cm: number | null
  right_calf_cm: number | null
  neck_cm: number | null
  shoulders_cm: number | null
  body_fat_percentage: number | null
  custom_measurements: { label: string; value_cm: number }[] | null
  notes: string | null
}

export interface ProgressPhoto {
  id: string
  user_id: string
  storage_path: string
  angle: PhotoAngle
  recorded_at: string // date
  measurement_id: string | null
  notes: string | null
  signed_url?: string // populated when serving
}

export interface Goal {
  id: string
  user_id: string
  goal_type:
    | 'weight_loss'
    | 'weight_gain'
    | 'strength_pr'
    | 'consistency'
    | 'body_comp'
    | 'custom'
  title: string
  description: string | null
  target_value: number | null
  unit: string | null
  start_date: string
  target_date: string | null
  is_active: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}
