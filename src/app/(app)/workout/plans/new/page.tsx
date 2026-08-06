import Link from 'next/link'
import { createPlan } from '@/lib/actions/workout-plans'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const SPLIT_TYPES = [
  { value: 'full_body', label: 'Full Body' },
  { value: 'upper_lower', label: 'Upper / Lower' },
  { value: 'push_pull_legs', label: 'Push / Pull / Legs' },
  { value: 'bro_split', label: 'Bro Split' },
  { value: 'custom', label: 'Custom' },
]

export default function NewPlanPage() {
  return (
    <div className="px-4 pb-6 pt-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/workout" className="text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">New Plan</h1>
      </div>

      <form action={createPlan} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Plan Name</Label>
          <Input id="name" name="name" placeholder="e.g. Summer Cut" required autoFocus />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Textarea id="description" name="description" placeholder="What's this plan about?" rows={3} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Split Type</Label>
          <div className="flex flex-wrap gap-2">
            {SPLIT_TYPES.map((s, i) => (
              <label key={s.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="split_type"
                  value={s.value}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className="px-3 py-1.5 rounded-full border text-sm font-medium peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors">
                  {s.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="mt-2">Create Plan</Button>
      </form>
    </div>
  )
}
