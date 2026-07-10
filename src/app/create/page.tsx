import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Create Tooth Capsule | Tooth Fairy Network',
  description: 'Create a parent-led Tooth Light Capsule from a photo, story, certificate, and future unlock date.',
}

export default function CreateCapsulePage() {
  return <TfnCapsuleMvpClient variant="create" />
}
