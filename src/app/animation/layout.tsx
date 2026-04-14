import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tooth Fairy Network — Animation',
  description: 'The chain of teeth — visualizing the Tooth Fairy Network.',
}

export default function AnimationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
