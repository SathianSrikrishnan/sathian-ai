import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Tooth Light Capsule | Tooth Fairy Network',
  description: 'A saved Tooth Light Capsule view.',
}

export default function CapsulePage({ params }: { params: { id: string } }) {
  return <TfnCapsuleMvpClient variant="capsule" capsuleId={params.id} />
}
