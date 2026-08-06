'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/lib/actions/auth'
import { AuthField } from '@/components/auth/auth-field'
import { SubmitButton } from '@/components/auth/submit-button'

export default function ForgotPasswordPage() {
  const [state, action] = useActionState(forgotPassword, {})

  if (state.success) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">{state.success}</p>
        </div>
        <Link
          href="/login"
          className="block text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      <form action={action} className="space-y-4">
        {state.error && (
          <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <AuthField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          required
          errors={state.fieldErrors?.email}
        />

        <SubmitButton label="Send reset link" loadingLabel="Sending…" />
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
