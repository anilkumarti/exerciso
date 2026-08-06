'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Profile } from '@/lib/queries/profile'

const WEIGHT_UNITS = [{ value: 'kg', label: 'kg' }, { value: 'lbs', label: 'lbs' }]
const HEIGHT_UNITS = [{ value: 'cm', label: 'cm' }, { value: 'ft_in', label: 'ft/in' }]
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

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, isPending] = useActionState(updateProfile, null)

  return (
    <form action={action} className="flex flex-col gap-8">
      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">Saved!</p>
      )}

      {/* Profile section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Profile</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="display_name">Display name</label>
          <Input
            id="display_name"
            name="display_name"
            placeholder="Your name"
            defaultValue={profile?.display_name ?? ''}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="date_of_birth">Date of birth</label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            defaultValue={profile?.date_of_birth ?? ''}
          />
        </div>
      </section>

      {/* Units section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Units</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Weight unit</label>
          <div className="flex gap-2">
            {WEIGHT_UNITS.map((u) => (
              <label key={u.value} className="flex-1">
                <input
                  type="radio"
                  name="weight_unit"
                  value={u.value}
                  defaultChecked={(profile?.weight_unit ?? 'kg') === u.value}
                  className="sr-only peer"
                />
                <span className="flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary hover:bg-muted">
                  {u.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Height unit</label>
          <div className="flex gap-2">
            {HEIGHT_UNITS.map((u) => (
              <label key={u.value} className="flex-1">
                <input
                  type="radio"
                  name="height_unit"
                  value={u.value}
                  defaultChecked={(profile?.height_unit ?? 'cm') === u.value}
                  className="sr-only peer"
                />
                <span className="flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary hover:bg-muted">
                  {u.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium" htmlFor="height_cm">Height (cm)</label>
            <Input
              id="height_cm"
              name="height_cm"
              type="number"
              min="100"
              max="250"
              step="0.1"
              placeholder="175"
              defaultValue={profile?.height_cm ?? ''}
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm font-medium" htmlFor="goal_weight_kg">Goal weight (kg)</label>
            <Input
              id="goal_weight_kg"
              name="goal_weight_kg"
              type="number"
              min="30"
              max="300"
              step="0.1"
              placeholder="75"
              defaultValue={profile?.goal_weight_kg ?? ''}
            />
          </div>
        </div>
      </section>

      {/* Goals section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Goals</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Fitness goal</label>
          <div className="flex flex-wrap gap-2">
            {FITNESS_GOALS.map((g) => (
              <label key={g.value}>
                <input
                  type="radio"
                  name="fitness_goal"
                  value={g.value}
                  defaultChecked={(profile?.fitness_goal ?? 'build_muscle') === g.value}
                  className="sr-only peer"
                />
                <span className="flex items-center justify-center rounded-full border px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary hover:bg-muted">
                  {g.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Activity level</label>
          {ACTIVITY_LEVELS.map((a) => (
            <label key={a.value} className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
              <input
                type="radio"
                name="activity_level"
                value={a.value}
                defaultChecked={(profile?.activity_level ?? 'moderately_active') === a.value}
                className="accent-primary"
              />
              <div>
                <p className="text-sm font-medium">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Saving…' : 'Save'}
      </Button>
    </form>
  )
}
