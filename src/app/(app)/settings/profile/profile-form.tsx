'use client'

import { useActionState, useState } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { updateProfile } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import type { Profile } from '@/lib/queries/profile'

function cmToFtIn(cm: number) {
  const totalInches = cm / 2.54
  return { ft: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) }
}

function ftInToCm(ft: number, inches: number) {
  return ((ft * 12 + inches) * 2.54).toFixed(1)
}

const WEIGHT_UNITS = [
  { value: 'kg', label: 'kg' },
  { value: 'lbs', label: 'lbs' },
]
const HEIGHT_UNITS = [
  { value: 'cm', label: 'cm' },
  { value: 'ft_in', label: 'ft / in' },
]
const FITNESS_GOALS = [
  { value: 'lose_weight', label: 'Lose weight' },
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'improve_endurance', label: 'Endurance' },
  { value: 'increase_strength', label: 'Strength' },
]
const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly active', desc: '1–3 days/week' },
  { value: 'moderately_active', label: 'Moderate', desc: '3–5 days/week' },
  { value: 'very_active', label: 'Very active', desc: '6–7 days/week' },
  { value: 'extra_active', label: 'Extra active', desc: 'Physical job + training' },
]

/** Section wrapper — consistent card treatment for each settings group. */
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="surface flex flex-col gap-4 p-4">{children}</div>
    </section>
  )
}

/** Segmented pill control used for the unit toggles. */
function Segmented({
  name,
  options,
  current,
  onChange,
}: {
  name: string
  options: { value: string; label: string }[]
  current: string
  onChange?: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <label key={o.value} className="contents">
          <input
            type="radio"
            name={name}
            value={o.value}
            defaultChecked={current === o.value}
            className="peer sr-only"
            onChange={() => onChange?.(o.value)}
          />
          <span className="cursor-pointer rounded-lg py-2 text-center text-sm font-medium text-muted-foreground transition-colors peer-checked:bg-card peer-checked:text-foreground peer-checked:shadow-card">
            {o.label}
          </span>
        </label>
      ))}
    </div>
  )
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, isPending] = useActionState(updateProfile, null)

  const [weightUnit, setWeightUnit] = useState(profile?.weight_unit ?? 'kg')
  const [heightUnit, setHeightUnit] = useState(profile?.height_unit ?? 'cm')

  const initFtIn = profile?.height_cm ? cmToFtIn(profile.height_cm) : null
  const [heightFt, setHeightFt] = useState(initFtIn ? String(initFtIn.ft) : '')
  const [heightInches, setHeightInches] = useState(initFtIn ? String(initFtIn.inches) : '')

  const [goalWeightLbs, setGoalWeightLbs] = useState(
    profile?.goal_weight_kg ? (profile.goal_weight_kg * 2.20462).toFixed(1) : ''
  )

  return (
    <form action={action} className="flex flex-col gap-6">
      {state?.error && (
        <p className="flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-[var(--success)]">
          <CircleCheck className="size-4 shrink-0" />
          Settings saved
        </p>
      )}

      <Section title="Profile">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display_name">Display name</Label>
          <Input
            id="display_name"
            name="display_name"
            placeholder="Your name"
            defaultValue={profile?.display_name ?? ''}
            className="h-11 text-base"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date_of_birth">Date of birth</Label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            defaultValue={profile?.date_of_birth ?? ''}
            className="h-11 text-base"
          />
        </div>
      </Section>

      <Section title="Appearance">
        <div className="flex flex-col gap-1.5">
          <Label>Theme</Label>
          <ThemeToggle />
        </div>
      </Section>

      <Section title="Units">
        <div className="flex flex-col gap-1.5">
          <Label>Weight unit</Label>
          <Segmented
            name="weight_unit"
            options={WEIGHT_UNITS}
            current={profile?.weight_unit ?? 'kg'}
            onChange={(v) => setWeightUnit(v as 'kg' | 'lbs')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Height unit</Label>
          <Segmented
            name="height_unit"
            options={HEIGHT_UNITS}
            current={profile?.height_unit ?? 'cm'}
            onChange={(v) => setHeightUnit(v as 'cm' | 'ft_in')}
          />
        </div>

        {heightUnit === 'cm' ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="height_cm">Height (cm)</Label>
            <Input
              id="height_cm"
              name="height_cm"
              type="number"
              min="100"
              max="250"
              step="0.1"
              inputMode="decimal"
              placeholder="175"
              defaultValue={profile?.height_cm ?? ''}
              className="tabular h-11 text-base"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label>Height (ft / in)</Label>
            <input
              type="hidden"
              name="height_cm"
              value={heightFt || heightInches ? ftInToCm(Number(heightFt), Number(heightInches)) : ''}
            />
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-xs text-muted-foreground">Feet</span>
                <Input
                  type="number"
                  min="3"
                  max="8"
                  step="1"
                  inputMode="numeric"
                  placeholder="5"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  className="tabular h-11 text-base"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-xs text-muted-foreground">Inches</span>
                <Input
                  type="number"
                  min="0"
                  max="11"
                  step="1"
                  inputMode="numeric"
                  placeholder="10"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  className="tabular h-11 text-base"
                />
              </div>
            </div>
          </div>
        )}

        {weightUnit === 'kg' ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal_weight_kg">Goal weight (kg)</Label>
            <Input
              id="goal_weight_kg"
              name="goal_weight_kg"
              type="number"
              min="30"
              max="300"
              step="0.1"
              inputMode="decimal"
              placeholder="75"
              defaultValue={profile?.goal_weight_kg ?? ''}
              className="tabular h-11 text-base"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label>Goal weight (lbs)</Label>
            <input
              type="hidden"
              name="goal_weight_kg"
              value={goalWeightLbs ? (Number(goalWeightLbs) / 2.20462).toFixed(2) : ''}
            />
            <Input
              type="number"
              min="66"
              max="660"
              step="0.1"
              inputMode="decimal"
              placeholder="165"
              value={goalWeightLbs}
              onChange={(e) => setGoalWeightLbs(e.target.value)}
              className="tabular h-11 text-base"
            />
          </div>
        )}
      </Section>

      <Section title="Goals">
        <div className="flex flex-col gap-1.5">
          <Label>Fitness goal</Label>
          <div className="flex flex-wrap gap-2">
            {FITNESS_GOALS.map((g) => (
              <label key={g.value}>
                <input
                  type="radio"
                  name="fitness_goal"
                  value={g.value}
                  defaultChecked={
                    (profile?.fitness_goal ?? 'build_muscle') === g.value
                  }
                  className="peer sr-only"
                />
                <span className="flex cursor-pointer items-center justify-center rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground hover:bg-muted">
                  {g.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Activity level</Label>
          <div className="flex flex-col gap-2">
            {ACTIVITY_LEVELS.map((a) => (
              <label
                key={a.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="activity_level"
                  value={a.value}
                  defaultChecked={
                    (profile?.activity_level ?? 'moderately_active') === a.value
                  }
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="h-11 w-full"
      >
        {isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
