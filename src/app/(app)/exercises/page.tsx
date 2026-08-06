import { Suspense } from 'react'
import { SearchX } from 'lucide-react'
import { getExercises } from '@/lib/queries/exercises'
import { ExerciseSearch } from '@/components/exercises/exercise-search'
import { ExerciseCard } from '@/components/exercises/exercise-card'
import { EmptyState } from '@/components/shared/page-shell'
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
    <div className="flex flex-col">
      {/* Sticky search header */}
      <div className="glass pt-safe sticky top-0 z-20 border-b border-border">
        <div className="mx-auto w-full max-w-lg px-4 pb-3">
          <h1 className="pt-7 pb-3 text-[1.75rem] leading-tight font-bold">
            Exercises
          </h1>
          <Suspense>
            <ExerciseSearch />
          </Suspense>
        </div>
      </div>

      {/* Exercise list */}
      <div className="mx-auto w-full max-w-lg px-4 py-4">
        {exercises.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No exercises found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="animate-rise space-y-3">
            <p className="px-1 text-sm text-muted-foreground">
              {exercises.length}{' '}
              {exercises.length === 1 ? 'exercise' : 'exercises'}
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
