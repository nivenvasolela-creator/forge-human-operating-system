import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/lib/providers'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Alera — Convert dreams into a system',
  description: 'Dump your mind. Get a blueprint. Know what matters today. Reflect tonight. The simplest system for becoming who you want to be.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Alera',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#F7F7F5',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
