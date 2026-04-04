import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Architecture — Tooth Fairy Network",
  description: "Smart contract architecture and business model overview for Tooth Fairy Network on Solana.",
}

export default function ArchitecturePage() {
  return (
    <iframe
      src="/tfn-architecture.html"
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="TFN Architecture"
    />
  )
}
