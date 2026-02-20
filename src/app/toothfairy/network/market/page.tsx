import { Metadata } from "next"
import { MarketContent } from "@/components/toothfairy/market-content"

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
