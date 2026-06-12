import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Add School Drawing | Tooth Fairy Network',
}

export default function AddSchoolDrawingPage() {
  return <ToothlightCreationFlowClient step="add-school-drawing" />
}
