import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'sathian.ai - Second Brain Interface',
  description: 'You are interacting with Sathian\'s second brain. A live demonstration of Personal AI Infrastructure.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
