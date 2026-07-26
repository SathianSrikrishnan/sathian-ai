import type { Metadata } from 'next'

import { StudioNavigation } from './StudioNavigation'

export const metadata: Metadata = {
  title: 'Studio — sathian.ai',
  robots: 'noindex, nofollow',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0A0A0F', color: '#E6EDF3', minHeight: '100vh' }}>
      <StudioNavigation />
      {children}
    </div>
  )
}
