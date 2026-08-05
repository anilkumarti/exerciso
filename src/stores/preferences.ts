'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeightUnit } from '@/types/profile'

interface PreferencesState {
  weightUnit: WeightUnit
  defaultRestSeconds: number
  autoStartTimer: boolean
  theme: 'dark' | 'light' | 'system'

  setWeightUnit: (unit: WeightUnit) => void
  setDefaultRestSeconds: (seconds: number) => void
  setAutoStartTimer: (enabled: boolean) => void
  setTheme: (theme: 'dark' | 'light' | 'system') => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      weightUnit: 'kg',
      defaultRestSeconds: 90,
      autoStartTimer: true,
      theme: 'system',

      setWeightUnit: (unit) => set({ weightUnit: unit }),
      setDefaultRestSeconds: (seconds) => set({ defaultRestSeconds: seconds }),
      setAutoStartTimer: (enabled) => set({ autoStartTimer: enabled }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'exerciso-preferences' }
  )
)
