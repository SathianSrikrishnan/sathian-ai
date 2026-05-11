import type { Metadata } from 'next'
import { StoriesThemeLock } from '@/components/toothfairy/nav/stories-theme-lock'

export const metadata: Metadata = {
  title: 'Tooth Fairy Atlas | Tooth Fairy Network',
  description:
    'Read Tooth Fairy Network bedtime stories, meet the collectors, and explore tooth traditions from around the world.',
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
