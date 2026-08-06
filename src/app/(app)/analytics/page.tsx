import { ComingSoon } from '@/components/shared/coming-soon'

export default function Page() {
  return (
    <ComingSoon
      title="Analytics"
      description="Volume trends, personal records and training frequency will live here."
      backHref="/dashboard"
    />
  )
}
