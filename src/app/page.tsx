import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Dumbbell } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ExerciseLibrary } from '@/components/landing/exercise-library'

export default async function LandingPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="relative flex min-h-svh flex-col">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-24 left-1/2 size-[36rem] -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--grad-from), var(--grad-to))' }}
        />
      </div>

      {/* ── Header ── */}
      <header className="pt-safe sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 font-bold tracking-tight">
            <span className="bg-brand-gradient flex size-8 items-center justify-center rounded-xl text-white">
              <Dumbbell className="size-4" />
            </span>
            Exerciso
          </span>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm" className="h-8 gap-1.5 px-3 text-xs">
                Get started
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Intro ── */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-2 pt-7">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Learn the moves.{' '}
          <span className="text-brand-gradient">Track every workout.</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Browse Push, Pull &amp; Legs tutorials — no account needed.{' '}
          <Link href="/login" className="font-semibold text-foreground underline-offset-2 hover:underline">
            Already training? Sign in →
          </Link>
        </p>
      </section>

      {/* ── Exercise library (Push / Pull / Legs) ── */}
      <ExerciseLibrary />

      {/* ── Bottom CTA ── */}
      <section className="animate-rise mx-auto w-full max-w-4xl px-4 pb-16">
        <div className="bg-brand-gradient shadow-hero flex flex-col items-center gap-4 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold">Ready to start training?</h2>
          <p className="max-w-sm text-sm opacity-90">
            Build workout plans, log every set in real time, and watch your
            strength history grow — all in one place.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="h-11 bg-white px-8 text-[color:var(--grad-from)] hover:bg-white/90"
            >
              Create free account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
