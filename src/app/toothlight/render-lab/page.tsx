import type { Metadata } from 'next'

import { ToothlightRenderLab } from '@/components/toothlight/v4/ToothlightRenderLab'

export const metadata: Metadata = {
  title: 'Render Lab | Toothlight',
  description:
    'Compare Toothlight render modes, source photo, drawing layer, prompt, and prototype final image.',
}

export default function ToothlightRenderLabPage() {
  return <ToothlightRenderLab />
}
