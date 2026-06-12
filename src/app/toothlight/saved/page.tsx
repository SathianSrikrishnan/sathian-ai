import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Toothlight Saved | Tooth Fairy Network',
}

export default function SavedPage() {
  return <ToothlightCreationFlowClient step="saved" />
}
