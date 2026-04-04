import { Metadata } from "next"
import { TfnLanding } from "@/components/toothfairy/tfn-landing"

export const metadata: Metadata = {
  title: "Tooth Fairy Network — Digital Keepsakes for Every Lost Tooth",
  description:
    "Turn your child's lost tooth into permanent savings and a digital keepsake. Every child loses teeth — this turns those milestones into something lasting.",
  openGraph: {
    title: "Tooth Fairy Network",
    description:
      "Every child loses teeth. Turn those milestones into permanent digital keepsakes and your child's first real savings.",
    siteName: "toothfairy.network",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tooth Fairy Network",
    description:
      "Turn your child's lost tooth into permanent savings and a digital keepsake.",
  },
}

export default function ToothFairyNetworkPage() {
  return <TfnLanding />
}
