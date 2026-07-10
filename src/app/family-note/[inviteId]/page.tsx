import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Family Note | Tooth Fairy Network',
  description: 'Add a private family note to a Tooth Light Capsule.',
}

export default function FamilyNotePage({ params }: { params: { inviteId: string } }) {
  return <TfnCapsuleMvpClient variant="family-note" capsuleId={params.inviteId} />
}
