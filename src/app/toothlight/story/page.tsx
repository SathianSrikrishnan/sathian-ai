import type { Metadata } from 'next'

import { ToothlightCreationFlowClient } from '@/components/toothlight/v4/ToothlightCreationFlowClient'

export const metadata: Metadata = {
  title: 'Tell the Story | Tooth Fairy Network',
}

export default function StoryPage() {
  return <ToothlightCreationFlowClient step="story" />
}
