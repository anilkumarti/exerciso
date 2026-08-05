'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SessionExercise, ExerciseSet, WorkoutPlanDay } from '@/types/workout'

export interface ActiveSessionExercise extends SessionExercise {
  sets: ExerciseSet[]
}

type SessionStatus = 'idle' | 'active' | 'completing'

interface WorkoutSessionState {
  // Session metadata
  sessionId: string | null
  planId: string | null
  planDayId: string | null
  planDayName: string | null
  startedAt: string | null // ISO string (serializable)
  status: SessionStatus

  // Exercises with their sets
  exercises: ActiveSessionExercise[]
  currentExerciseIndex: number

  // Actions — implemented in Phase 2
  initSession: (params: {
    sessionId: string
    planId: string | null
    planDayId: string | null
    planDayName: string | null
    exercises: ActiveSessionExercise[]
  }) => void
  setStatus: (status: SessionStatus) => void
  updateSet: (exerciseIndex: number, setId: string, updates: Partial<ExerciseSet>) => void
  addSet: (exerciseIndex: number, set: ExerciseSet) => void
  markExerciseSkipped: (exerciseIndex: number) => void
  substituteExercise: (exerciseIndex: number, replacement: ActiveSessionExercise) => void
  setCurrentExercise: (index: number) => void
  resetSession: () => void
}

const initialState = {
  sessionId: null,
  planId: null,
  planDayId: null,
  planDayName: null,
  startedAt: null,
  status: 'idle' as SessionStatus,
  exercises: [],
  currentExerciseIndex: 0,
}

export const useWorkoutSessionStore = create<WorkoutSessionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initSession: ({ sessionId, planId, planDayId, planDayName, exercises }) =>
        set({
          sessionId,
          planId,
          planDayId,
          planDayName,
          startedAt: new Date().toISOString(),
          status: 'active',
          exercises,
          currentExerciseIndex: 0,
        }),

      setStatus: (status) => set({ status }),

      updateSet: (exerciseIndex, setId, updates) =>
        set((state) => ({
          exercises: state.exercises.map((ex, i) =>
            i !== exerciseIndex
              ? ex
              : {
                  ...ex,
                  sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)),
                }
          ),
        })),

      addSet: (exerciseIndex, newSet) =>
        set((state) => ({
          exercises: state.exercises.map((ex, i) =>
            i !== exerciseIndex ? ex : { ...ex, sets: [...ex.sets, newSet] }
          ),
        })),

      markExerciseSkipped: (exerciseIndex) =>
        set((state) => ({
          exercises: state.exercises.map((ex, i) =>
            i !== exerciseIndex ? ex : { ...ex, was_skipped: true }
          ),
        })),

      substituteExercise: (exerciseIndex, replacement) =>
        set((state) => ({
          exercises: state.exercises.map((ex, i) => {
            if (i !== exerciseIndex) return ex
            // Mark original as skipped, insert replacement in its place
            return replacement
          }),
        })),

      setCurrentExercise: (index) => set({ currentExerciseIndex: index }),

      resetSession: () => set(initialState),
    }),
    { name: 'exerciso-active-session' }
  )
)
