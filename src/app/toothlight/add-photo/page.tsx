import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Add a Photo | Tooth Fairy Network',
}

export default function AddPhotoPage() {
  return <ToothlightCreationFlowClient step="add-photo" />
}
