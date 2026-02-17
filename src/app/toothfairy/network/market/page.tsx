import { Metadata } from "next"
import dynamic from "next/dynamic"

const MarketContent = dynamic(
  () => import("@/components/toothfairy/market-content").then((mod) => mod.MarketContent),
  { ssr: false }
)

export const metadata: Metadata = {
  title: "Market Analysis | Tooth Fairy Network",
  description: "The opportunity: why the tooth fairy ritual is the first financial transaction worth digitizing.",
}

export default function MarketPage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#030712" }}>
      <MarketContent />
    </main>
  )
}
