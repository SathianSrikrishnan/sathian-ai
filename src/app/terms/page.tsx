import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Terms | Tooth Fairy Network',
  description: 'Terms for the Tooth Fairy Network Tooth Light Capsule MVP.',
}

export default function TermsPage() {
  return <TfnCapsuleMvpClient variant="terms" />
}
