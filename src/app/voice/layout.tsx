import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kai Voice — sathian.ai',
  description: 'Voice interface for Kai, a personal AI assistant built on context engineering.',
  openGraph: {
    title: 'Kai Voice — sathian.ai',
    description: 'Voice interface for Kai, a personal AI assistant.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kai Voice — sathian.ai',
    description: 'Voice interface for Kai, a personal AI assistant.',
  },
}

export default function VoiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
