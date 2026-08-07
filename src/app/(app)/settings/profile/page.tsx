import { cookies } from 'next/headers'
import { getProfile } from '@/lib/queries/profile'
import { PageShell, PageHeader } from '@/components/shared/page-shell'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { DietPrefSetting } from '@/components/nutrition/diet-pref-setting'
import { ProfileForm } from './profile-form'
import type { DietPref } from '@/data/food-database'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const dietPref = (cookieStore.get('nutrition_diet_pref')?.value as DietPref) ?? 'non_veg'
  const profile = await getProfile()

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        subtitle="Your profile, units and training goals."
        backHref="/dashboard"
      />
      <ProfileForm
        key={[
          profile?.display_name,
          profile?.date_of_birth,
          profile?.weight_unit,
          profile?.height_unit,
          profile?.height_cm,
          profile?.goal_weight_kg,
          profile?.activity_level,
          profile?.fitness_goal,
        ].join('|')}
        profile={profile}
      />

      <section className="mt-6">
        <h2 className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Nutrition
        </h2>
        <div className="surface flex flex-col gap-3 p-4">
          <div>
            <p className="text-sm font-medium">Dietary preference</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Filters food search and meal suggestions
            </p>
          </div>
          <DietPrefSetting current={dietPref} />
        </div>
      </section>

      <div className="mt-6 border-t border-border pt-4">
        <SignOutButton />
      </div>
    </PageShell>
  )
}
