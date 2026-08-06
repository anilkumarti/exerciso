import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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
      className="surface block p-4 transition-colors hover:bg-muted/40 active:bg-muted/60"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{exercise.name}</p>
          {primaryMuscles.length > 0 && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {primaryMuscles
                .map((m) => MUSCLE_GROUP_LABELS[m.muscle_group])
                .join(', ')}
            </p>
          )}
        </div>
        {equipment && (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {EQUIPMENT_LABELS[equipment.equipment_type]}
          </span>
        )}
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      </div>

      {exercise.description && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {exercise.description}
        </p>
      )}
    </Link>
  )
}
