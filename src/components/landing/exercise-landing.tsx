'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronRight, CircleAlert, Dumbbell, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ExerciseCard, type Exercise, type Category } from './exercise-card'
import { EXERCISES } from './exercise-library'
import { VideoModal } from './video-modal'

// ---------------------------------------------------------------------------
// Types & config
// ---------------------------------------------------------------------------
type SectionId = 'exercises' | 'dos-donts' | 'mistakes' | 'progression' | 'alternatives'

const NAV_ITEMS: { id: SectionId; label: string; emoji: string }[] = [
  { id: 'exercises',    label: 'Exercises',        emoji: '🏋️' },
  { id: 'dos-donts',   label: "Do's & Don'ts",     emoji: '✅' },
  { id: 'mistakes',    label: 'Common Mistakes',   emoji: '⚠️' },
  { id: 'progression', label: 'Progression Tips',  emoji: '📈' },
  { id: 'alternatives',label: 'Alternatives',      emoji: '🔄' },
]

const CATEGORY_TABS: { id: Category; label: string; emoji: string }[] = [
  { id: 'push', label: 'Push', emoji: '💪' },
  { id: 'pull', label: 'Pull', emoji: '🏋️' },
  { id: 'legs', label: 'Legs', emoji: '🦵' },
]

const SECTION_DESCRIPTIONS: Record<SectionId, string> = {
  exercises:    'Browse tutorials and form tips for the most effective exercises in each category.',
  'dos-donts':  'Learn exactly what to focus on — and what to avoid — for safe, effective reps.',
  mistakes:     'Spot and correct the most common errors before they become bad habits.',
  progression:  'Strategies to safely add weight, reps, and difficulty over time.',
  alternatives: 'Find easier, harder, or similarly targeted swaps for every exercise.',
}

const DIFFICULTY_CHIP: Record<string, string> = {
  Beginner:     'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Advanced:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

// ---------------------------------------------------------------------------
// Section views
// ---------------------------------------------------------------------------
function ExercisesSection({
  exercises,
  onWatch,
}: {
  exercises: Exercise[]
  onWatch: (ex: Exercise) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {exercises.map(ex => (
        <ExerciseCard key={ex.id} exercise={ex} onWatch={onWatch} />
      ))}
    </div>
  )
}

function DosAndDontsSection({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="flex flex-col gap-5">
      {exercises.map(ex => (
        <div key={ex.id} className="surface overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-semibold">{ex.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{ex.muscles.join(' · ')}</p>
          </div>
          <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 divide-border">
            <div className="p-4">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green-600 dark:text-green-400">
                <Check className="size-3.5" />
                Do
              </p>
              <ul className="flex flex-col gap-2">
                {(ex.dos ?? ex.formTips).map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                <X className="size-3.5" />
                Don't
              </p>
              {ex.donts && ex.donts.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {ex.donts.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400">
                        ✕
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Avoid any form breakdown shown in the form tips.</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MistakesSection({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="flex flex-col gap-5">
      {exercises.map(ex => (
        <div key={ex.id} className="surface overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-semibold">{ex.name}</h3>
          </div>
          {ex.commonMistakes && ex.commonMistakes.length > 0 ? (
            <ul className="divide-y divide-border">
              {ex.commonMistakes.map((item, i) => (
                <li key={i} className="flex gap-3 p-4">
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                    <CircleAlert className="size-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.mistake}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-semibold text-green-600 dark:text-green-400">Fix: </span>
                      {item.correction}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-muted-foreground">See the form tips for guidance on this exercise.</p>
          )}
        </div>
      ))}
    </div>
  )
}

function ProgressionSection({ exercises }: { exercises: Exercise[] }) {
  return (
    <div className="flex flex-col gap-5">
      {exercises.map(ex => (
        <div key={ex.id} className="surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-semibold">{ex.name}</h3>
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', DIFFICULTY_CHIP[ex.difficulty])}>
              {ex.difficulty}
            </span>
          </div>
          {ex.progressionTips && ex.progressionTips.length > 0 ? (
            <ul className="divide-y divide-border">
              {ex.progressionTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-muted-foreground">Progress gradually with consistent form improvements.</p>
          )}
        </div>
      ))}
    </div>
  )
}

function AlternativesSection({
  exercises,
  onWatch,
}: {
  exercises: Exercise[]
  onWatch: (id: string, title: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {exercises.map(ex => (
        <div key={ex.id} className="surface overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-semibold">{ex.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {ex.alternates.length} alternative{ex.alternates.length !== 1 ? 's' : ''}
            </p>
          </div>
          <ul className="divide-y divide-border">
            {ex.alternates.map((alt, i) => (
              <li key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{alt.name}</p>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', DIFFICULTY_CHIP[alt.difficulty])}>
                        {alt.difficulty}
                      </span>
                    </div>
                    <p className="mb-1.5 text-xs text-muted-foreground">{alt.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Best when: </span>
                      {alt.whenToChoose}
                    </p>
                  </div>
                  {alt.youtubeId && (
                    <button
                      onClick={() => {
                        const yid = alt.youtubeId
                        if (yid) onWatch(yid, alt.name)
                      }}
                      className="shrink-0 flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/60"
                    >
                      ▶ Watch
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ExerciseLanding() {
  const [activeSection, setActiveSection] = useState<SectionId>('exercises')
  const [activeCategory, setActiveCategory] = useState<Category>('push')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [watchVideo, setWatchVideo] = useState<{ id: string; title: string } | null>(null)

  const filtered = EXERCISES.filter(e => e.category === activeCategory)

  function handleNavChange(section: SectionId) {
    setActiveSection(section)
    setSidebarOpen(false)
  }

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
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          {/* Logo */}
          <span className="flex shrink-0 items-center gap-2 font-bold tracking-tight">
            <span className="bg-brand-gradient flex size-8 items-center justify-center rounded-xl text-white">
              <Dumbbell className="size-4" />
            </span>
            Exerciso
          </span>

          {/* Desktop nav — 5 section items */}
          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavChange(item.id)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                  activeSection === item.id
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span className="mr-1">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: auth buttons (desktop) + hamburger (mobile) */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:block"
            >
              Sign in
            </Link>
            <Link href="/signup" className="hidden lg:block">
              <Button size="sm" className="h-8 gap-1.5 px-3 text-xs">
                Get started
                <ArrowRight className="size-3" />
              </Button>
            </Link>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile sidebar ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300 lg:hidden',
          sidebarOpen ? 'visible' : 'invisible pointer-events-none',
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300',
            sidebarOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Drawer */}
        <div
          className={cn(
            'absolute right-0 top-0 flex h-full w-72 flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out',
            sidebarOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <span className="text-sm font-semibold">Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1 p-3">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavChange(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  activeSection === item.id
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span className="text-base">{item.emoji}</span>
                <span className="flex-1">{item.label}</span>
                {activeSection === item.id && (
                  <ChevronRight className="size-3.5 text-violet-500" />
                )}
              </button>
            ))}
          </nav>

          {/* Auth buttons at bottom */}
          <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
            <Link href="/signup" className="w-full">
              <Button size="sm" className="w-full gap-1.5">
                Get started
                <ArrowRight className="size-3" />
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Intro ── */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-2 pt-7">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Learn the moves.{' '}
          <span className="text-brand-gradient">Track every workout.</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Browse Push, Pull &amp; Legs tutorials — no account needed.{' '}
          <Link
            href="/login"
            className="font-semibold text-foreground underline-offset-2 hover:underline"
          >
            Already training? Sign in →
          </Link>
        </p>
      </section>

      {/* ── Category tabs (sticky, always shown) ── */}
      <div className="sticky top-[57px] z-10 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl px-4">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              data-active={activeCategory === tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent py-3 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground',
                'data-[active=true]:border-violet-500 data-[active=true]:text-violet-600 dark:data-[active=true]:text-violet-400',
              )}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section description ── */}
      <div className="mx-auto w-full max-w-4xl px-4 pt-5 pb-1">
        <p className="text-sm text-muted-foreground">{SECTION_DESCRIPTIONS[activeSection]}</p>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-4">
        {activeSection === 'exercises' && (
          <ExercisesSection
            exercises={filtered}
            onWatch={ex => setWatchVideo({ id: ex.youtubeId, title: `${ex.name} — Tutorial` })}
          />
        )}
        {activeSection === 'dos-donts' && (
          <DosAndDontsSection exercises={filtered} />
        )}
        {activeSection === 'mistakes' && (
          <MistakesSection exercises={filtered} />
        )}
        {activeSection === 'progression' && (
          <ProgressionSection exercises={filtered} />
        )}
        {activeSection === 'alternatives' && (
          <AlternativesSection
            exercises={filtered}
            onWatch={(id, title) => setWatchVideo({ id, title })}
          />
        )}
      </div>

      {/* ── Bottom CTA ── */}
      <section className="animate-rise mx-auto w-full max-w-4xl px-4 pb-16">
        <div className="bg-brand-gradient shadow-hero flex flex-col items-center gap-4 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold">Ready to start training?</h2>
          <p className="max-w-sm text-sm opacity-90">
            Build workout plans, log every set in real time, and watch your strength history grow — all in one place.
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

      {/* Video modal */}
      {watchVideo && (
        <VideoModal
          youtubeId={watchVideo.id}
          title={watchVideo.title}
          onClose={() => setWatchVideo(null)}
        />
      )}
    </div>
  )
}
