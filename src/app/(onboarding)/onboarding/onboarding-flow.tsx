'use client'

import { useState, useTransition } from 'react'
import { ChevronLeft } from 'lucide-react'
import { completeOnboarding, skipOnboarding } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FitnessGoal, ActivityLevel } from '@/types/database'

const GOALS: { value: FitnessGoal; label: string; desc: string; emoji: string }[] = [
  { value: 'lose_weight',       label: 'Lose weight',   desc: 'Burn fat, get leaner',          emoji: '🔥' },
  { value: 'build_muscle',      label: 'Build muscle',  desc: 'Gain strength & size',           emoji: '💪' },
  { value: 'maintain',          label: 'Maintain',      desc: 'Stay at current weight',         emoji: '⚖️' },
  { value: 'improve_endurance', label: 'Endurance',     desc: 'Run faster, last longer',        emoji: '🏃' },
  { value: 'increase_strength', label: 'Strength',      desc: 'Lift heavier, get stronger',     emoji: '🏋️' },
]

const ACTIVITY: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary',         label: 'Sedentary',         desc: 'Desk job, little to no exercise' },
  { value: 'lightly_active',    label: 'Lightly active',    desc: 'Exercise 1–3 days/week' },
  { value: 'moderately_active', label: 'Moderately active', desc: 'Exercise 3–5 days/week' },
  { value: 'very_active',       label: 'Very active',       desc: 'Exercise 6–7 days/week' },
  { value: 'extra_active',      label: 'Extra active',      desc: 'Physical job + daily training' },
]

function ftInToCm(ft: string, inches: string) {
  return ((parseFloat(ft || '0') * 12 + parseFloat(inches || '0')) * 2.54)
}

export function OnboardingFlow({ displayName }: { displayName: string }) {
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()

  const [goal, setGoal] = useState<FitnessGoal>('build_muscle')

  const [dob, setDob] = useState('')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft_in'>('cm')
  const [heightCm, setHeightCm] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [weight, setWeight] = useState('')

  const [activity, setActivity] = useState<ActivityLevel>('moderately_active')

  const firstName = displayName.split(' ')[0] || ''

  function handleSkip() {
    startTransition(async () => { await skipOnboarding() })
  }

  function handleFinish() {
    const heightCmFinal = heightUnit === 'cm'
      ? (heightCm ? parseFloat(heightCm) : null)
      : (heightFt || heightIn ? ftInToCm(heightFt, heightIn) : null)
    const weightKgFinal = weight
      ? (weightUnit === 'kg' ? parseFloat(weight) : parseFloat(weight) / 2.20462)
      : null

    startTransition(async () => {
      await completeOnboarding({
        fitness_goal: goal,
        activity_level: activity,
        date_of_birth: dob || null,
        height_cm: heightCmFinal,
        weight_kg: weightKgFinal,
        weight_unit: weightUnit,
        height_unit: heightUnit,
      })
    })
  }

  const STEPS = [
    { emoji: '🎯', title: 'What\'s your goal?', subtitle: firstName ? `Welcome, ${firstName}! Let's personalise your plan.` : 'Let\'s personalise your plan.' },
    { emoji: '📏', title: 'Your measurements', subtitle: 'Helps calculate your daily calorie target.' },
    { emoji: '🏃', title: 'How active are you?', subtitle: 'We\'ll factor this into your targets.' },
  ]

  const current = STEPS[step - 1]

  return (
    <div className="flex min-h-svh flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        {step > 1 ? (
          <button
            onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <div className="size-9" />
        )}

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={cn(
                'rounded-full transition-all duration-300',
                s === step
                  ? 'w-6 h-2 bg-primary'
                  : s < step
                    ? 'size-2 bg-primary/50'
                    : 'size-2 bg-muted-foreground/20',
              )}
            />
          ))}
        </div>

        <button
          onClick={handleSkip}
          disabled={isPending}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
        >
          Skip
        </button>
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col px-5 pb-10 pt-8">
        {/* Step heading */}
        <div className="mb-8">
          <div className="mb-3 text-4xl">{current.emoji}</div>
          <h1 className="text-2xl font-bold leading-tight">{current.title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{current.subtitle}</p>
        </div>

        {/* Step 1 — Goal */}
        {step === 1 && (
          <div className="flex flex-col gap-2.5">
            {GOALS.map(g => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGoal(g.value)}
                className={cn(
                  'flex items-center gap-4 rounded-2xl border p-4 text-left transition-all',
                  goal === g.value
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/40 hover:bg-muted/40',
                )}
              >
                <span className="text-2xl leading-none">{g.emoji}</span>
                <div className="flex-1">
                  <p className={cn('text-sm font-semibold', goal === g.value && 'text-primary')}>{g.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{g.desc}</p>
                </div>
                <div className={cn(
                  'size-4 shrink-0 rounded-full border-2 transition-colors',
                  goal === g.value ? 'border-primary bg-primary' : 'border-muted-foreground/30',
                )} />
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Measurements */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* Date of birth */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dob">Date of birth <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            {/* Height */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Height <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium">
                  {(['cm', 'ft_in'] as const).map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setHeightUnit(u)}
                      className={cn(
                        'rounded-md px-2.5 py-1 transition-all',
                        heightUnit === u ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {u === 'cm' ? 'cm' : 'ft/in'}
                    </button>
                  ))}
                </div>
              </div>
              {heightUnit === 'cm' ? (
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="175"
                  value={heightCm}
                  onChange={e => setHeightCm(e.target.value)}
                  className="h-12 tabular text-base"
                />
              ) : (
                <div className="flex gap-3">
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Feet</span>
                    <Input type="number" inputMode="numeric" placeholder="5" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="h-12 tabular text-base" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Inches</span>
                    <Input type="number" inputMode="numeric" placeholder="10" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="h-12 tabular text-base" />
                  </div>
                </div>
              )}
            </div>

            {/* Current weight */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Current weight <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium">
                  {(['kg', 'lbs'] as const).map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setWeightUnit(u)}
                      className={cn(
                        'rounded-md px-2.5 py-1 transition-all',
                        weightUnit === u ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                type="number"
                inputMode="decimal"
                placeholder={weightUnit === 'kg' ? '70' : '154'}
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="h-12 tabular text-base"
              />
            </div>
          </div>
        )}

        {/* Step 3 — Activity */}
        {step === 3 && (
          <div className="flex flex-col gap-2.5">
            {ACTIVITY.map(a => (
              <button
                key={a.value}
                type="button"
                onClick={() => setActivity(a.value)}
                className={cn(
                  'flex items-center gap-4 rounded-2xl border p-4 text-left transition-all',
                  activity === a.value
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/40 hover:bg-muted/40',
                )}
              >
                <div className="flex-1">
                  <p className={cn('text-sm font-semibold', activity === a.value && 'text-primary')}>{a.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <div className={cn(
                  'size-4 shrink-0 rounded-full border-2 transition-colors',
                  activity === a.value ? 'border-primary bg-primary' : 'border-muted-foreground/30',
                )} />
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-8">
          {step < 3 ? (
            <Button
              size="lg"
              className="h-12 w-full text-base font-semibold"
              onClick={() => setStep(s => (s + 1) as 1 | 2 | 3)}
            >
              Next →
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-12 w-full text-base font-semibold"
              onClick={handleFinish}
              disabled={isPending}
            >
              {isPending ? 'Saving…' : "Let's go! 🚀"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
