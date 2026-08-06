import { redirect } from 'next/navigation'

// Goals are edited on the main settings screen.
export default function Page() {
  redirect('/settings/profile')
}
