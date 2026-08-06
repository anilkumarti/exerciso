import Link from 'next/link'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-7" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Page not found</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          That page doesn&apos;t exist or may have been removed.
        </p>
      </div>
      <Link href="/">
        <Button className="mt-1">Back to dashboard</Button>
      </Link>
    </div>
  )
}
