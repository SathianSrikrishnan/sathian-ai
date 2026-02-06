import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tooth Fairy Network',
  description: 'Every child loses teeth. The Tooth Fairy Network brings that story on-chain.',
  openGraph: {
    title: 'Tooth Fairy Network',
    description: 'Every child loses teeth. The Tooth Fairy Network brings that story on-chain.',
  },
}

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
