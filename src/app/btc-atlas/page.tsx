import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const BtcAtlasIntro = dynamic(
  () => import('@/components/btc-atlas-intro').then((mod) => mod.BtcAtlasIntro),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'BTC Cultural Atlas | sathian.ai',
  description:
    "Every number tells a story. Bitcoin's price mapped to 463 cultural markers across music, area codes, sports, history, and internet culture.",
  openGraph: {
    title: 'BTC Cultural Atlas',
    description:
      "Bitcoin's price is an accidental tour guide through world culture. 463 markers. 5 pillars. Real-time.",
    siteName: 'sathian.ai',
    type: 'website',
    images: [
      {
        url: 'https://btc.sathian.ai/api/og',
        width: 1200,
        height: 630,
        alt: 'BTC Cultural Atlas — Every Number Tells a Story',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BTC Cultural Atlas | sathian.ai',
    description:
      "Every number tells a story. Bitcoin's price mapped to 463 cultural markers.",
    images: ['https://btc.sathian.ai/api/og'],
  },
}

export default function BtcAtlasPage() {
  return <BtcAtlasIntro />
}
