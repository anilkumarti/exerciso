import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/bottom-nav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 pb-[calc(4rem+max(0.5rem,env(safe-area-inset-bottom)))]">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
