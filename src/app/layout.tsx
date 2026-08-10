import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { ChatWidget } from '@/components/ChatWidget'
import { WebsiteAnalytics } from '@/components/WebsiteAnalytics'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sathian.ai'),
  alternates: { canonical: './' },
  title: 'Sathian S. | Agent Manager + Orchestrator',
  description: 'Agent manager and orchestrator building useful systems, public projects, and writing from Toronto.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Sathian S. | Agent Manager + Orchestrator',
    description: 'Agent manager and orchestrator building useful systems, public projects, and writing from Toronto.',
    siteName: 'sathian.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sathian S. | Agent Manager + Orchestrator',
    description: 'Agent manager and orchestrator building useful systems, public projects, and writing from Toronto.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const host = headers().get('host') ?? ''
  const isTfnDomain =
    host === 'toothfairy.network' ||
    host === 'www.toothfairy.network' ||
    host === 'toothfairy.sathian.ai'

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetBrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {!isTfnDomain && <ChatWidget />}
        <WebsiteAnalytics />
      </body>
    </html>
  )
}
