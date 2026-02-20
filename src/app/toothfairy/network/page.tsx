import { Metadata } from "next"
import { PitchLanding } from "@/components/toothfairy/pitch-landing"

export const metadata: Metadata = {
  title: "The Tooth Fairy Network | sathian.ai",
  description:
    "Turn your child's lost tooth into permanent savings and a digital keepsake. Every child loses teeth — this turns those milestones into something lasting.",
  openGraph: {
    title: "The Tooth Fairy Network",
    description:
      "Every child loses teeth. Turn those milestones into permanent digital keepsakes and your child's first real savings.",
    siteName: "sathian.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Tooth Fairy Network",
    description:
      "Turn your child's lost tooth into permanent savings and a digital keepsake.",
  },
}

export default function ToothFairyNetworkPage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#030712" }}>
      <PitchLanding />
    </main>
  )
}
