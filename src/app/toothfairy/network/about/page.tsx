"use client"

import { motion } from "motion/react"
import Link from "next/link"

const C = {
  bg: "#050510",
  surface: "#0F0F2D",
  nebula: "#7C3AED",
  aurora: "#06B6D4",
  stardust: "#F59E0B",
  text: "#F1F5F9",
  muted: "#A78BFA",
}

const QUOTES = [
  { text: "The blockchain is the most important development in history since the advent of writing itself.", source: null },
  { text: "I'd be far more bearish on the future if Bitcoin didn't exist.", source: null },
  { text: "Blockchains provide the technical foundation for a new digital theory of property rights.", source: null },
  { text: "Unpopular truth is a reliable source of profit. Behind every great fortune is a great thought crime.", source: null },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen relative" style={{ background: C.bg, color: C.text }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 px-6 py-4" style={{ backdropFilter: "blur(20px)", background: `${C.bg}cc` }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/toothfairy/network" className="text-sm font-mono hover:underline" style={{ color: C.muted + "80" }}>
            &larr; Back to Network
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/toothfairy/network" className="text-sm font-mono" style={{ color: C.muted + "60" }}>Network</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-5 mb-12">
            <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0" style={{
              border: `2px solid ${C.nebula}30`,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sathian-profile.png" alt="Sathian" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">Sathian</h1>
              <p className="text-sm font-mono" style={{ color: C.muted + "70" }}>Founder &middot; The Tooth Fairy Network</p>
            </div>
          </div>

          <div className="space-y-6 text-base leading-relaxed" style={{ color: C.text + "cc" }}>
            <p>
              I built this for my kids.
            </p>
            <p>
              What started as a simple idea &mdash; what if the Tooth Fairy left more than a coin under the pillow? &mdash; became
              something bigger. A question about ownership, truth, and what we pass on to the next generation.
            </p>
            <p>
              Every child loses teeth. It&rsquo;s one of the first universal human experiences. And every culture has some version
              of the same story: something invisible collects what you&rsquo;ve lost and leaves something valuable in return.
            </p>
            <p>
              The Tooth Fairy Network makes that story real. Each tooth is verified, minted as a unique digital artifact, and
              permanently recorded. Not because teeth need blockchain &mdash; but because children deserve to see that their
              milestones matter. That truth can be beautiful. That ownership starts young.
            </p>
          </div>
        </motion.div>

        {/* Ideology section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <h2 className="font-display text-xl font-bold mb-8" style={{ color: C.aurora }}>On truth &amp; technology</h2>

          <div className="space-y-6">
            {QUOTES.map((q, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="pl-5 py-1"
                style={{ borderLeft: `2px solid ${C.aurora}40` }}
              >
                <p className="text-lg italic leading-relaxed" style={{ color: C.text + "dd" }}>
                  &ldquo;{q.text}&rdquo;
                </p>
              </motion.blockquote>
            ))}
          </div>

          <div className="mt-10 space-y-5 text-base leading-relaxed" style={{ color: C.text + "bb" }}>
            <p>
              We&rsquo;re in the era of verifiable data. The blockchain isn&rsquo;t just about money &mdash; it&rsquo;s a
              cryptographic truth engine. A spinal transplant for the tech industry.
            </p>
            <p>
              By 2040, everyone under 30 will never have known a world without Bitcoin. For them, digital ownership won&rsquo;t
              be novel &mdash; it will be assumed. This site exists at that intersection: childhood wonder meets permanent record.
            </p>
            <p>
              Free markets without corporations. Property rights without paperwork. Truth without permission.
              Even for a child and their teeth.
            </p>
          </div>
        </motion.div>

        {/* What this site is */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <h2 className="font-display text-xl font-bold mb-6" style={{ color: C.stardust }}>What you&rsquo;ll find here</h2>

          <div className="space-y-4 text-base leading-relaxed" style={{ color: C.text + "bb" }}>
            <p>
              The <Link href="/toothfairy/network" className="underline" style={{ color: C.aurora }}>Network</Link> shows
              the global map of verified teeth &mdash; real children, real milestones, permanently recorded.
            </p>
            <p>
              The chat is connected to my private context. You can ask about the project, the technology, my
              ideology, or anything else. Everything comes directly to me. I answer all of it.
            </p>
            <p>
              If you&rsquo;re interested, follow along. If you have ideas, leave a note. If you want to get involved,
              reach out. This is early. The best time to shape something is before it&rsquo;s finished.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mt-20 pt-12 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/toothfairy/network">
              <motion.button
                className="px-8 py-3.5 rounded-xl font-display text-sm font-semibold cursor-pointer"
                style={{ color: C.bg, background: `linear-gradient(135deg, ${C.nebula}, ${C.aurora})` }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore the Network
              </motion.button>
            </Link>
            <span className="text-sm font-mono" style={{ color: C.muted + "50" }}>
              or ask me anything in the chat &rarr;
            </span>
          </div>
        </motion.div>
      </main>

      <footer className="py-8 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-[11px] font-mono" style={{ color: C.muted + "40" }}>The Tooth Fairy Network &copy; 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/toothfairy/network" className="text-[11px] font-mono hover:underline" style={{ color: C.muted + "40" }}>Network</Link>
            <span className="text-[11px] font-mono cursor-pointer hover:underline" style={{ color: C.muted + "40" }}>Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
