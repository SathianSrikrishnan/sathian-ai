import type { Metadata } from 'next'
import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { DeferredChatWidget } from '@/components/DeferredChatWidget'
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
  title: 'Sathian Srikrishnan | Digital Experiments',
  description: 'Sathian Srikrishnan, founder and dad in Toronto, builds products people love, starting with the ones his own children need. Projects, essays and Tooth Fairy Network.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Sathian Srikrishnan | Digital Experiments',
    description: 'Sathian Srikrishnan, founder and dad in Toronto, builds products people love, starting with the ones his own children need. Projects, essays and Tooth Fairy Network.',
    siteName: 'Sathian',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sathian Srikrishnan | Digital Experiments',
    description: 'Sathian Srikrishnan, founder and dad in Toronto, builds products people love, starting with the ones his own children need. Projects, essays and Tooth Fairy Network.',
  },
}

// No request data (headers/cookies) is read here, so pages can be static or ISR.
// The site agent hides itself on Tooth Fairy hosts client-side (DeferredChatWidget).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetBrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <DeferredChatWidget />
        <WebsiteAnalytics />
      </body>
    </html>
  )
}
