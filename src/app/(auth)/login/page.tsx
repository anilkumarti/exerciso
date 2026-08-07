'use client'

import { Suspense } from 'react'
import { useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login } from '@/lib/actions/auth'
import { AuthField } from '@/components/auth/auth-field'
import { SubmitButton } from '@/components/auth/submit-button'

function ParamBanners() {
  const params = useSearchParams()
  return (
    <>
      {params.get('confirmed') && (
        <p className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
          Account created! Check your email to confirm, then sign in.
        </p>
      )}
      {params.get('reset') && (
        <p className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
          Password updated. Sign in with your new password.
        </p>
      )}
      {params.get('error') === 'confirmation_failed' && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Confirmation link expired or invalid. Please sign up again.
        </p>
      )}
    </>
  )
}

export default function LoginPage() {
  const [state, action] = useActionState(login, {})

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <Suspense>
        <ParamBanners />
      </Suspense>

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

        <AuthField
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          errors={state.fieldErrors?.password}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton label="Sign in" loadingLabel="Signing in…" />
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
