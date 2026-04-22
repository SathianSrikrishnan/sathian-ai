import type { Metadata } from 'next'
import { StoriesThemeLock } from '@/components/toothfairy/nav/stories-theme-lock'

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
    <>
      <StoriesThemeLock />
      {children}
    </>
  )
}
