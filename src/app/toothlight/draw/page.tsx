import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Draw Your Toothlight | Tooth Fairy Network',
}

export default function DrawToothlightPage() {
  return <ToothlightCreationFlowClient step="draw" />
}
