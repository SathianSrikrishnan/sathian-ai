import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { ChatWidget } from '@/components/ChatWidget'
import { TFNProductAnalytics } from '@/components/toothlight/analytics/TFNProductAnalytics'
import './globals.css'

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
  const cloudflareWebAnalyticsToken = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN
  const isTfnDomain =
    host === 'toothfairy.network' ||
    host === 'www.toothfairy.network' ||
    host === 'toothfairy.sathian.ai'

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <TFNProductAnalytics />
        {cloudflareWebAnalyticsToken && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: cloudflareWebAnalyticsToken })}
          />
        )}
        {!isTfnDomain && <ChatWidget />}
      </body>
    </html>
  )
}
