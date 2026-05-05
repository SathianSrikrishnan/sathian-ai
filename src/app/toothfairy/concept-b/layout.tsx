import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tooth Fairy Network — Your child\'s first keepsake',
  description: 'Turn your child\'s lost tooth into a first forever memory and Smile Fund.',
  openGraph: {
    title: 'Tooth Fairy Network',
    description: 'Your child just lost a tooth. Let\'s make it the first thing they ever own.',
  },
}

export default function ConceptBLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ background: '#FDF8F0', color: '#2D2418', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
