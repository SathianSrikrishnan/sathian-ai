import type { Metadata } from 'next'
import { StoriesThemeLock } from '@/components/toothfairy/nav/stories-theme-lock'

export const metadata: Metadata = {
  title: 'Stories from Around the World | Tooth Fairy Network',
  description:
    'Explore tooth fairy traditions from around the world through bedtime stories, keepers, and family memories.',
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
