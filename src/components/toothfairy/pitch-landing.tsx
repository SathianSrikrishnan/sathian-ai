"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import { C, fadeUp, stagger } from "./tokens"
import { TfnNav } from "./tfn-nav"

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export function PitchLanding() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Autoplay video when visible
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

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@") || submitting) return
    setSubmitting(true)
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Still show success — Telegram/Notion are best-effort
    }
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="relative" style={{ background: C.bg, color: C.text }}>

      {/* ─── Subtle background radial ────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${C.rose}12, transparent)`,
      }} />

      {/* ═══ NAV ═════════════════════════════════════════════════════════ */}
      <TfnNav activePage="story" />

      {/* ═══ HERO ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8"
            style={{
              background: `${C.rose}10`,
              color: C.rose,
              border: `1px solid ${C.rose}20`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.rose }} />
            Currently building &middot; by sathian.ai
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05]">
            Turn your child&apos;s lost tooth into
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${C.rose}, ${C.cyan})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              savings and a keepsake.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: C.muted }}>
            Every tooth tells a story. I&apos;m building the platform that turns each one
            into a permanent digital keepsake and your child&apos;s first real savings.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <a
              href="#video"
              className="px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{ background: C.rose, color: "white" }}
            >
              Watch the Story
            </a>
            <a
              href="#feedback"
              className="px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white/[0.06]"
              style={{ border: `1px solid ${C.border}`, color: C.muted }}
            >
              Share Feedback
            </a>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl mx-auto mt-16 aspect-[16/9] rounded-xl overflow-hidden"
          style={{ border: `1px solid ${C.border}` }}
        >
          <Image
            src="/v2-storyboard/compositions/comp-05-finale-v2.png"
            alt="The Tooth Fairy Network"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 40%)` }}
          />
        </motion.div>
      </section>

      {/* ═══ THE PROBLEM ═════════════════════════════════════════════════ */}
      <section className="py-24 px-6" id="problem">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Image */}
            <motion.div
              {...fadeUp}
              className="relative w-full lg:w-1/2 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: `1px solid ${C.border}` }}
            >
              <Image src="/v2-storyboard/characters/char-01-girl-sleeping-a.png" alt="A child sleeping" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${C.bg}88 0%, transparent 60%)` }} />
            </motion.div>

            {/* Text */}
            <motion.div {...fadeUp} className="flex-1">
              <p className="text-sm font-semibold tracking-wide uppercase mb-4" style={{ color: C.amber }}>
                The Problem
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-6 leading-tight">
                Every family.
                <br />
                <span style={{ color: C.amber }}>Every milestone that gets missed.</span>
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: C.muted }}>
                A grandparent in another province. A co-parent across town. An uncle overseas.
                A working parent who missed the school play. When a tooth falls or a first bike
                ride happens — someone who loves that child isn&apos;t there.
              </p>
              <p className="text-base leading-relaxed" style={{ color: C.muted }}>
                This isn&apos;t just a co-parenting problem — it&apos;s a{" "}
                <strong style={{ color: C.text }}>distance</strong> problem. Every family
                orientation has it. Nuclear, blended, single-parent, multi-generational.{" "}
                <a
                  href="/toothfairy/network/market"
                  className="underline underline-offset-4 transition-colors hover:text-white"
                  style={{ color: C.amber }}
                >
                  Read the full market thesis &rarr;
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════════════════════ */}
      <section className="py-24 px-6" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: C.cyan }}>
              How It Works
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
              Three simple steps
            </h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: C.muted }}>
              No jargon. No complexity. Just milestones, memories, and money.
            </p>
          </motion.div>

          {/* Step cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "A milestone happens",
                desc: "A tooth falls out. A first bike ride. A graduation. The child or parent captures the moment — a photo, a date, a story.",
                color: C.amber,
                img: "/v2-storyboard/objects/obj-01-tooth-glowing.png",
                imgAlt: "A glowing tooth — the milestone moment",
              },
              {
                num: "02",
                title: "A keepsake is created",
                desc: "A unique digital keepsake is created and shared with the whole family. Grandparents across the country see it instantly.",
                color: C.cyan,
                img: "/v2-storyboard/objects/obj-03-nft-card.png",
                imgAlt: "A digital keepsake card",
              },
              {
                num: "03",
                title: "The child gets paid",
                desc: "Real money — crypto or dollars — lands in the child\u2019s digital wallet. Not a token under the pillow. Their first real savings, growing with every milestone.",
                color: C.rose,
                img: "/v2-storyboard/objects/obj-05-wallet-child.png",
                imgAlt: "A child's digital wallet",
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                {...stagger(i)}
                className="rounded-xl overflow-hidden transition-colors duration-300"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={step.img} alt={step.imgAlt} fill className="object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 50%)` }} />
                </div>
                <div className="px-6 pb-6 sm:px-8 sm:pb-8 -mt-8 relative z-10">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-mono font-black mb-5"
                    style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}25` }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Exchange — distinct frame */}
          <motion.div
            {...fadeUp}
            className="mt-20 rounded-2xl p-8 sm:p-12"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
              border: `1px solid ${C.border}`,
            }}
          >
            <p className="text-center text-sm font-semibold tracking-wide uppercase mb-6" style={{ color: C.dim }}>
              The result
            </p>
            <div className="relative w-full max-w-2xl mx-auto aspect-[16/9] rounded-xl overflow-hidden mb-8">
              <Image src="/v2-storyboard/compositions/comp-03-two-streams-split.png" alt="Two streams — keepsake to parent, savings to child" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg}cc 0%, transparent 60%)` }} />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6 sm:gap-8">
              <div
                className="flex-1 rounded-xl px-8 py-8 text-center"
                style={{ background: `${C.cyan}06`, border: `1px solid ${C.cyan}15` }}
              >
                <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: C.cyan }}>
                  Parent Gets
                </p>
                <p className="text-2xl font-display font-bold mb-2">A permanent keepsake</p>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                  Yours forever. Can&apos;t be lost, deleted, or taken away. Verifiable proof of a moment that mattered.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl font-mono" style={{ color: C.dim }}>&harr;</div>
              </div>
              <div
                className="flex-1 rounded-xl px-8 py-8 text-center"
                style={{ background: `${C.emerald}06`, border: `1px solid ${C.emerald}15` }}
              >
                <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: C.emerald }}>
                  Child Gets
                </p>
                <p className="text-2xl font-display font-bold mb-2">Real savings</p>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                  Their first digital wallet. Their first deposit. Learning about money starts with their very first lost tooth.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ VIDEO ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" id="video">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: C.rose }}>
              See It
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
              The vision in 59 seconds
            </h2>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="relative rounded-xl overflow-hidden"
            style={{ border: `1px solid ${C.border}`, boxShadow: `0 0 80px ${C.rose}08` }}
          >
            <video
              ref={videoRef}
              src="/toothfairy-network-v3.1.mp4"
              controls
              muted
              playsInline
              preload="metadata"
              poster="/v2-storyboard/compositions/comp-01-fairy-enters-bedroom.png"
              className="w-full aspect-video"
              style={{ background: C.bg }}
            />
          </motion.div>
        </div>
      </section>

      {/* ═══ THE ASK / FEEDBACK CTA ══════════════════════════════════════ */}
      <section className="py-32 px-6" id="feedback">
        <div className="relative max-w-2xl mx-auto text-center">
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className="w-[500px] h-[500px] rounded-full"
              style={{ background: `radial-gradient(circle, ${C.rose}06 0%, transparent 60%)` }}
            />
          </div>

          <motion.div {...fadeUp} className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-4">
              I&apos;d love your feedback.
            </h2>
            <p className="text-lg mb-4" style={{ color: C.muted }}>
              I&apos;m building this for my own children — a way to make sure that when
              they hit a milestone, everyone who loves them can be part of it. This is
              early, and I&apos;m building in the open.
            </p>
            <p className="text-base mb-10" style={{ color: C.muted }}>
              If you&apos;re a parent, a builder, or just curious — leave your email to follow along.
            </p>

            {submitted ? (
              <div
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl"
                style={{ background: `${C.emerald}10`, border: `1px solid ${C.emerald}25` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: C.emerald }} />
                <span className="text-sm font-mono" style={{ color: C.emerald }}>
                  You&apos;re on the list. I&apos;ll be in touch.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-mono outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${C.border}`,
                    color: C.text,
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 cursor-pointer disabled:opacity-60"
                  style={{ background: C.rose, color: "white" }}
                >
                  {submitting ? "Joining..." : "Follow Along"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="py-8 px-6" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-display font-bold tracking-tight">The Tooth Fairy Network</span>
          <span className="text-xs" style={{ color: C.dim }}>
            &copy; {new Date().getFullYear()}{" "}
            <a href="https://sathian.ai" className="underline underline-offset-4 hover:text-white transition-colors" style={{ color: C.dim }}>
              sathian.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
