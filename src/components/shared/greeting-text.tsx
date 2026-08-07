'use client'

export function GreetingText() {
  const h = new Date().getHours()
  const text = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return <>{text}</>
}
