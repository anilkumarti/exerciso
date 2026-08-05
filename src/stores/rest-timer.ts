'use client'

import { create } from 'zustand'

export const REST_TIMER_PRESETS = [60, 90, 120, 180] as const

interface RestTimerState {
  isRunning: boolean
  duration: number
  remaining: number
  startedAt: Date | null
  selectedPreset: number

  start: (durationSeconds: number) => void
  pause: () => void
  resume: () => void
  reset: () => void
  tick: () => void
  setPreset: (seconds: number) => void
}

export const useRestTimerStore = create<RestTimerState>()((set, get) => ({
  isRunning: false,
  duration: 90,
  remaining: 90,
  startedAt: null,
  selectedPreset: 90,

  start: (durationSeconds) =>
    set({
      isRunning: true,
      duration: durationSeconds,
      remaining: durationSeconds,
      startedAt: new Date(),
    }),

  pause: () => set({ isRunning: false }),

  resume: () => set({ isRunning: true }),

  reset: () => {
    const { duration } = get()
    set({ isRunning: false, remaining: duration, startedAt: null })
  },

  tick: () => {
    const { remaining, isRunning } = get()
    if (!isRunning) return
    if (remaining <= 0) {
      set({ isRunning: false, remaining: 0 })
      return
    }
    set({ remaining: remaining - 1 })
  },

  setPreset: (seconds) =>
    set({ selectedPreset: seconds, duration: seconds, remaining: seconds, isRunning: false }),
}))
