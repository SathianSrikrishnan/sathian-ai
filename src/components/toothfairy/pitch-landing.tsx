"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import { C, fadeUp, stagger } from "./tokens"
import Link from "next/link"

export function PitchLanding() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) vid.play().catch(() => {}) },
      { threshold: 0.3 }
    )
    obs.observe(vid)
    return () => obs.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@") || submitting) return
    setSubmitting(true)
    try {
      await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
    } catch {}
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="relative" style={{ background: C.bg, color: C.text }}>

      {/* ═══ FAIRY GLOW BACKGROUND — floating particles + radial gradient ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 0%, #1A1040 0%, #0B1026 70%)` }}>
        {/* Floating sparkle particles */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, rgba(240, 196, 86, 0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 70%, rgba(79, 209, 197, 0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 40%, rgba(240, 196, 86, 0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 80%, rgba(79, 209, 197, 0.2) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 10% 90%, rgba(240, 196, 86, 0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 20%, rgba(245, 240, 255, 0.3) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 50% 50%, rgba(240, 196, 86, 0.2) 0%, transparent 100%)`,
          animation: "fairy-drift 20s ease-in-out infinite",
        }} />
      </div>
      <style>{`
        @keyframes fairy-drift {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          25% { transform: translateY(-10px) translateX(5px); opacity: 0.8; }
          50% { transform: translateY(-5px) translateX(-5px); opacity: 0.5; }
          75% { transform: translateY(-15px) translateX(3px); opacity: 0.7; }
        }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md" style={{ background: "rgba(11,16,38,0.85)", borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight">Tooth Fairy Network</span>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="text-xs hover:opacity-80" style={{ color: C.muted }}>How It Works</a>
            <a href="#video" className="text-xs hover:opacity-80 hidden sm:block" style={{ color: C.muted }}>Video</a>
            <Link href="/app" className="px-4 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: C.rose }}>
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8" style={{ background: `${C.rose}10`, color: C.rose, border: `1px solid ${C.rose}20` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.rose }} />
            Live on Solana Mainnet
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]" style={{ fontFamily: "var(--font-display)" }}>
            Your child&apos;s first
            <br />
            <span style={{ background: `linear-gradient(135deg, #F0C456, #4FD1C5)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              digital wallet.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed" style={{ color: C.muted }}>
            A children&apos;s savings app disguised as the Tooth Fairy. Every lost tooth becomes a digital deposit the whole family can contribute to.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link href="/app" className="px-8 py-3.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ background: C.rose, color: "white" }}>
              Create Your Child&apos;s Wallet — Free
            </Link>
            <a href="#how-it-works" className="px-8 py-3.5 rounded-lg text-sm font-semibold transition-all hover:bg-white/[0.06]" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
              See How It Works
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative w-full max-w-5xl mx-auto mt-16 aspect-[16/9] rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
          <Image src="/v2-storyboard/compositions/comp-05-finale-v2.png" alt="The Tooth Fairy Network" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 40%)` }} />
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 px-6" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>How it works</h2>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: C.muted }}>A lost tooth becomes a moment the whole family is part of.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Turn a milestone into art", desc: "Your child photographs their lost tooth and draws on it. Enhance it with AI. They create a digital keepsake they&apos;re proud of — something worth sharing.", color: C.amber, img: "/v2-storyboard/objects/obj-01-tooth-glowing.png" },
              { num: "02", title: "Share it with family", desc: "Send it to grandparents, uncles, godparents — anywhere in the world. Each person can contribute a deposit. The tooth becomes a tiny fundraiser for your child.", color: C.cyan, img: "/v2-storyboard/objects/obj-03-nft-card.png" },
              { num: "03", title: "Build their foundation", desc: "Every deposit grows over time. Lock it until they turn 18 or gift it now. Your child inherits a savings account and a record of everyone who believed in them.", color: C.rose, img: "/v2-storyboard/objects/obj-05-wallet-child.png" },
            ].map((step, i) => (
              <motion.div key={step.num} {...stagger(i)} className="rounded-xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={step.img} alt={step.title} fill className="object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 50%)` }} />
                </div>
                <div className="px-6 pb-6 -mt-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-mono font-black mb-4" style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}25` }}>
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EMAIL CAPTURE ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>Start with one tooth.</h2>
            <p className="text-sm mb-6" style={{ color: C.muted }}>Create your child&apos;s wallet in 60 seconds — or leave your email and we&apos;ll remind you when the next tooth falls.</p>
            <div className="flex flex-col gap-3">
              <Link href="/app" className="px-6 py-3 rounded-lg text-sm font-semibold text-white text-center" style={{ background: C.rose }}>
                Create Wallet — Free
              </Link>
              {submitted ? (
                <div className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg" style={{ background: `${C.emerald}10`, border: `1px solid ${C.emerald}25` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.emerald }} />
                  <span className="text-xs font-mono" style={{ color: C.emerald }}>You&apos;re on the list.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                    className="flex-1 px-3 py-3 rounded-lg text-sm outline-none" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.text }} />
                  <button type="submit" disabled={submitting} className="px-5 py-3 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 whitespace-nowrap" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
                    {submitting ? "..." : "Remind Me"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ THE MATH ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="rounded-xl p-8 sm:p-12" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              20 teeth. 20 chances to build their future.
            </h2>
            <p className="text-sm mb-8" style={{ color: C.muted }}>Every child loses 20 baby teeth between ages 6 and 12. Each one is an opportunity for the whole family to contribute.</p>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: C.amber }}>1</div>
                <div className="text-sm font-medium">tooth falls out</div>
                <div className="text-xs mt-1" style={{ color: C.dim }}>Your child draws it, you photograph it</div>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: C.cyan }}>5+</div>
                <div className="text-sm font-medium">family members contribute</div>
                <div className="text-xs mt-1" style={{ color: C.dim }}>Parents, grandparents, uncles, godparents</div>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-3xl font-bold mb-1" style={{ color: C.rose }}>18</div>
                <div className="text-sm font-medium">years of growing</div>
                <div className="text-xs mt-1" style={{ color: C.dim }}>Locked safely until your child is ready</div>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ background: "rgba(153,69,255,0.06)", border: "1px solid rgba(153,69,255,0.12)" }}>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                <strong style={{ color: "#F0C456" }}>The art is the invitation.</strong> Your child creates something beautiful. You share it with family. They contribute to the savings. Every tooth becomes a tiny fundraiser — wrapped in a ritual every family already does.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ VIDEO ═══ */}
      <section className="py-24 px-6" id="video">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>See the vision</h2>
            <p className="text-sm mt-2" style={{ color: C.muted }}>59 seconds. One story. A new way to save for your child&apos;s future.</p>
          </motion.div>
          <motion.div {...fadeUp} className="relative rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: `0 0 80px ${C.rose}08` }}>
            <video ref={videoRef} src="/toothfairy-network-v3.1.mp4" controls muted playsInline preload="metadata" poster="/v2-storyboard/compositions/comp-01-fairy-enters-bedroom.png" className="w-full aspect-video" style={{ background: C.bg }} />
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST / TRANSPARENCY ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: "Keepsake", value: "Free forever", sub: "No cost to create your child's digital wallet" },
              { label: "Deposits", value: "2% fee", sub: "Transparent. On-chain. Fully refundable for 7 days." },
              { label: "Withdrawals", value: "Anytime", sub: "Gift now or lock until 18. Early withdrawal available." },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: C.dim }}>{item.label}</div>
                <div className="text-lg font-bold mb-1">{item.value}</div>
                <div className="text-xs" style={{ color: C.muted }}>{item.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
              The next tooth is coming.
            </h2>
            <p className="text-lg mb-8" style={{ color: C.muted }}>
              Be ready. Create your child&apos;s wallet before it falls.
            </p>
            <Link href="/app" className="inline-block px-10 py-4 rounded-lg text-sm font-semibold text-white" style={{ background: C.rose }}>
              Start Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-6" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Tooth Fairy Network</span>
          <div className="flex items-center gap-4 text-xs" style={{ color: C.dim }}>
            <a href="https://solscan.io/account/FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC" target="_blank" rel="noopener noreferrer" className="hover:underline">Verify on Solscan</a>
            <span>&middot;</span>
            <span>Built on Solana</span>
            <span>&middot;</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
