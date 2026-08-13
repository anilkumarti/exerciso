import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Standard page container — consistent gutters, max width and entrance
 * animation for every screen in the app.
 */
export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-lg px-4 pb-10', className)}>
      <div className="animate-rise">{children}</div>
    </div>
  )
}

/**
 * Page title block with optional back link and trailing action.
 */
export function PageHeader({
  title,
  subtitle,
  backHref,
  action,
  className,
}: {
  title: string
  subtitle?: string
  backHref?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn('pt-8 pb-6', className)}>
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 -ml-1.5 inline-flex items-center gap-0.5 rounded-lg py-1 pr-2 pl-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[1.875rem] leading-tight font-black tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}

/**
 * Consistent empty state — icon bubble, headline, supporting copy, optional CTA.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border px-6 py-16 text-center',
        className
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
        <Icon className="size-7" />
      </div>
      <div className="space-y-1.5">
        <p className="text-base font-bold">{title}</p>
        {description && (
          <p className="mx-auto max-w-[22ch] text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

/**
 * Small labelled metric tile used on the dashboard and analytics screens.
 */
export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string
  value: React.ReactNode
  hint?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}) {
  return (
    <div className={cn('surface flex flex-col gap-3 p-4', className)}>
      {Icon && (
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <Icon className="size-4" />
        </div>
      )}
      <div>
        <p className="tabular text-[2rem] leading-none font-black tracking-tight">{value}</p>
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        {hint && (
          <p className="mt-0.5 text-xs text-muted-foreground/70 truncate">{hint}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Section heading with an optional "see all" style link on the right.
 */
export function SectionHeader({
  title,
  href,
  linkLabel = 'See all',
}: {
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-[0.75rem] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary transition-opacity hover:opacity-70"
        >
          {linkLabel}
          <ChevronRight className="size-3" />
        </Link>
      )}
    </div>
  )
}
