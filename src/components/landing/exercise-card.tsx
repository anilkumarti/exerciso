'use client'

import { useState } from 'react'
import { Check, Play, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlternatesModal } from './alternates-modal'
import { VideoModal } from './video-modal'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type Category = 'push' | 'pull' | 'legs'

export interface AlternateExercise {
  name: string
  muscles: string[]
  difficulty: Difficulty
  description: string
  benefits: string[]
  whenToChoose: string
  youtubeId?: string
}

export interface Exercise {
  id: string
  name: string
  muscles: string[]
  difficulty: Difficulty
  description: string
  formTips: string[]
  youtubeId: string
  category: Category
  rating: number
  alternates: AlternateExercise[]
}

const CATEGORY_ACCENT = 'border-t-violet-500'

const CATEGORY_CHIP = 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'

const CATEGORY_BTN = 'border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/50'

const DIFFICULTY_CHIP: Record<Difficulty, string> = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

function ratingChip(r: number) {
  if (r >= 8) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
  if (r >= 6) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
}

interface ExerciseCardProps {
  exercise: Exercise
  onWatch: (exercise: Exercise) => void
}

export function ExerciseCard({ exercise, onWatch }: ExerciseCardProps) {
  const [showAlternates, setShowAlternates] = useState(false)
  const [altVideo, setAltVideo] = useState<{ id: string; title: string } | null>(null)

  return (
    <>
      <div
        className={cn(
          'surface flex flex-col border-t-2 transition-shadow duration-200 hover:shadow-raised',
          CATEGORY_ACCENT,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 p-4 pb-2">
          <h3 className="text-base font-semibold leading-snug">{exercise.name}</h3>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-bold tabular-nums',
                ratingChip(exercise.rating),
              )}
              title="Effectiveness rating"
            >
              {exercise.rating}/10
            </span>
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                DIFFICULTY_CHIP[exercise.difficulty],
              )}
            >
              {exercise.difficulty}
            </span>
          </div>
        </div>

        {/* Muscle chips */}
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {exercise.muscles.map(m => (
            <span
              key={m}
              className={cn('rounded-full px-2 py-0.5 text-xs font-medium', CATEGORY_CHIP)}
            >
              {m}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="px-4 pb-3 text-sm text-muted-foreground">
          {exercise.description}
        </p>

        {/* Form tips */}
        <div className="flex-1 border-t border-border px-4 py-3">
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-foreground">
            Key Form Tips
          </p>
          <ul className="flex flex-col gap-1.5">
            {exercise.formTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                <Check className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
          <Button
            variant="outline"
            size="sm"
            className={cn('w-full gap-2 font-medium', CATEGORY_BTN)}
            onClick={() => onWatch(exercise)}
          >
            <Play className="size-3.5 fill-current" />
            Watch Tutorial
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowAlternates(true)}
          >
            <Shuffle className="size-3.5" />
            Alternate Exercise
          </Button>
        </div>
      </div>

      {showAlternates && (
        <AlternatesModal
          exercise={exercise}
          onClose={() => setShowAlternates(false)}
          onWatchVideo={(id, title) => setAltVideo({ id, title })}
        />
      )}

      {altVideo && (
        <VideoModal
          youtubeId={altVideo.id}
          title={altVideo.title}
          onClose={() => setAltVideo(null)}
        />
      )}
    </>
  )
}
