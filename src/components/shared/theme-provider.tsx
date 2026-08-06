'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export const THEME_COOKIE = 'exerciso-theme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Theme preference is stored in a cookie so the server can stamp the right
 * class on <html> during SSR — no blocking inline script and no flash.
 * 'system' stores no class at all and lets the prefers-color-scheme media
 * query in globals.css decide.
 */
export function ThemeProvider({
  children,
  initialTheme = 'system',
}: {
  children: React.ReactNode
  initialTheme?: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  const setTheme = useCallback((next: Theme) => {
    // 1 year, site-wide, and lax so it survives normal navigation
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`

    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (next !== 'system') root.classList.add(next)

    root.style.colorScheme =
      next === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : next

    setThemeState(next)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
