'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  label: string
  loadingLabel?: string
}

export function SubmitButton({ label, loadingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-12 w-full text-base font-semibold"
    >
      {pending ? (loadingLabel ?? label) : label}
    </Button>
  )
}
