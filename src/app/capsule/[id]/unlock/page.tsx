import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Unlock Tooth Light Capsule | Tooth Fairy Network',
  description: 'Future unlock view for a Tooth Light Capsule.',
}

export default function CapsuleUnlockPage({ params }: { params: { id: string } }) {
  return <TfnCapsuleMvpClient variant="unlock" capsuleId={params.id} />
}
