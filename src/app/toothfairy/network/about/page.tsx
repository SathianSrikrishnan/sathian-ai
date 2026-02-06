"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { AuroraBlob } from "@/components/ui/aurora-background"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const C = {
  bg: "#050510",
  surface: "#0F0F2D",
  nebula: "#7C3AED",
  aurora: "#06B6D4",
  stardust: "#F59E0B",
  text: "#F1F5F9",
  muted: "#A78BFA",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen relative" style={{ background: C.bg, color: C.text }}>
      {/* Aurora layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AuroraBlob color={C.nebula} size={700} blur={110} opacity={0.08} className="absolute -top-[200px] right-[10%] animate-aurora-drift" />
        <AuroraBlob color={C.aurora} size={500} blur={90} opacity={0.06} className="absolute bottom-[10%] -left-[100px] animate-aurora-drift-reverse" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 px-6 py-4 glass">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/toothfairy/network" className="text-sm font-mono hover:underline" style={{ color: C.muted + "80" }}>
            &larr; Back to Network
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/toothfairy/network" className="text-sm font-mono" style={{ color: C.muted + "60" }}>Network</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-5 mb-12">
            <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0 animate-glow-pulse" style={{
              border: `2px solid ${C.nebula}30`,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sathian-profile.png" alt="Sathian" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display text-display-sm md:text-display-md font-bold mb-1">Sathian</h1>
              <p className="text-sm font-mono" style={{ color: C.muted + "70" }}>Founder &middot; The Tooth Fairy Network</p>
            </div>
          </div>

          <div className="space-y-6 text-base leading-relaxed" style={{ color: C.text + "cc" }}>
            <p>
              Welcome to my public sandbox.
            </p>
            <p>
              Every child loses teeth. It&rsquo;s one of the first universal human experiences. And every culture has some version
              of the same story: something invisible collects what you&rsquo;ve lost and leaves something valuable in return.
            </p>
            <p>
              The Tooth Fairy Network brings that story on-chain. Each tooth is verified, minted as a unique digital artifact, and
              permanently recorded. Not because teeth need blockchain &mdash; but because children deserve to see that their
              milestones matter. That truth can be beautiful. That ownership starts young.
            </p>
          </div>
        </motion.div>

        {/* Disclaimer + invitation */}
        <ScrollReveal delay={0.1}>
          <div
            className="mt-16 glass-card rounded-2xl p-8"
          >
            <div className="space-y-5 text-base leading-relaxed" style={{ color: C.text + "bb" }}>
              <p>
                Everything you see on the <Link href="/toothfairy/network" className="underline" style={{ color: C.aurora }}>Network</Link> right
                now is fictitious &mdash; I&rsquo;m playing with the concept.
              </p>
              <p>
                The chat on the bottom right is connected to my private server. Ask anything &mdash; about this project,
                the technology behind it, my thinking, or whatever&rsquo;s on your mind. I see everything and I&rsquo;ll be in touch.
                Answers are limited and managed by Kai, my digital assistant.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Email CTA */}
        <ScrollReveal delay={0.2}>
          <AboutEmailCTA />
        </ScrollReveal>

        {/* Bitcoin article link */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 pt-10 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <Link href="/toothfairy/network/bitcoin-genz" className="group block glass-card rounded-2xl p-6 transition-all">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: C.stardust + "70" }}>Article</span>
              <h3 className="font-display text-lg font-bold mt-2 mb-1 group-hover:underline" style={{ color: C.text }}>
                Bitcoin: A Homie-to-Homie Digital Cash Vibe
              </h3>
              <p className="text-sm" style={{ color: C.muted + "60" }}>
                The Bitcoin whitepaper, translated for Gen Z. 9 pages that forever altered history.
              </p>
            </Link>
          </div>
        </ScrollReveal>
      </main>

      <footer className="relative z-10 py-8 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-[11px] font-mono" style={{ color: C.muted + "40" }}>The Tooth Fairy Network &copy; 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[11px] font-mono hover:underline" style={{ color: C.muted + "40" }}>Home</Link>
            <Link href="/toothfairy/network" className="text-[11px] font-mono hover:underline" style={{ color: C.muted + "40" }}>Network</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function AboutEmailCTA() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const C = { bg: "#050510", nebula: "#7C3AED", aurora: "#06B6D4", text: "#F1F5F9", muted: "#A78BFA" }

  return (
    <div className="mt-12">
      <p className="text-sm mb-4" style={{ color: C.muted + "70" }}>
        Want to connect or discuss further? Leave your email.
      </p>
      <form className="flex gap-2 max-w-md" onSubmit={async (e) => {
        e.preventDefault()
        if (!email.trim() || status === "sending") return
        setStatus("sending")
        try {
          await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: `[SYSTEM] Email signup request from: ${email}`, mode: "standard", history: [] }),
          })
          setStatus("sent")
          setEmail("")
        } catch { setStatus("idle") }
      }}>
        <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all focus:border-white/20" style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          color: C.text,
        }} />
        <motion.button
          type="submit"
          className="px-6 py-3 rounded-xl font-display text-sm font-semibold cursor-pointer relative overflow-hidden"
          style={{ color: C.bg, background: `linear-gradient(135deg, ${C.nebula}, ${C.aurora})` }}
          whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${C.nebula}30` }}
          whileTap={{ scale: 0.98 }}
        >
          {status === "sent" ? "Sent!" : status === "sending" ? "..." : "Connect"}
        </motion.button>
      </form>
    </div>
  )
}
