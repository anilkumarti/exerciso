'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { Search } from 'lucide-react'
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
  // Per-instance debounce timer; a module/global timer would be shared across
  // mounts and cancel the wrong pending search.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    },
    []
  )

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
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search exercises…"
          defaultValue={currentSearch}
          className="h-11 pl-9 text-base"
          onChange={(e) => {
            const val = e.target.value
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(
              () => updateParam('search', val || null),
              300
            )
          }}
        />
      </div>

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
        'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {label}
    </button>
  )
}
