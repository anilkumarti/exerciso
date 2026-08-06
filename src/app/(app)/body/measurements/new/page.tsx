import { ComingSoon } from '@/components/shared/coming-soon'

export default function Page() {
  return (
    <ComingSoon
      title="New measurement"
      description="Log chest, waist, arms and more."
      backHref="/body"
    />
  )
}
