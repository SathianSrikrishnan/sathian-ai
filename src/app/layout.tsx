import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono, Playfair_Display, Source_Serif_4 } from 'next/font/google'
import { ChatWidget } from '@/components/ChatWidget'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-display',
  display: 'swap',
  weight: ['700'],
  style: ['normal', 'italic'],
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sathian.ai'),
  alternates: { canonical: './' },
  title: 'sathian.ai',
  description: 'Personal site of Sathian. Experiments, projects, and writings.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'sathian.ai',
    description: 'Personal site of Sathian. Experiments, projects, and writings.',
    siteName: 'sathian.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sathian.ai',
    description: 'Personal site of Sathian. Experiments, projects, and writings.',
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
    <html lang="en" data-theme="dark" className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {!isTfnDomain && <ChatWidget />}
      </body>
    </html>
  )
}
