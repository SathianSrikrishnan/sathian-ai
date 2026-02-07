"use client"

import dynamic from "next/dynamic"
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider"
import { ChatWidget } from "@/components/ChatWidget"

const ToothFairyScroll = dynamic(
  () => import("@/components/toothfairy/tooth-fairy-scroll").then((mod) => mod.ToothFairyScroll),
  { ssr: false }
)

const CosmicGlobe = dynamic(
  () => import("@/components/ui/cosmic-globe").then((mod) => mod.CosmicGlobe),
  { ssr: false }
)

export default function ToothFairyNetworkPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen" style={{ background: "#050510" }}>
        <ToothFairyScroll>
          {/* Scene 5 globe — injected as children, rendered inside #globe-mount */}
          <CosmicGlobe
            size={500}
            showLabels={true}
            simulateArrivals={true}
            showArcs={true}
          />
        </ToothFairyScroll>

        <ChatWidget />
      </main>
    </SmoothScrollProvider>
  )
}
