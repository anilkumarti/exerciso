import { createPlan } from '@/lib/actions/workout-plans'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PageShell, PageHeader } from '@/components/shared/page-shell'

const SPLIT_TYPES = [
  { value: 'full_body', label: 'Full Body', hint: 'Every muscle, each session' },
  { value: 'upper_lower', label: 'Upper / Lower', hint: 'Alternate top and bottom' },
  { value: 'push_pull_legs', label: 'Push / Pull / Legs', hint: 'Classic 3-way split' },
  { value: 'bro_split', label: 'Bro Split', hint: 'One muscle group per day' },
  { value: 'custom', label: 'Custom', hint: 'Build it your own way' },
]

export default function NewPlanPage() {
  return (
    <PageShell>
      <PageHeader
        title="New plan"
        subtitle="Name your plan and pick a training split."
        backHref="/workout"
      />

      <form action={createPlan} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Plan name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Summer Cut"
            required
            autoFocus
            className="h-11"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">
            Description{' '}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="What's this plan about?"
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Split type</Label>
          <div className="flex flex-col gap-2">
            {SPLIT_TYPES.map((s, i) => (
              <label
                key={s.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="split_type"
                  value={s.value}
                  defaultChecked={i === 0}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.hint}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" className="h-11 w-full">
          Create plan
        </Button>
      </form>
    </PageShell>
  )
}
