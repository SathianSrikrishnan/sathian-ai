import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Market Analysis | Tooth Fairy Network",
  description: "The opportunity: why the tooth fairy ritual is the first financial transaction worth digitizing.",
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

export default function MarketPage() {
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
            <a href="/toothfairy/network/technical" className="px-4 py-2 rounded-lg text-sm transition-colors duration-200 hover:bg-white/[0.05]" style={{ color: C.muted }}>Technical</a>
            <a href="/toothfairy/network/market" className="px-4 py-2 rounded-lg text-sm text-white bg-white/[0.05]">Market</a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-24">

        {/* ═══ HEADER ════════════════════════════════════════════════════ */}
        <div className="mb-20">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: C.amber }}>Market Thesis</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            The first financial transaction
            <br />
            <span style={{ color: C.amber }}>every child already experiences.</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: C.muted }}>
            A tooth falls out. Cash appears under a pillow. It happens in every home, in every
            culture, worldwide. The tooth fairy ritual is the first financial exchange a child
            ever participates in. We&apos;re not creating a market. We&apos;re upgrading one
            that already exists.
          </p>
        </div>

        <div className="space-y-20">

          {/* ═══ THE PROBLEM IS DISTANCE ════════════════════════════════ */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              The problem is distance
            </h2>
            <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <p className="text-base leading-relaxed mb-6" style={{ color: C.muted }}>
                Physical distance. Temporal distance. Emotional distance. From the people you
                love, during the moments that matter. That&apos;s the problem — and every family
                has a version of it.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { family: "Co-parenting families", problem: "750,000 divorces/year in the US alone. When a tooth falls at one home, the other parent isn\u2019t there." },
                  { family: "Long-distance grandparents", problem: "Grandparents in another province, another country. They want to participate, not just hear about it later." },
                  { family: "Immigrant families", problem: "Relatives in Sri Lanka, the Philippines, Nigeria. Milestones cross borders. The family network is global." },
                  { family: "Busy working parents", problem: "Missed the school play. Missed the first bike ride. Life moves fast. Moments don\u2019t wait." },
                  { family: "Military families", problem: "Deployed parent, 6,000 miles away. The child loses a tooth. How do they share that?" },
                  { family: "Blended families", problem: "Step-parents, half-siblings, extended networks. Every person who loves a child deserves to be part of their milestones." },
                ].map((item) => (
                  <div key={item.family} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>{item.family}</p>
                    <p className="text-sm leading-relaxed" style={{ color: C.dim }}>{item.problem}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-base font-medium italic" style={{ color: `${C.text}cc` }}>
                Over the last year, I&apos;ve had dinners with hundreds of strangers in Toronto.
                Every feasible family orientation — without judgment. Every single one has its
                opportunities. Every single one has its challenges. The one constant: love for
                children and the need for them to learn the important things at an early age.
              </p>
            </div>
          </section>

          {/* ═══ THE RITUAL ════════════════════════════════════════════ */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              The ritual already exists
            </h2>
            <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <p className="text-base leading-relaxed mb-8" style={{ color: C.muted }}>
                Every child loses 20 baby teeth between ages 5 and 12. In nearly every culture,
                there&apos;s a ritual around it — in the West, it&apos;s the tooth fairy. Cash under
                a pillow. A child wakes up to money they &ldquo;earned.&rdquo; It&apos;s the first
                financial transaction they ever experience. And right now, it&apos;s analog, ephemeral,
                and disconnected.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { value: "~20M", label: "Children ages 5\u201312 (US)", color: C.amber },
                  { value: "20", label: "Teeth per child", color: C.cyan },
                  { value: "$5.84", label: "Avg payout per tooth", color: C.emerald },
                  { value: "~$2.3B", label: "Annual ritual (US est.)", color: C.rose },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg p-4 text-center" style={{ background: `${stat.color}06`, border: `1px solid ${stat.color}12` }}>
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: stat.color, fontFamily: "var(--font-display)" }}>{stat.value}</div>
                    <div className="mt-1 text-[10px] font-mono uppercase tracking-widest" style={{ color: C.dim }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-base leading-relaxed" style={{ color: C.muted }}>
                That&apos;s roughly <strong style={{ color: C.text }}>$2.3 billion</strong> moving
                informally every year in the US alone — cash under pillows, no record, no education,
                no permanence. And that&apos;s just teeth. Add first bike rides, first days of school,
                graduations — the milestone economy is massive, unmeasured, and entirely undigitized.
              </p>
            </div>
          </section>

          {/* ═══ WHAT TFN ADDS ════════════════════════════════════════ */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              What digitizing the ritual unlocks
            </h2>
            <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <div className="space-y-6 text-sm" style={{ color: C.muted }}>
                <div>
                  <h4 className="text-base font-semibold mb-1" style={{ color: C.text }}>For the child: financial sovereignty starts at age 5</h4>
                  <p className="leading-relaxed">
                    A real digital wallet. Real deposits. Compounding from the first lost tooth.
                    By the time a child loses their last tooth at 12, they have 7 years of savings,
                    7 years of watching money grow, and the foundation of financial literacy that
                    most adults never received. Blockchain inserted into their lives at the youngest
                    possible age — not as speculation, but as education.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold mb-1" style={{ color: C.text }}>For the parent: a permanent record</h4>
                  <p className="leading-relaxed">
                    Every milestone verified, timestamped, and owned by the family — not by a platform
                    that could shut down, change terms, or sell data. A keepsake that outlives any
                    app, any company, any hard drive crash. The digital equivalent of the baby book,
                    except it can&apos;t be lost in a move.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold mb-1" style={{ color: C.text }}>For the family: connection across distance</h4>
                  <p className="leading-relaxed">
                    Grandma in Malaysia contributes to a milestone in Toronto. Uncle in London
                    participates in a first bike ride in Vancouver. The family network activates
                    around every moment. Distance stops being a barrier to participation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ HONEST BUT TOOTHLESS ═════════════════════════════════ */}
          <section>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Honest but toothless
            </h2>
            <p className="text-sm mb-6 italic" style={{ color: C.dim }}>
              (Pun very much intended.)
            </p>
            <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <p className="text-base leading-relaxed mb-6" style={{ color: C.muted }}>
                The business model isn&apos;t proven yet. This is a concept with a strong thesis
                and an honest accounting of what needs to be true for it to work.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: C.muted }}>
                At its core, this is a <strong style={{ color: C.text }}>distribution problem</strong>.
                The technology works. The cost per transaction is negligible. The question is:
                at what scale do transaction fees sustain the business?
              </p>

              {/* The math */}
              <div className="rounded-lg p-6 mb-8" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
                <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: C.amber }}>
                  The unit economics hypothesis
                </p>
                <div className="space-y-3 text-sm font-mono" style={{ color: C.muted }}>
                  <div className="flex justify-between"><span>Cost per keepsake (Base L2 mint)</span><span style={{ color: C.text }}>~$0.08</span></div>
                  <div className="flex justify-between"><span>Avg milestones per family per year</span><span style={{ color: C.text }}>4&ndash;6</span></div>
                  <div className="flex justify-between"><span>Fee per exchange (hypothesis)</span><span style={{ color: C.text }}>$0.50&ndash;$1.00</span></div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "12px" }}>
                    <div className="flex justify-between"><span>At 10K families</span><span style={{ color: C.amber }}>$20K&ndash;$60K / year</span></div>
                    <div className="flex justify-between mt-1"><span>At 100K families</span><span style={{ color: C.emerald }}>$200K&ndash;$600K / year</span></div>
                    <div className="flex justify-between mt-1"><span>At 1M families</span><span style={{ color: C.cyan }}>$2M&ndash;$6M / year</span></div>
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "12px" }}>
                    <div className="flex justify-between"><span>Infrastructure cost at 100K families</span><span style={{ color: C.text }}>~$50K&ndash;$80K / year</span></div>
                    <div className="flex justify-between mt-1"><span>Break-even estimate</span><span style={{ color: C.emerald }}>~5,000&ndash;10,000 families</span></div>
                  </div>
                </div>
              </div>

              <p className="text-base leading-relaxed mb-6" style={{ color: C.muted }}>
                These are hypotheses, not projections. The point is that the cost floor is
                extremely low (thanks to L2 economics), which means the business becomes viable
                at a modest scale — not venture-scale. This can start as a sustainable small
                product and grow.
              </p>

              {/* Model options */}
              <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: C.dim }}>Revenue model options under consideration</p>
              <div className="space-y-4 text-sm" style={{ color: C.muted }}>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: C.text }}>Transaction fee on exchanges</h4>
                  <p>Small fee ($0.50&ndash;$1.00) per milestone exchange. Free to create milestones, free to view. You only pay when money moves.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: C.text }}>Family subscription</h4>
                  <p>$3&ndash;$5/month for unlimited milestones, family graph management, and premium keepsake features. Lower per-transaction friction.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: C.text }}>Platform integration</h4>
                  <p>TFN as a feature within an existing digital wallet or family fintech product. Revenue through licensing or revenue share.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ WHY NOW ══════════════════════════════════════════════ */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Why now</h2>
            <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <div className="space-y-4 text-sm" style={{ color: C.muted }}>
                <div>
                  <strong style={{ color: C.text }}>L2 economics make it viable.</strong>{" "}
                  Two years ago, minting a keepsake cost $20&ndash;$50 on Ethereum. On Base, it costs
                  eight cents. Family-scale economics are now possible for the first time.
                </div>
                <div>
                  <strong style={{ color: C.text }}>Wallet abstraction removes friction.</strong>{" "}
                  Account abstraction means parents don&apos;t need to understand private keys.
                  Onboarding can feel like signing up for any other app.
                </div>
                <div>
                  <strong style={{ color: C.text }}>The narrative is unclaimed.</strong>{" "}
                  Nobody has built a narrative-first, family-first product on blockchain. The
                  tooth fairy is an untouched cultural universal — recognized across every
                  demographic, every income level, every family structure.
                </div>
                <div>
                  <strong style={{ color: C.text }}>Parents are already digitizing everything else.</strong>{" "}
                  Photos, videos, school records, health records — all digital. The one ritual
                  that involves actual money? Still cash under a pillow. That&apos;s an upgrade
                  waiting to happen.
                </div>
              </div>
            </div>
          </section>

          {/* ═══ WHAT'S NOT FIGURED OUT ═══════════════════════════════ */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              What&apos;s not figured out yet
            </h2>
            <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
              <p className="text-base leading-relaxed mb-6" style={{ color: C.muted }}>
                Honesty is the point. Here&apos;s what still needs answers:
              </p>
              <ul className="space-y-3 text-sm" style={{ color: C.muted }}>
                <li>
                  <strong style={{ color: C.text }}>Cold start.</strong> Who are the first 100 families?
                  The product needs a small, passionate early group — likely parents who are already
                  crypto-aware and care about financial education for their kids.
                </li>
                <li>
                  <strong style={{ color: C.text }}>The blockchain barrier.</strong> Most parents
                  don&apos;t know what a wallet is. The onboarding has to be invisible — blockchain
                  as infrastructure, not interface. If a parent has to understand gas fees, we&apos;ve
                  already failed.
                </li>
                <li>
                  <strong style={{ color: C.text }}>Revenue model.</strong> Transaction fee vs.
                  subscription vs. platform integration — this needs real user testing, not
                  spreadsheet modeling.
                </li>
                <li>
                  <strong style={{ color: C.text }}>The &ldquo;why not just Venmo?&rdquo; question.</strong>{" "}
                  A parent will ask: why do I need blockchain for this? The answer has to be felt,
                  not explained — permanence, family ownership, no platform risk, compounding
                  education. If the product doesn&apos;t make this obvious in 30 seconds, the thesis
                  doesn&apos;t matter.
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <p className="text-base mb-2" style={{ color: C.muted }}>
            This is a thesis, not a pitch deck.
          </p>
          <p className="text-sm" style={{ color: C.dim }}>
            If you see the opportunity — or the flaw — I want to hear it.
            Use the chat, or reach out at{" "}
            <a href="/" className="underline underline-offset-4 hover:text-white transition-colors" style={{ color: C.cyan }}>
              sathian.ai
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
