import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 pb-safe">{children}</main>
      {/* BottomNav added in feat/app-shell */}
    </div>
  )
}
