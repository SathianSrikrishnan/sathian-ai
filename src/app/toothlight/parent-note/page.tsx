import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'A Note For Later | Tooth Fairy Network',
}

export default function ParentNotePage() {
  return <ToothlightCreationFlowClient step="parent-note" />
}
