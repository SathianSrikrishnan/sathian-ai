import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Technical Details | Tooth Fairy Network",
  description: "Smart contract architecture, token standards, and technical roadmap for the Tooth Fairy Network.",
}

const C = {
  bg: "#030712",
  text: "#f9fafb",
  muted: "#9ca3af",
  dim: "#4b5563",
  border: "rgba(255,255,255,0.06)",
  rose: "#f43f5e",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  emerald: "#10b981",
}

export default function TechnicalPage() {
  return (
    <main className="min-h-screen" style={{ background: C.bg, color: C.text }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/toothfairy/network" className="text-base font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Tooth Fairy Network
          </a>
          <div className="flex items-center gap-1">
            <a href="/toothfairy/network" className="px-4 py-2 rounded-lg text-sm transition-colors duration-200 hover:bg-white/[0.05]" style={{ color: C.muted }}>Story</a>
            <a href="/toothfairy/network/technical" className="px-4 py-2 rounded-lg text-sm text-white bg-white/[0.05]">Technical</a>
            <a href="/toothfairy/network/market" className="px-4 py-2 rounded-lg text-sm transition-colors duration-200 hover:bg-white/[0.05]" style={{ color: C.muted }}>Market</a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: C.cyan }}>Technical Architecture</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
            How it&apos;s built
          </h1>
          <p className="text-lg" style={{ color: C.muted }}>
            The Tooth Fairy Network uses blockchain to make childhood keepsakes permanent, verifiable, and owned by families — not platforms.
          </p>
        </div>

        {/* Stack badges */}
        <div className="flex flex-wrap gap-3 mb-16">
          {[
            { label: "Base (Ethereum L2)", color: C.cyan },
            { label: "ERC-721 NFTs", color: C.rose },
            { label: "ERC-5192 Soulbound", color: C.amber },
            { label: "Smart Contract Escrow", color: C.emerald },
            { label: "Wallet Agnostic", color: C.cyan },
          ].map((tag) => (
            <span
              key={tag.label}
              className="px-4 py-2 rounded-full text-xs font-medium tracking-wide"
              style={{ background: `${tag.color}10`, color: tag.color, border: `1px solid ${tag.color}20` }}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {/* Why Base */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Why Base (Ethereum L2)</h2>
            <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <ul className="space-y-3 text-sm" style={{ color: C.muted }}>
                <li><strong style={{ color: C.text }}>Cost:</strong> ~$0.08 per mint vs. $5-50 on Ethereum mainnet. For a product targeting families, cost per transaction must be negligible.</li>
                <li><strong style={{ color: C.text }}>Speed:</strong> &lt;2 second confirmation time. Parents shouldn&apos;t wait for a milestone to be recorded.</li>
                <li><strong style={{ color: C.text }}>Coinbase backing:</strong> Base is built by Coinbase — the most trusted on-ramp for mainstream users. This matters for family adoption.</li>
                <li><strong style={{ color: C.text }}>EVM compatible:</strong> Full Solidity support. All Ethereum tooling works. No vendor lock-in.</li>
              </ul>
            </div>
          </section>

          {/* The Smart Contract */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>The Smart Contract</h2>
            <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <p className="text-sm mb-4" style={{ color: C.muted }}>The core contract handles the two-part exchange — an atomic swap between a parent&apos;s crypto and a soulbound NFT keepsake.</p>
              <div className="space-y-4 text-sm" style={{ color: C.muted }}>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: C.text }}>Milestone Logging</h4>
                  <p>Child or parent submits a milestone (photo, date, description). This creates a pending record in the contract.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: C.text }}>NFT Minting (ERC-721)</h4>
                  <p>A unique token is minted and held in escrow by the contract. The NFT contains the milestone metadata — immutable, verifiable, permanent.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: C.text }}>Soulbound Binding (ERC-5192)</h4>
                  <p>Once the exchange completes, the NFT becomes soulbound — it can&apos;t be transferred or sold. This is a keepsake, not a speculative asset.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: C.text }}>Atomic Swap</h4>
                  <p>The parent sends crypto to the contract. In a single transaction: the NFT goes to the parent (soulbound), and the crypto goes to the child&apos;s wallet. No intermediary. No trust required.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: C.text }}>Stakeholder Notifications</h4>
                  <p>All registered family members — father, mother, grandparents — are notified when a milestone is logged or an exchange completes. On-chain events + off-chain notification service.</p>
                </div>
              </div>
            </div>
          </section>

          {/* What needs to be built */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Development roadmap</h2>
            <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <div className="space-y-4 text-sm">
                {[
                  { status: "done", label: "Concept & narrative design", detail: "Landing page, video, storyboard assets" },
                  { status: "done", label: "Frontend prototype", detail: "Next.js app with full product storytelling" },
                  { status: "next", label: "Smart contract development", detail: "ERC-721 + ERC-5192 + escrow logic on Base testnet" },
                  { status: "next", label: "Wallet integration", detail: "Parent and child wallet flows, wallet-agnostic onboarding" },
                  { status: "future", label: "Family graph", detail: "Multi-stakeholder notification and permission system" },
                  { status: "future", label: "Mobile app", detail: "Camera-first milestone capture for parents and children" },
                  { status: "future", label: "Mainnet deployment", detail: "Base mainnet launch with real families" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        background: item.status === "done" ? C.emerald : item.status === "next" ? C.amber : C.dim,
                      }}
                    />
                    <div>
                      <span style={{ color: C.text }}>{item.label}</span>
                      <span className="ml-2" style={{ color: C.dim }}>— {item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-4 text-xs" style={{ color: C.dim }}>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: C.emerald }} /> Done</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: C.amber }} /> Next</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: C.dim }} /> Future</span>
              </div>
            </div>
          </section>

          {/* Questions for builders */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Open questions</h2>
            <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <p className="text-sm mb-4" style={{ color: C.muted }}>
                These are the technical decisions I&apos;m actively working through. If you have experience in smart contract development or wallet infrastructure, I&apos;d love to talk.
              </p>
              <ul className="space-y-2 text-sm" style={{ color: C.muted }}>
                <li>• What&apos;s the right abstraction for wallet-agnostic onboarding for non-crypto parents?</li>
                <li>• How should the family permission graph work on-chain vs. off-chain?</li>
                <li>• What&apos;s the best pattern for gasless transactions for the child&apos;s wallet?</li>
                <li>• Should milestone metadata live on-chain, IPFS, or a hybrid?</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <p className="text-sm mb-4" style={{ color: C.muted }}>
            Want to discuss the technical architecture?
          </p>
          <p className="text-sm" style={{ color: C.muted }}>
            Use the chat below or reach out at{" "}
            <a href="/" className="underline underline-offset-4 hover:text-white transition-colors" style={{ color: C.cyan }}>
              sathian.ai
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
