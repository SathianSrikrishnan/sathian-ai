import { Metadata } from "next"
import dynamic from "next/dynamic"

const PitchLanding = dynamic(
  () => import("@/components/toothfairy/pitch-landing").then((mod) => mod.PitchLanding),
  { ssr: false }
)

export const metadata: Metadata = {
  title: "The Tooth Fairy Network | sathian.ai",
  description:
    "Turn childhood milestones into permanent, verifiable digital keepsakes on blockchain. Your child earns it. You keep it. They learn from it.",
  openGraph: {
    title: "The Tooth Fairy Network",
    description:
      "Narrative-driven childhood milestone platform built on Base. NFT keepsakes for parents. Crypto education for children.",
    siteName: "sathian.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Tooth Fairy Network",
    description:
      "Turn childhood milestones into permanent, verifiable digital keepsakes on blockchain.",
  },
}

export default function ToothFairyNetworkPage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#030712" }}>
      <PitchLanding />
    </main>
  )
}
