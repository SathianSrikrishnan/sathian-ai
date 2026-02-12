import type { Metadata } from 'next'
import { ChatWidget } from '@/components/ChatWidget'

export const metadata: Metadata = {
  title: 'Tooth Fairy Network',
  description: 'Every child loses teeth. The Tooth Fairy Network turns childhood milestones into permanent digital keepsakes.',
  openGraph: {
    title: 'Tooth Fairy Network',
    description: 'Turn childhood milestones into permanent digital keepsakes. A product by sathian.ai.',
  },
}

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  )
}
