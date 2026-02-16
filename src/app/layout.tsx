import type { Metadata } from 'next'
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'sathian.ai',
  description: 'Personal site of Sathian. Experiments, projects, and writings.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'sathian.ai',
    description: 'Personal site of Sathian. Experiments, projects, and writings.',
    siteName: 'sathian.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'sathian.ai',
    description: 'Personal site of Sathian. Experiments, projects, and writings.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
