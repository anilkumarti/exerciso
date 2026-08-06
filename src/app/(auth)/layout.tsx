export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 pb-safe pt-safe">
      <div className="w-full max-w-sm">
        {/* App wordmark */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-primary">Exerciso</span>
        </div>
        {children}
      </div>
    </div>
  )
}
