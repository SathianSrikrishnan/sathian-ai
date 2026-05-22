import type { Metadata } from 'next'

import { ToothlightMakeClient } from '@/components/toothlight/v4/ToothlightMakeClient'

export const metadata: Metadata = {
  title: 'Create a Toothlight | Tooth Fairy Network',
  description:
    'Create a Toothlight from a photo, drawing, glow, and short memory before saving it to a parent account.',
}

export default function ToothlightMakePage() {
  return <ToothlightMakeClient />
}
