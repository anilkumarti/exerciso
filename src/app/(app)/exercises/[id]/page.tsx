import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Play } from 'lucide-react'
import { getExercise } from '@/lib/queries/exercises'
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS } from '@/types/exercises'
import { PageShell, PageHeader } from '@/components/shared/page-shell'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExerciseDetailPage({ params }: PageProps) {
  const { id } = await params
  const exercise = await getExercise(id)

  if (!exercise) notFound()

  const primaryMuscles = exercise.muscles?.filter((m) => m.is_primary) ?? []
  const secondaryMuscles = exercise.muscles?.filter((m) => !m.is_primary) ?? []
  const primaryVideo =
    exercise.videos?.find((v) => v.is_primary) ?? exercise.videos?.[0]

  return (
    <PageShell>
      <PageHeader
        title={exercise.name}
        subtitle={exercise.description ?? undefined}
        backHref="/exercises"
      />

      <div className="flex flex-col gap-6">
        {/* Video */}
        {primaryVideo && (
          <a
            href={`https://www.youtube.com/watch?v=${primaryVideo.youtube_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group surface block overflow-hidden"
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${primaryVideo.youtube_id}/mqdefault.jpg`}
                alt={primaryVideo.title ?? `${exercise.name} demo`}
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-black shadow-raised">
                  <Play className="size-6 fill-current" />
                </span>
              </span>
            </div>
            {primaryVideo.title && (
              <p className="px-4 py-2.5 text-xs text-muted-foreground">
                {primaryVideo.title}
              </p>
            )}
          </a>
        )}

        {/* Muscles */}
        {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
          <section className="surface flex flex-col gap-3 p-4">
            <h2 className="text-sm font-semibold">Muscles worked</h2>
            {primaryMuscles.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
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
                <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
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
          </section>
        )}

        {/* Equipment */}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <section className="surface flex flex-col gap-2 p-4">
            <h2 className="text-sm font-semibold">Equipment</h2>
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
          </section>
        )}

        {/* Instructions */}
        {exercise.instructions && (
          <section className="surface flex flex-col gap-2 p-4">
            <h2 className="text-sm font-semibold">How to perform</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {exercise.instructions}
            </p>
          </section>
        )}

        {/* Alternatives */}
        {exercise.alternatives && exercise.alternatives.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold">Alternatives</h2>
            <ul className="surface divide-y divide-border overflow-hidden">
              {exercise.alternatives.map((alt) => (
                <li key={alt.id}>
                  <Link
                    href={`/exercises/${alt.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{alt.name}</p>
                      {alt.muscles && alt.muscles.length > 0 && (
                        <p className="truncate text-xs text-muted-foreground">
                          {alt.muscles
                            .filter((m) => m.is_primary)
                            .map((m) => MUSCLE_GROUP_LABELS[m.muscle_group])
                            .join(', ')}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PageShell>
  )
}
