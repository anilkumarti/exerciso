import { Suspense } from 'react'
import { getExercises } from '@/lib/queries/exercises'
import { ExerciseSearch } from '@/components/exercises/exercise-search'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import type { MuscleGroup, EquipmentType } from '@/types/exercises'

interface PageProps {
  searchParams: Promise<{
    search?: string
    muscle?: string
    equipment?: string
  }>
}

export default async function ExercisesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const exercises = await getExercises({
    search: params.search,
    muscle: params.muscle as MuscleGroup | undefined,
    equipment: params.equipment as EquipmentType | undefined,
  })

  return (
    <div className="flex flex-col gap-0">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 pb-3 pt-safe">
        <h1 className="mb-3 pt-4 text-xl font-bold">Exercises</h1>
        <Suspense>
          <ExerciseSearch />
        </Suspense>
      </div>

      {/* Exercise list */}
      <div className="px-4 py-4">
        {exercises.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-muted-foreground">No exercises found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            </p>
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
