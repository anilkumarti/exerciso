'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Apple, Dumbbell, Home, LineChart, Library } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  Icon: React.ComponentType<{ className?: string }>
  matchExact?: boolean
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Home',      Icon: Home,      matchExact: true },
  { href: '/workout',   label: 'Workout',   Icon: Dumbbell },
  { href: '/exercises', label: 'Exercises', Icon: Library },
  { href: '/nutrition', label: 'Nutrition', Icon: Apple },
  { href: '/body',      label: 'Body',      Icon: LineChart },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-3 z-50"
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="glass mx-auto flex max-w-lg items-center rounded-[1.5rem] border border-border px-1.5 py-1.5 shadow-raised">
        {navItems.map(({ href, label, Icon, matchExact }) => {
          const isActive = matchExact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className="group flex flex-1 flex-col items-center gap-0.5 py-0.5"
            >
              <span
                className={cn(
                  'flex h-9 w-full max-w-[3.25rem] items-center justify-center rounded-[1rem] transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
                )}
              >
                <Icon className="size-[1.075rem]" />
              </span>
              <span
                className={cn(
                  'text-[0.6125rem] leading-none font-medium tracking-tight transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
