import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { ChatWidget } from '@/components/ChatWidget'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://sathian.ai'),
  alternates: { canonical: './' },
  title: 'sathian.ai',
  description: 'Sathian S. builds AI-native automations, agentic workflows, Web3 proofs, and private systems.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'sathian.ai',
    description: 'AI-native automations, agentic workflows, Web3 proofs, and private systems by Sathian S.',
    siteName: 'sathian.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sathian.ai',
    description: 'AI-native automations, agentic workflows, Web3 proofs, and private systems by Sathian S.',
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
    <html lang="en" data-theme="dark">
      <body className="font-sans antialiased">
        {children}
        {!isTfnDomain && <ChatWidget />}
      </body>
    </html>
  )
}
