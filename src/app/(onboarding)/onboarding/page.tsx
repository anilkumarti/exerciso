import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/queries/profile'
import { OnboardingFlow } from './onboarding-flow'

export default async function OnboardingPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getProfile()
  if (profile?.onboarding_done) redirect('/dashboard')

  return (
    <OnboardingFlow
      displayName={profile?.display_name ?? ''}
    />
  )
}
