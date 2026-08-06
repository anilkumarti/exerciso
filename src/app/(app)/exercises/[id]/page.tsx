import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExercise } from '@/lib/queries/exercises'
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS } from '@/types/exercises'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExerciseDetailPage({ params }: PageProps) {
  const { id } = await params
  const exercise = await getExercise(id)

  if (!exercise) notFound()

  const primaryMuscles = exercise.muscles?.filter((m) => m.is_primary) ?? []
  const secondaryMuscles = exercise.muscles?.filter((m) => !m.is_primary) ?? []
  const primaryVideo = exercise.videos?.find((v) => v.is_primary) ?? exercise.videos?.[0]

  return (
    <div className="flex flex-col">
      {/* Back nav */}
      <div className="flex items-center gap-2 border-b border-border px-4 pb-3 pt-safe">
        <Link
          href="/exercises"
          className="touch-target -ml-2 flex items-center gap-1 text-sm text-muted-foreground"
          aria-label="Back to exercises"
        >
          ← Back
        </Link>
      </div>

      <div className="space-y-6 px-4 py-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold">{exercise.name}</h1>
          {exercise.description && (
            <p className="mt-2 text-muted-foreground">{exercise.description}</p>
          )}
        </div>

        {/* YouTube video thumbnail */}
        {primaryVideo && (
          <a
            href={`https://www.youtube.com/watch?v=${primaryVideo.youtube_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl"
          >
            <img
              src={`https://img.youtube.com/vi/${primaryVideo.youtube_id}/mqdefault.jpg`}
              alt={primaryVideo.title ?? `${exercise.name} demo`}
              className="w-full object-cover"
              loading="lazy"
            />
            {primaryVideo.title && (
              <p className="mt-1 text-xs text-muted-foreground">{primaryVideo.title}</p>
            )}
          </a>
        )}

        {/* Muscles */}
        {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
          <div className="space-y-3">
            <h2 className="font-semibold">Muscles</h2>
            {primaryMuscles.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Primary
                </p>
                <div className="flex flex-wrap gap-2">
                  {primaryMuscles.map((m) => (
                    <span
                      key={m.muscle_group}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {MUSCLE_GROUP_LABELS[m.muscle_group]}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {secondaryMuscles.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Secondary
                </p>
                <div className="flex flex-wrap gap-2">
                  {secondaryMuscles.map((m) => (
                    <span
                      key={m.muscle_group}
                      className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                    >
                      {MUSCLE_GROUP_LABELS[m.muscle_group]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Equipment */}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-semibold">Equipment</h2>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map((e) => (
                <span
                  key={e.equipment_type}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                >
                  {EQUIPMENT_LABELS[e.equipment_type]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {exercise.instructions && (
          <div className="space-y-2">
            <h2 className="font-semibold">How to perform</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {exercise.instructions}
            </p>
          </div>
        )}

        {/* Alternatives */}
        {exercise.alternatives && exercise.alternatives.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold">Alternatives</h2>
            <div className="space-y-2">
              {exercise.alternatives.map((alt) => (
                <Link
                  key={alt.id}
                  href={`/exercises/${alt.id}`}
                  className="block rounded-xl border border-border bg-card px-4 py-3"
                >
                  <p className="font-medium">{alt.name}</p>
                  {alt.muscles && alt.muscles.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {alt.muscles
                        .filter((m) => m.is_primary)
                        .map((m) => MUSCLE_GROUP_LABELS[m.muscle_group])
                        .join(', ')}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
