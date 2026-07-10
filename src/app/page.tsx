import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Tooth Fairy Network | Tooth Light Capsules',
  description:
    'Create a private Tooth Fairy time capsule with a child in a few minutes. Parent-led, private by default, and no wallet required.',
}

export default function HomePage() {
  return <TfnCapsuleMvpClient variant="landing" />
}
