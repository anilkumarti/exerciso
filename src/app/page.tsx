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
      {/* Ambient glow — clipped in its own overflow-hidden shell so it never
          causes horizontal scroll, and doesn't break sticky children */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-32 left-1/2 size-[40rem] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
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

      {/* ── Hero ticker ── */}
      <section className="border-b border-border bg-muted/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2">
          {/* Left: badge + tagline */}
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden shrink-0 rounded-full bg-primary/12 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-primary sm:inline-flex">
              Free forever · No credit card
            </span>
            <span className="hidden h-3.5 w-px shrink-0 bg-border sm:block" aria-hidden />
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              <span className="font-semibold text-foreground">Learn the moves. Track every workout.</span>
              <span className="hidden sm:inline">
                {' '}· Browse Push, Pull &amp; Legs tutorials free — no login required.
              </span>
            </p>
          </div>
          {/* Right: CTAs */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm" className="h-7 gap-1 px-3 text-xs">
                Get started
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
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
