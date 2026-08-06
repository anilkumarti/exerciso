// Protected layout — auth guard + bottom nav added in feat/auth
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1">{children}</main>
      {/* BottomNav added in feat/app-shell */}
    </div>
  )
}
