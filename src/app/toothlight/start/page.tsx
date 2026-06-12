import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Start a Toothlight | Tooth Fairy Network',
}

export default function ToothlightStartPage() {
  return <ToothlightCreationFlowClient step="start" />
}
