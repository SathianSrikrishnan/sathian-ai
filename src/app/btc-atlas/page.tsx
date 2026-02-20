import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const BtcAtlasIntro = dynamic(
  () => import('@/components/btc-atlas-intro').then((mod) => mod.BtcAtlasIntro),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050510' }}>
        <div className="text-xs font-mono" style={{ color: '#A78BFA80' }}>Loading atlas...</div>
      </div>
    ),
  }
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BTC Cultural Atlas | sathian.ai',
    description:
      "Every number tells a story. Bitcoin's price mapped to 463 cultural markers.",
  },
}

export default function BtcAtlasPage() {
  return <BtcAtlasIntro />
}
