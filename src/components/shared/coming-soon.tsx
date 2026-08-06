import { Hammer } from 'lucide-react'
import { PageShell, PageHeader, EmptyState } from '@/components/shared/page-shell'

/**
 * Placeholder for routes that exist in the nav but aren't built yet.
 * Keeps the shell consistent so unfinished tabs don't look broken.
 */
export function ComingSoon({
  title,
  description = 'This feature is on the way.',
  backHref,
}: {
  title: string
  description?: string
  backHref?: string
}) {
  return (
    <PageShell>
      <PageHeader title={title} backHref={backHref} />
      <EmptyState icon={Hammer} title="Coming soon" description={description} />
    </PageShell>
  )
}
