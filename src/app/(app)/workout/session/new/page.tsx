import { redirect } from 'next/navigation'

// Sessions always start from a plan day.
export default function Page() {
  redirect('/workout')
}
