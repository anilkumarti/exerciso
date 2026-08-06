import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { Providers } from '@/components/shared/providers'
import { THEME_COOKIE, type Theme } from '@/components/shared/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Exerciso',
  description: 'Personal gym and fitness assistant',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Exerciso',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F6FB' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0E1A' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Read the theme preference server-side so the correct class is in the very
  // first HTML response — no flash, no blocking script.
  const stored = (await cookies()).get(THEME_COOKIE)?.value as Theme | undefined
  const theme: Theme =
    stored === 'light' || stored === 'dark' ? stored : 'system'

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${
        theme === 'system' ? '' : theme
      }`}
      style={theme === 'system' ? undefined : { colorScheme: theme }}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers initialTheme={theme}>{children}</Providers>
      </body>
    </html>
  )
}
