import { Metadata } from "next"
import { TechnicalContent } from "@/components/toothfairy/technical-content"

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
