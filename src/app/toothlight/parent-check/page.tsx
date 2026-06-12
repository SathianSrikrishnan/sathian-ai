import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Parent Check | Tooth Fairy Network',
}

export default function ParentCheckPage() {
  return <ToothlightCreationFlowClient step="parent-check" />
}
