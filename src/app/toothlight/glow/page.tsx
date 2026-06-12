import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Make It Glow | Tooth Fairy Network',
}

export default function GlowPage() {
  return <ToothlightCreationFlowClient step="glow" />
}
