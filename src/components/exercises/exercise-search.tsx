'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useOptimistic } from 'react'
import { Input } from '@/components/ui/input'
import type { MuscleGroup, EquipmentType } from '@/types/exercises'
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS } from '@/types/exercises'
import { cn } from '@/lib/utils'

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'forearms', 'core', 'glutes', 'quads', 'hamstrings', 'calves',
]

const EQUIPMENT_TYPES: EquipmentType[] = [
  'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell',
]

export function ExerciseSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentSearch = searchParams.get('search') ?? ''
  const currentMuscle = searchParams.get('muscle') as MuscleGroup | null
  const currentEquipment = searchParams.get('equipment') as EquipmentType | null

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="space-y-3">
      <Input
        type="search"
        placeholder="Search exercises…"
        defaultValue={currentSearch}
        className="h-11 text-base"
        onChange={(e) => {
          const val = e.target.value
          clearTimeout((globalThis as Record<string, unknown>)._exerciseSearchTimer as ReturnType<typeof setTimeout>)
          ;(globalThis as Record<string, unknown>)._exerciseSearchTimer = setTimeout(
            () => updateParam('search', val || null),
            300
          )
        }}
      />

      {/* Muscle filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <FilterChip
          label="All muscles"
          active={!currentMuscle}
          onClick={() => updateParam('muscle', null)}
        />
        {MUSCLE_GROUPS.map((m) => (
          <FilterChip
            key={m}
            label={MUSCLE_GROUP_LABELS[m]}
            active={currentMuscle === m}
            onClick={() => updateParam('muscle', currentMuscle === m ? null : m)}
          />
        ))}
      </div>

      {/* Equipment filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <FilterChip
          label="All equipment"
          active={!currentEquipment}
          onClick={() => updateParam('equipment', null)}
        />
        {EQUIPMENT_TYPES.map((e) => (
          <FilterChip
            key={e}
            label={EQUIPMENT_LABELS[e]}
            active={currentEquipment === e}
            onClick={() =>
              updateParam('equipment', currentEquipment === e ? null : e)
            }
          />
        ))}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'touch-target shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted'
      )}
    >
      {label}
    </button>
  )
}
