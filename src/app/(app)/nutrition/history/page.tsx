import { ComingSoon } from '@/components/shared/coming-soon'

export default function Page() {
  return (
    <ComingSoon
      title="Nutrition history"
      description="Review what you have eaten across past days."
      backHref="/nutrition"
    />
  )
}
