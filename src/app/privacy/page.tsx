import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Privacy | Tooth Fairy Network',
  description: 'Privacy principles for parent-led Tooth Light Capsules.',
}

export default function PrivacyPage() {
  return <TfnCapsuleMvpClient variant="privacy" />
}
