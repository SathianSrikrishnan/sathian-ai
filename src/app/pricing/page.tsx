import type { Metadata } from 'next'

import { TfnCapsuleMvpClient } from '@/components/tfn-capsule/TfnCapsuleMvpClient'

export const metadata: Metadata = {
  title: 'Pricing | Tooth Fairy Network',
  description: 'Simple Tooth Light Capsule pricing tests after the free certificate and capsule artifact.',
}

export default function PricingPage() {
  return <TfnCapsuleMvpClient variant="pricing" />
}
