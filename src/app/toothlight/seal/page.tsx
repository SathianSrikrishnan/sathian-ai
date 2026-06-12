import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Seal the Toothlight | Tooth Fairy Network',
}

export default function SealPage() {
  return <ToothlightCreationFlowClient step="seal" />
}
