import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Create a Toothlight | Tooth Fairy Network',
  description:
    'Create a Toothlight from a photo, drawing, glow, and short memory before saving it to a parent account.',
}

export default function ToothlightMakePage() {
  // Legacy ToothlightMakeClient studio now hands off to the Stitch route flow.
  redirect('/toothlight/start')
}
