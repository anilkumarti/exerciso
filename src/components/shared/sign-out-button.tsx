'use client'

import { useFormStatus } from 'react-dom'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      variant="ghost"
      disabled={pending}
      className="h-11 w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="size-4" />
      {pending ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}

export function SignOutButton() {
  return (
    <form action={logout}>
      <SubmitButton />
    </form>
  )
}
