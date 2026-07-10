import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Free Tooth Fairy Certificate | Tooth Fairy Network',
  description: 'Make a free Tooth Fairy certificate and save the story behind the lost tooth.',
}

export default function CertificatePage() {
  return <TfnCapsuleMvpClient variant="certificate" />
}
