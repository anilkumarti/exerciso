'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
  matchExact?: boolean
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    matchExact: true,
    icon: <HomeIcon />,
    activeIcon: <HomeIconFilled />,
  },
  {
    href: '/workout',
    label: 'Workout',
    icon: <WorkoutIcon />,
    activeIcon: <WorkoutIconFilled />,
  },
  {
    href: '/exercises',
    label: 'Exercises',
    icon: <ExercisesIcon />,
    activeIcon: <ExercisesIconFilled />,
  },
  {
    href: '/nutrition',
    label: 'Nutrition',
    icon: <NutritionIcon />,
    activeIcon: <NutritionIconFilled />,
  },
  {
    href: '/body',
    label: 'Body',
    icon: <BodyIcon />,
    activeIcon: <BodyIconFilled />,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-stretch" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        {navItems.map((item) => {
          const isActive = item.matchExact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center">
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span className="leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

/* ── Icons (inline SVG to avoid external deps) ── */

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}
function HomeIconFilled() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
  )
}

function WorkoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M6.5 6.5h11M6.5 17.5h11M3 10h18M3 14h18" />
      <rect x="2" y="8" width="3" height="8" rx="1.5" />
      <rect x="19" y="8" width="3" height="8" rx="1.5" />
    </svg>
  )
}
function WorkoutIconFilled() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.75 6A.75.75 0 0 1 9.5 5.25h5A.75.75 0 0 1 15.25 6v12a.75.75 0 0 1-1.5 0v-5.25H10.25V18a.75.75 0 0 1-1.5 0V6ZM5.25 9A.75.75 0 0 1 6 8.25h1.25v7.5H6A.75.75 0 0 1 5.25 15V9ZM2 10.25a.75.75 0 0 0-.75.75v2a.75.75 0 0 0 1.5 0v-2A.75.75 0 0 0 2 10.25ZM22 10.25a.75.75 0 0 0-.75.75v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 0-.75-.75ZM16.75 8.25H18A.75.75 0 0 1 18.75 9v6a.75.75 0 0 1-.75.75h-1.25v-7.5Z" />
    </svg>
  )
}

function ExercisesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </svg>
  )
}
function ExercisesIconFilled() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.166 18.894a.75.75 0 0 1-1.06-1.06l1.59-1.591a.75.75 0 0 1 1.061 1.06l-1.59 1.591ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.166 5.106a.75.75 0 0 1 1.06 1.06l-1.59 1.591a.75.75 0 0 1-1.061-1.06l1.59-1.591Z" />
    </svg>
  )
}

function NutritionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}
function NutritionIconFilled() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" />
    </svg>
  )
}

function BodyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
      <path d="M6 8h12l-1 7H7L6 8Z" />
      <path d="M9 15l-1 7M15 15l1 7" />
    </svg>
  )
}
function BodyIconFilled() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M12 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5.25 8.25A.75.75 0 0 1 6 7.5h12a.75.75 0 0 1 .745.836l-1.5 10.5A.75.75 0 0 1 16.5 19.5h-9a.75.75 0 0 1-.745-.664l-1.5-10.5A.75.75 0 0 1 5.25 8.25Z" />
    </svg>
  )
}
