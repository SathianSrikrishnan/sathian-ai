"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"

// ─── Design Tokens (Magic UI–inspired dark minimal) ─────────────────────────
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

// ─── Animation presets ──────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: i * 0.1 },
})

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export function PitchLanding() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Track scroll for nav blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes("@")) setSubmitted(true)
  }

  return (
    <div className="relative" style={{ background: C.bg, color: C.text }}>

      {/* ─── Subtle background radial ────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${C.rose}12, transparent)`,
      }} />

      {/* ═══ NAV ═════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? `${C.bg}e6` : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-base font-display font-bold tracking-tight">
            Tooth Fairy Network
          </span>
          <div className="hidden sm:flex items-center gap-1">
            {[
              { label: "Story", href: "#" },
              { label: "Technical", href: "/toothfairy/network/technical" },
              { label: "Market", href: "/toothfairy/network/market" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm transition-colors duration-200 hover:bg-white/[0.05]"
                style={{ color: C.muted }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#feedback"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{ background: C.rose }}
            >
              Share Feedback
            </a>
          </div>
        </div>
      </nav>

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
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-tight leading-[0.95]">
            Every tooth
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${C.rose}, ${C.cyan})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              tells a story.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: C.muted }}>
            I&apos;m building a platform where childhood milestones become permanent digital
            keepsakes — and children start building real savings from their very first lost tooth.
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
              Share Your Thoughts
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
              <p className="text-base leading-relaxed mb-4" style={{ color: C.muted }}>
                In the US alone, 750,000 divorces a year create over a million children splitting
                time between homes. But this isn&apos;t just a co-parenting problem — it&apos;s
                a <strong style={{ color: C.text }}>distance</strong> problem. Every family
                orientation has it. Nuclear, blended, single-parent, multi-generational.
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: C.muted }}>
                The Tooth Fairy Network gives{" "}
                <strong style={{ color: C.text }}>everyone who loves a child</strong> — parents,
                grandparents, aunts, uncles — a way to participate in milestones they can&apos;t
                physically witness. And it gives the child something real: their first savings,
                their first digital wallet, their first lesson in financial responsibility.
              </p>
              <p className="text-base font-display font-medium italic" style={{ color: `${C.text}cc` }}>
                &ldquo;You shouldn&apos;t have to be in the room to be part of the moment.&rdquo;
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
                  background: "rgba(255,255,255,0.02)",
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
                  Their first digital wallet. Their first deposit. Financial sovereignty starts with their very first lost tooth.
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

      {/* ═══ BEYOND TEETH ════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            {/* Image */}
            <motion.div
              {...fadeUp}
              className="relative w-full lg:w-1/2 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: `1px solid ${C.border}` }}
            >
              <Image src="/v2-storyboard/objects/obj-06-network-globe.png" alt="Growth milestones" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, transparent 40%, ${C.bg}cc 100%)` }} />
            </motion.div>

            {/* Milestones */}
            <motion.div {...fadeUp} className="flex-1">
              <p className="text-sm font-semibold tracking-wide uppercase mb-4" style={{ color: C.cyan }}>
                The Vision
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-2">
                Teeth are just the beginning.
              </h2>
              <p className="text-base mb-8" style={{ color: C.muted }}>
                Every family has these moments. We&apos;re making them permanent.
              </p>
              <div>
                {[
                  { icon: "\uD83E\uDDB7", title: "First Tooth Lost", desc: "The classic. The one that started it all." },
                  { icon: "\uD83D\uDEB2", title: "First Bike Ride", desc: "Grandparent contributes from across the country." },
                  { icon: "\uD83C\uDF92", title: "First Day of School", desc: "The whole family participates. The savings grow." },
                  { icon: "\uD83C\uDFCA", title: "Learning to Swim", desc: "Uncle sends money. The child\u2019s account grows." },
                  { icon: "\uD83C\uDF93", title: "Graduation", desc: "Years of milestones. One permanent collection." },
                ].map((m, i) => (
                  <motion.div
                    key={m.title}
                    {...stagger(i)}
                    className="flex items-start gap-4 py-4"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{m.icon}</span>
                    <div>
                      <div className="text-base font-display font-semibold">{m.title}</div>
                      <div className="text-sm mt-0.5" style={{ color: C.muted }}>{m.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ WHY I'M BUILDING THIS ═══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: C.rose }}>
              The Builder
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-6">
              Why I&apos;m building this
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: C.muted }}>
              I&apos;m a father. This started as something I wanted for my own family — a way
              to make sure that when my children hit a milestone, everyone who loves them can
              be part of it, no matter where they are.
            </p>
            <p className="text-base leading-relaxed mb-4" style={{ color: C.muted }}>
              The more I talked to other parents, the more I realized this isn&apos;t just my
              problem. It&apos;s a universal one. Every co-parenting family, every long-distance
              grandparent, every uncle who misses the moment.
            </p>
            <p className="text-base leading-relaxed" style={{ color: C.muted }}>
              I&apos;m building this in the open. The technology underneath uses blockchain to
              make these keepsakes permanent and verifiable — but you shouldn&apos;t need to
              understand any of that to use it. If you&apos;re curious about the technical
              details, there&apos;s a{" "}
              <a
                href="/toothfairy/network/technical"
                className="underline underline-offset-4 transition-colors hover:text-white"
                style={{ color: C.cyan }}
              >
                technical page
              </a>{" "}
              for that.
            </p>
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
              This is early. The concept is live but the product is still being built.
            </p>
            <p className="text-base mb-10" style={{ color: C.muted }}>
              If you&apos;re a parent, a builder, or just curious — tell me what you think.
              Use the chat, or leave your email to follow along.
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
                  className="px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 cursor-pointer"
                  style={{ background: C.rose, color: "white" }}
                >
                  Follow Along
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="py-16 px-6" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-12 mb-12">
            <div>
              <span className="text-base font-display font-bold">Tooth Fairy Network</span>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
                Childhood milestones, made permanent.
                <br />A product by{" "}
                <a href="/" className="underline underline-offset-4 hover:text-white transition-colors" style={{ color: C.muted }}>
                  sathian.ai
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: C.dim }}>
                Explore
              </p>
              <div className="flex flex-col gap-2">
                <a href="#how-it-works" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: C.muted }}>How It Works</a>
                <a href="#video" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: C.muted }}>Video</a>
                <a href="/toothfairy/network/technical" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: C.muted }}>Technical Details</a>
                <a href="/toothfairy/network/market" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: C.muted }}>Market Analysis</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: C.dim }}>
                More
              </p>
              <div className="flex flex-col gap-2">
                <a href="/toothfairy/network/about" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: C.muted }}>About Sathian</a>
                <a href="/toothfairy/network/bitcoin-genz" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: C.muted }}>Bitcoin Gen Z</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: `1px solid ${C.border}` }}>
            <span className="text-xs" style={{ color: C.dim }}>
              &copy; {new Date().getFullYear()} sathian.ai
            </span>
            <span className="text-xs" style={{ color: C.dim }}>
              Built with care in Toronto
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
