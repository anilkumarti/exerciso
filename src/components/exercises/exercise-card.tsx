import Link from 'next/link'
import type { Exercise } from '@/types/exercises'
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS } from '@/types/exercises'

interface ExerciseCardProps {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const primaryMuscles = exercise.muscles?.filter((m) => m.is_primary) ?? []
  const equipment = exercise.equipment?.[0]

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="block rounded-xl border border-border bg-card p-4 active:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{exercise.name}</p>
          {primaryMuscles.length > 0 && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {primaryMuscles.map((m) => MUSCLE_GROUP_LABELS[m.muscle_group]).join(', ')}
            </p>
          )}
        </div>
        {equipment && (
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {EQUIPMENT_LABELS[equipment.equipment_type]}
          </span>
        )}
      </div>

      {exercise.description && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {exercise.description}
        </p>
      )}
    </Link>
  )
}
