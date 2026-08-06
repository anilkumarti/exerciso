'use client'

import { useCallback, useEffect } from 'react'
import { X, Check, Lightbulb, Play, Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Exercise, AlternateExercise, Difficulty } from './exercise-card'

const DIFFICULTY_CHIP: Record<Difficulty, string> = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

function AlternateThumbnail({
  alt,
  onPlay,
}: {
  alt: AlternateExercise
  onPlay: () => void
}) {
  if (alt.youtubeId) {
    return (
      <button
        type="button"
        className="group relative block w-full overflow-hidden rounded-lg bg-black"
        onClick={onPlay}
        aria-label={`Watch ${alt.name} tutorial`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${alt.youtubeId}/mqdefault.jpg`}
          alt={`${alt.name} demonstration`}
          className="w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
          style={{ aspectRatio: '16/9' }}
          loading="lazy"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <Play className="size-4 translate-x-0.5 fill-white text-white" />
          </span>
        </span>
        <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1 py-0.5 text-[0.6rem] font-medium text-white">
          Watch
        </span>
      </button>
    )
  }

  return (
    <div
      className="flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-muted/80 to-muted"
      style={{ aspectRatio: '16/9' }}
    >
      <Dumbbell className="size-6 text-muted-foreground/25" />
    </div>
  )
}

interface AlternatesModalProps {
  exercise: Exercise
  onClose: () => void
  onWatchVideo: (youtubeId: string, title: string) => void
}

export function AlternatesModal({ exercise, onClose, onWatchVideo }: AlternatesModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prev
    }
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
              Alternatives to
            </p>
            <h2 className="text-base font-bold leading-tight">{exercise.name}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable card grid */}
        <div className="overflow-y-auto p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {exercise.alternates.map(alt => (
              <div key={alt.name} className="surface flex flex-col gap-2.5 overflow-hidden p-0">
                {/* Thumbnail */}
                <div className="px-3 pt-3">
                  <AlternateThumbnail
                    alt={alt}
                    onPlay={() => alt.youtubeId && onWatchVideo(alt.youtubeId, alt.name)}
                  />
                </div>

                {/* Card body */}
                <div className="flex flex-col gap-2.5 px-3 pb-3">
                  {/* Name + difficulty */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug">{alt.name}</h3>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', DIFFICULTY_CHIP[alt.difficulty])}>
                      {alt.difficulty}
                    </span>
                  </div>

                  {/* Muscle chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {alt.muscles.map(m => (
                      <span key={m} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground">{alt.description}</p>

                  {/* Benefits */}
                  <div>
                    <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-foreground">
                      Key Benefits
                    </p>
                    <ul className="flex flex-col gap-1">
                      {alt.benefits.map((b, i) => (
                        <li key={i} className="flex gap-1.5 text-xs text-muted-foreground">
                          <Check className="mt-0.5 size-3 shrink-0 text-green-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* When to choose */}
                  <div className="mt-auto flex gap-1.5 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                    <Lightbulb className="mt-px size-3 shrink-0" />
                    <span>
                      <span className="font-semibold">Choose when: </span>
                      {alt.whenToChoose}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
