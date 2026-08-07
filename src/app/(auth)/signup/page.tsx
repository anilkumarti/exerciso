'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/lib/actions/auth'
import { AuthField } from '@/components/auth/auth-field'
import { SubmitButton } from '@/components/auth/submit-button'
import { GoogleButton } from '@/components/auth/google-button'

export default function SignupPage() {
  const [state, action] = useActionState(signup, {})

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="text-sm text-muted-foreground">Start tracking your fitness journey</p>
      </div>

      <GoogleButton />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form key={state._key} action={action} className="space-y-4">
        {state.error && (
          <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <AuthField
          id="displayName"
          name="displayName"
          label="Name"
          placeholder="Your name"
          autoComplete="name"
          required
          defaultValue={state.values?.displayName}
          errors={state.fieldErrors?.displayName}
        />

        <AuthField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={state.values?.email}
          errors={state.fieldErrors?.email}
        />

        <AuthField
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          errors={state.fieldErrors?.password}
        />

        <SubmitButton label="Create account" loadingLabel="Creating account…" />
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
