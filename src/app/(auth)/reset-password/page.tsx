'use client'

import { useActionState } from 'react'
import { resetPassword } from '@/lib/actions/auth'
import { AuthField } from '@/components/auth/auth-field'
import { SubmitButton } from '@/components/auth/submit-button'

export default function ResetPasswordPage() {
  const [state, action] = useActionState(resetPassword, {})

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Set new password</h1>
        <p className="text-sm text-muted-foreground">Choose a new password for your account</p>
      </div>

      <form action={action} className="space-y-4">
        {state.error && (
          <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <AuthField
          id="password"
          name="password"
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          errors={state.fieldErrors?.password}
        />

        <SubmitButton label="Update password" loadingLabel="Updating…" />
      </form>
    </div>
  )
}
