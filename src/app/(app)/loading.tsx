/**
 * Shared skeleton for the authenticated section. Mirrors the common
 * header + card-stack rhythm so the swap to real content isn't jarring.
 */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-10" aria-busy="true">
      <div className="pt-8 pb-6">
        <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-8 w-44 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  )
}
