'use client'

import { useRef } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function AddExerciseSearch({ defaultValue }: { defaultValue?: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <form ref={formRef} className="mb-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={defaultValue ?? ''}
          placeholder="Search exercises…"
          autoFocus
          className="h-11 pl-9 text-base"
          onChange={(e) => {
            if (timerRef.current) clearTimeout(timerRef.current)
            const val = e.target.value
            timerRef.current = setTimeout(() => {
              if (formRef.current) formRef.current.requestSubmit()
            }, 350)
          }}
        />
      </div>
    </form>
  )
}
