import { Dumbbell } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="pb-safe pt-safe relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Ambient brand glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          backgroundImage:
            'linear-gradient(135deg, var(--grad-from), var(--grad-to))',
        }}
      />

      <div className="animate-rise relative w-full max-w-sm">
        {/* App wordmark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="bg-brand-gradient shadow-hero flex size-14 items-center justify-center rounded-2xl text-white">
            <Dumbbell className="size-7" />
          </span>
          <span className="text-2xl font-bold tracking-tight">Exerciso</span>
        </div>

        <div className="surface p-6">{children}</div>
      </div>
    </div>
  )
}
