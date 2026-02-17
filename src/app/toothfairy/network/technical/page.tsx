import { Metadata } from "next"
import dynamic from "next/dynamic"

const TechnicalContent = dynamic(
  () => import("@/components/toothfairy/technical-content").then((mod) => mod.TechnicalContent),
  { ssr: false }
)

export const metadata: Metadata = {
  title: "Technical Details | Tooth Fairy Network",
  description: "Smart contract architecture, token standards, and technical roadmap for the Tooth Fairy Network.",
}

export default function TechnicalPage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#030712" }}>
      <TechnicalContent />
    </main>
  )
}
