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
  { href: '/dashboard', label: 'Home', Icon: Home, matchExact: true },
  { href: '/workout', label: 'Workout', Icon: Dumbbell },
  { href: '/exercises', label: 'Exercises', Icon: Library },
  { href: '/nutrition', label: 'Nutrition', Icon: Apple },
  { href: '/body', label: 'Body', Icon: LineChart },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-50 border-t border-border">
      <div
        className="mx-auto flex max-w-lg items-stretch px-1"
        style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      >
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
              className="group flex flex-1 flex-col items-center gap-1 pt-2 pb-1"
            >
              <span
                className={cn(
                  'flex h-7 w-12 items-center justify-center rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-primary/12 text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'transition-transform duration-200',
                    isActive ? 'size-[1.15rem] scale-105' : 'size-[1.15rem]'
                  )}
                />
              </span>
              <span
                className={cn(
                  'text-[0.6875rem] leading-none font-medium transition-colors',
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
