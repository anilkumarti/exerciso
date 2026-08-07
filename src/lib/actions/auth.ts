'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Name is required').max(50, 'Name too long'),
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type AuthActionState = {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
  /** Submitted values echoed back so forms can pre-fill on error */
  values?: Record<string, string>
  /** Changes each submission so defaultValue re-applies after remount */
  _key?: number
}

export async function login(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: 'Invalid email or password' }
  }

  redirect('/dashboard')
}

export async function signup(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    displayName: formData.get('displayName') as string,
  }

  const savedValues = { displayName: raw.displayName, email: raw.email }

  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values: savedValues, _key: Date.now() }
  }

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    const msg = error.message.toLowerCase()
    const message = msg.includes('invalid')
      ? 'Please enter a valid email address'
      : msg.includes('already registered') || msg.includes('user already registered')
        ? 'An account with this email already exists'
        : msg.includes('rate limit')
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : error.message
    return { error: message, values: savedValues, _key: Date.now() }
  }

  // Session is present when email confirmation is disabled — go straight to dashboard.
  // Fall back to the confirm-email prompt if Supabase still requires verification.
  if (data.session) {
    redirect('/dashboard')
  }
  redirect('/login?confirmed=1')
}

export async function forgotPassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = { email: formData.get('email') as string }

  const parsed = forgotPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Check your email for a password reset link' }
}

export async function resetPassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = resetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) {
    return { error: error.message }
  }

  redirect('/login?reset=1')
}

export async function logout(): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
