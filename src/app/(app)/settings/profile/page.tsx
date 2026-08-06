import { getProfile } from '@/lib/queries/profile'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <div className="px-4 pb-8 pt-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <ProfileForm profile={profile} />
    </div>
  )
}
