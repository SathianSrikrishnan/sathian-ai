"use client"

import { motion } from "motion/react"
import { C, fadeUp, stagger } from "./tokens"
import { TfnNav } from "./tfn-nav"

export function TechnicalContent() {
  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${C.cyan}08, transparent)` }} />
      <TfnNav activePage="technical" />

      <div className="max-w-4xl mx-auto px-6 py-24 pt-32 relative z-10">
        <motion.div {...fadeUp} className="mb-16">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: C.cyan }}>Technical Architecture</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
            How it&apos;s built
          </h1>
          <p className="text-lg" style={{ color: C.muted }}>
            Two layers on Solana mainnet. Compressed NFTs for keepsakes. Custom Anchor program for escrow. Deployed March 16, 2026.
          </p>
        </motion.div>

        {/* Stack badges */}
        <motion.div {...fadeUp} className="flex flex-wrap gap-3 mb-16">
          {[
            { label: "Solana Mainnet", color: C.cyan },
            { label: "Compressed NFTs (Bubblegum)", color: C.rose },
            { label: "Arweave (Permanent Storage)", color: C.amber },
            { label: "Anchor Escrow Program", color: C.emerald },
            { label: "Time-Locked Deposits", color: "#ab9ff2" },
            { label: "Multi-Depositor", color: C.cyan },
          ].map((tag) => (
            <span key={tag.label} className="px-4 py-2 rounded-full text-xs font-medium tracking-wide" style={{ background: `${tag.color}10`, color: tag.color, border: `1px solid ${tag.color}20` }}>
              {tag.label}
            </span>
          ))}
        </motion.div>

        <div className="space-y-16">

          {/* Two-Layer Architecture */}
          <motion.section {...stagger(0)}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Two-layer architecture</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: C.cyan }}>Layer 1: Keepsakes</h3>
                <ul className="space-y-2 text-sm" style={{ color: C.muted }}>
                  <li><strong style={{ color: C.text }}>cNFTs</strong> via Metaplex Bubblegum — compressed NFTs at ~$0.00005 per mint</li>
                  <li><strong style={{ color: C.text }}>Images</strong> uploaded to Arweave via Irys — permanent, decentralized storage</li>
                  <li><strong style={{ color: C.text }}>Server-side minting</strong> — parent never signs or pays. Server wallet covers gas.</li>
                  <li><strong style={{ color: C.text }}>Merkle tree</strong> — depth 14, 16,384 capacity. One tree for the entire network.</li>
                  <li>Appears in Phantom Collectibles with full image + metadata</li>
                </ul>
              </div>
              <div className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: C.emerald }}>Layer 2: Escrow</h3>
                <ul className="space-y-2 text-sm" style={{ color: C.muted }}>
                  <li><strong style={{ color: C.text }}>Custom Anchor program</strong> — 9 instructions, upgradeable</li>
                  <li><strong style={{ color: C.text }}>Multi-depositor</strong> — anyone can deposit SOL to any milestone</li>
                  <li><strong style={{ color: C.text }}>Time-locks</strong> — Immediate, 3yr, 5yr, 7yr, 10yr, 15yr</li>
                  <li><strong style={{ color: C.text }}>PDA escrow</strong> — SOL held in program-derived accounts (no human controls keys)</li>
                  <li><strong style={{ color: C.text }}>Safety</strong> — 7-day refund, guardian transfer, child wallet update, min deposit</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Smart Contract */}
          <motion.section {...stagger(1)}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Smart contract instructions</h2>
            <div className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-mono mb-4" style={{ color: C.dim }}>Program ID: FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC</p>
              <div className="space-y-3 text-sm">
                {[
                  { name: "initialize_child", who: "Guardian", desc: "Creates child profile linking guardian wallet to child wallet" },
                  { name: "create_milestone", who: "Guardian", desc: "Creates milestone record for a tooth (no NFT — cNFT minted separately)" },
                  { name: "log_milestone", who: "Guardian", desc: "Creates milestone + mints traditional NFT via Metaplex CPI" },
                  { name: "deposit", who: "Anyone", desc: "Deposits SOL with chosen time-lock and depositor name" },
                  { name: "claim_deposit", who: "Guardian", desc: "Releases SOL to child wallet (enforces time-lock)" },
                  { name: "refund_deposit", who: "Original depositor", desc: "Reclaims SOL within 7-day grace period" },
                  { name: "transfer_guardianship", who: "Guardian", desc: "Transfers control to a new wallet" },
                  { name: "update_child_wallet", who: "Guardian", desc: "Changes the child's destination wallet" },
                ].map((ix) => (
                  <div key={ix.name} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: C.border }}>
                    <code className="text-xs font-mono px-2 py-0.5 rounded shrink-0" style={{ background: `${C.cyan}10`, color: C.cyan }}>{ix.name}</code>
                    <div>
                      <span style={{ color: C.text }}>{ix.desc}</span>
                      <span className="ml-2 text-xs" style={{ color: C.dim }}>({ix.who})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Why Solana */}
          <motion.section {...stagger(2)}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Why Solana</h2>
            <div className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <ul className="space-y-3 text-sm" style={{ color: C.muted }}>
                <li><strong style={{ color: C.text }}>Cost:</strong> ~$0.00005 per cNFT mint. Families shouldn&apos;t pay $5 in gas to record a lost tooth.</li>
                <li><strong style={{ color: C.text }}>Speed:</strong> ~400ms confirmation. The experience feels instant.</li>
                <li><strong style={{ color: C.text }}>Ecosystem:</strong> Phantom has 15M+ monthly active users. Largest consumer crypto wallet. Our distribution channel.</li>
                <li><strong style={{ color: C.text }}>Compressed NFTs:</strong> Bubblegum enables NFTs at 1/1000th the cost of traditional mints. Makes "free for parents" economically viable.</li>
                <li><strong style={{ color: C.text }}>Anchor framework:</strong> Rust-based, type-safe, battle-tested. The contract is auditable and upgradeable.</li>
              </ul>
            </div>
          </motion.section>

          {/* Wallet Support + Roadmap */}
          <motion.section {...stagger(3)}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Wallet support &amp; roadmap</h2>
            <div className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: C.text }}>Current support</h3>
              <div className="space-y-2 text-sm mb-6" style={{ color: C.muted }}>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: C.emerald }} /><strong style={{ color: C.text }}>Phantom</strong> — Desktop extension + mobile (in-app browser). Primary wallet.</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: C.amber }} /><strong style={{ color: C.text }}>Backpack, Solflare, Jupiter</strong> — Compatible via Wallet Standard. Not yet tested.</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: C.amber }} /><strong style={{ color: C.text }}>Solana Blinks</strong> — Action endpoint deployed. One-click deposits from any wallet that supports Actions.</div>
              </div>
              <h3 className="text-sm font-bold mb-3" style={{ color: C.text }}>On the roadmap</h3>
              <div className="space-y-2 text-sm" style={{ color: C.muted }}>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: C.dim }} /><strong style={{ color: C.text }}>Non-crypto onboarding</strong> — Email login via Privy/Dynamic. Parent doesn&apos;t need to know what a wallet is.</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: C.dim }} /><strong style={{ color: C.text }}>Fiat deposits</strong> — Stripe or MoonPay integration. Grandma pays $50, we convert to SOL and deposit.</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: C.dim }} /><strong style={{ color: C.text }}>Fee sponsorship</strong> — All transactions sponsored by the network. Zero-fee for families.</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: C.dim }} /><strong style={{ color: C.text }}>Mobile app</strong> — Camera-first experience. Push notifications when family deposits.</div>
              </div>
            </div>
          </motion.section>

          {/* Development Status */}
          <motion.section {...stagger(4)}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Development status</h2>
            <div className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="space-y-3 text-sm">
                {[
                  { status: "done", label: "Concept, narrative, video", detail: "Landing page, 59s video, storyboard assets" },
                  { status: "done", label: "cNFT minting pipeline", detail: "Photo → Arweave → Bubblegum cNFT → Phantom Collectibles" },
                  { status: "done", label: "Escrow smart contract", detail: "9 instructions, multi-depositor, time-locks, deployed on mainnet" },
                  { status: "done", label: "Frontend app", detail: "5-step mint flow + deposit + dashboard + shareable gift links" },
                  { status: "done", label: "Solana Blinks", detail: "Action endpoint for one-click deposits from any wallet" },
                  { status: "done", label: "Mobile support", detail: "Phantom in-app browser with universal link detection" },
                  { status: "done", label: "toothfairy.network", detail: "Custom domain, live on Vercel, SSL, Cloudflare DNS" },
                  { status: "next", label: "UX polish", detail: "Reduce friction, better animations, inline dashboard" },
                  { status: "next", label: "Multi-wallet testing", detail: "Backpack, Solflare, Jupiter wallet verification" },
                  { status: "next", label: "Grant submissions", detail: "Superteam Canada, FranklinDAO, ALLMIGHT" },
                  { status: "future", label: "Non-crypto onboarding", detail: "Email login, fiat deposits, fee sponsorship" },
                  { status: "future", label: "Family graph", detail: "Multi-stakeholder permissions, notification system" },
                  { status: "future", label: "Mobile app", detail: "Camera-first native experience" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.status === "done" ? C.emerald : item.status === "next" ? C.amber : C.dim }} />
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
          </motion.section>

          {/* Open Questions */}
          <motion.section {...stagger(5)}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Open questions</h2>
            <div className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="text-sm mb-4" style={{ color: C.muted }}>
                Active technical questions. If you have experience in Solana development, wallet infrastructure, or consumer crypto — let&apos;s talk.
              </p>
              <ul className="space-y-2 text-sm" style={{ color: C.muted }}>
                <li>&bull; Best pattern for non-crypto onboarding — Privy vs Dynamic vs Web3Auth for email-based wallets?</li>
                <li>&bull; Fiat on-ramp strategy — Stripe + MoonPay, or build a custom solution?</li>
                <li>&bull; Fee sponsorship model — who pays when everything is free for families?</li>
                <li>&bull; Multi-wallet testing — are there edge cases with Backpack/Solflare wallet adapters?</li>
                <li>&bull; Time-lock UX — how to communicate "your money is locked for 10 years" without scaring parents?</li>
              </ul>
            </div>
          </motion.section>
        </div>

        <motion.div {...fadeUp} className="mt-24 text-center">
          <p className="text-sm mb-4" style={{ color: C.muted }}>Want to discuss the architecture or contribute?</p>
          <p className="text-sm" style={{ color: C.muted }}>
            Reach out at <a href="mailto:hello@toothfairy.network" className="underline hover:text-white" style={{ color: C.cyan }}>hello@toothfairy.network</a>
          </p>
        </motion.div>
      </div>

      <footer className="py-8 px-6" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Tooth Fairy Network</span>
          <span className="text-xs" style={{ color: C.dim }}>&copy; {new Date().getFullYear()} Tooth Fairy Network. Built on Solana.</span>
        </div>
      </footer>
    </div>
  )
}
