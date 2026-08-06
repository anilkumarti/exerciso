import { getProfile } from '@/lib/queries/profile'
import { PageShell, PageHeader } from '@/components/shared/page-shell'
import { SignOutButton } from '@/components/shared/sign-out-button'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        subtitle="Your profile, units and training goals."
        backHref="/dashboard"
      />
      {/*
        Keyed on the persisted values so the uncontrolled inputs remount with
        fresh defaults after a save, instead of mutating defaultValue in place.
      */}
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

      <div className="mt-6 border-t border-border pt-4">
        <SignOutButton />
      </div>
    </PageShell>
  )
}
