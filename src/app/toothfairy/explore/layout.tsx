import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stories from Around the World | Tooth Fairy Network',
  description:
    'Explore tooth fairy traditions from 50 cultures across the globe. A living network of childhood myths.',
}

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: 'oklch(12% 0.04 270)',
        color: 'oklch(93% 0.01 80)',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}
