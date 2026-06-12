import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Toothlight Preview | Tooth Fairy Network',
}

export default function ToothlightPreviewPage() {
  return <ToothlightCreationFlowClient step="preview" />
}
