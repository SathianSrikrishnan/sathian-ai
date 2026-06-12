import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Create From Scratch | Tooth Fairy Network',
}

export default function CreateSourcePage() {
  return <ToothlightCreationFlowClient step="create-source" />
}
