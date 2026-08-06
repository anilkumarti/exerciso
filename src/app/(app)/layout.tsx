import { BottomNav } from '@/components/layout/bottom-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Content sits above bottom nav */}
      <main className="flex-1 pb-[calc(4rem+max(0.5rem,env(safe-area-inset-bottom)))]">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
