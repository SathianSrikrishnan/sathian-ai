import type { Metadata } from 'next'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { unlockBitcoinBay } from './actions'
import {
  BITCOINBAY_ACCESS_COOKIE,
  readAccessConfig,
  verifyAccessToken,
} from '@/lib/bitcoinbay-access'
import styles from './bitcoinbay.module.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Private Bitcoin Bay proposal | Sathian',
  description: 'A private working proposal for a small, hands-on Bitcoin node lab.',
  alternates: { canonical: '/bitcoinbay' },
  robots: { index: false, follow: false },
}

interface BitcoinBayPageProps {
  searchParams?: { error?: string | string[] }
}

function AccessGate({ error, configured }: { error?: string; configured: boolean }) {
  const invalid = error === 'invalid'

  return (
    <main className={styles.gate} data-bitcoinbay-page>
      <Image
        className={styles.gateArt}
        src="/images/bitcoinbay/signal-path-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.gateShade} />
      <header className={styles.gateHeader}>
        <div className={styles.brandLockup}>
          <Image src="/images/bitcoinbay/bitcoin-bay-logo.svg" alt="Bitcoin Bay" width={31} height={31} />
          <span>Bitcoin Bay <i>×</i> Sathian</span>
        </div>
        <span>Private working page</span>
      </header>
      <section className={styles.gatePanel} aria-labelledby="gate-title">
        <p className={styles.eyebrow}><span>PRIVATE LINK</span> FOR LEO, ALWYN &amp; ANTOINE</p>
        <h1 id="gate-title">A small proposal.<br /><em>One shared code.</em></h1>
        <p>This page is being shared directly by Sathian. Enter the code from his message to continue.</p>
        {configured ? (
          <form action={unlockBitcoinBay} className={styles.gateForm}>
            <label htmlFor="bitcoinbay-code">Access code</label>
            <div>
              <input
                id="bitcoinbay-code"
                name="code"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4,8}"
                minLength={4}
                maxLength={8}
                autoComplete="one-time-code"
                autoFocus
                required
                aria-describedby={invalid ? 'gate-error' : undefined}
              />
              <button type="submit">Open proposal <span aria-hidden="true">→</span></button>
            </div>
            {invalid && <p id="gate-error" className={styles.gateError} role="alert">That code did not match. Check Sathian’s message and try again.</p>}
          </form>
        ) : (
          <p className={styles.gateError} role="status">This private page is temporarily unavailable. Sathian has been notified.</p>
        )}
        <small>Light privacy for a working proposal—not a vault for confidential information.</small>
      </section>
    </main>
  )
}

export default function BitcoinBayPage({ searchParams }: BitcoinBayPageProps) {
  const config = readAccessConfig()
  const accessToken = cookies().get(BITCOINBAY_ACCESS_COOKIE)?.value
  const unlocked = config ? verifyAccessToken(accessToken, config.secret) : false
  const error = Array.isArray(searchParams?.error) ? searchParams?.error[0] : searchParams?.error

  if (!unlocked) return <AccessGate error={error} configured={Boolean(config)} />

  return (
    <main className={styles.page} data-bitcoinbay-page>
      <header className={styles.masthead}>
        <a className={styles.brandLockup} href="#top">
          <Image src="/images/bitcoinbay/bitcoin-bay-logo.svg" alt="Bitcoin Bay" width={31} height={31} />
          <span>Bitcoin Bay <i>×</i> Sathian</span>
        </a>
        <div className={styles.mastheadMeta}>
          <span>Shared privately</span>
          <span>11 Aug 2026</span>
        </div>
      </header>

      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <Image
          className={styles.heroArt}
          src="/images/bitcoinbay/signal-path-hero.png"
          alt="Four illuminated ledger blocks form a path toward a vertical signal of light"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span>01</span> A WORKING PROPOSAL</p>
          <h1 id="hero-title">Bitcoin Bay already has the signal.<br /><em>Let’s build the path.</em></h1>
          <p className={styles.heroDeck}>A four-week node lab designed to turn event energy into a small cohort of people who can run, understand, and explain a Bitcoin node.</p>
          <div className={styles.heroActions}>
            <a href="#proposal">See the experiment <span aria-hidden="true">↓</span></a>
            <p>For Leo, Alwyn &amp; Antoine<br /><span>From Sathian, after August 10</span></p>
          </div>
        </div>
        <div className={styles.heroProof}>
          <span aria-hidden="true" />
          <p>Working draft<strong>Open to shaping together</strong></p>
        </div>
      </section>

      <section className={styles.paperSection} aria-labelledby="opportunity-title">
        <div className={styles.sectionIndex}><span>02 / WHAT I SAW</span><span>Strong foundation. Clear next opportunity.</span></div>
        <div className={styles.opportunityGrid}>
          <div>
            <h2 id="opportunity-title">What impressed me.<br /><em>What we could build.</em></h2>
            <p className={styles.pullquote}>“You already have the rare ingredients: conviction, knowledge, history, and a real place to gather.”</p>
          </div>
          <div className={styles.opportunityCopy}>
            <p>I left the August 10 event energized by the people behind Bitcoin Bay: genuinely motivated, deeply knowledgeable, and carrying more than a decade of Bitcoin history.</p>
            <p>The opportunity I kept thinking about is simple: give people one concrete next action that turns an inspiring event into practical participation.</p>
            <p>Rather than trying to redesign everything, I would start with one small format we can test, learn from, and improve together.</p>
          </div>
        </div>
        <div className={styles.signalRail}>
          <div><span>01</span><strong>Technical depth</strong></div>
          <div><span>02</span><strong>Real conviction</strong></div>
          <div><span>03</span><strong>A physical home</strong></div>
          <div><span>04</span><strong>One practical next step</strong></div>
        </div>
      </section>

      <section className={styles.inkSection} id="proposal" aria-labelledby="proposal-title">
        <div className={styles.sectionIndex}><span>03 / THE EXPERIMENT</span><span>Four Mondays. Ninety minutes. Hands on.</span></div>
        <div className={styles.proposalHeading}>
          <div>
            <p className={`${styles.eyebrow} ${styles.orange}`}><span>WORKING NAME</span> COHORT 001</p>
            <h2 id="proposal-title">The Node Lab</h2>
          </div>
          <p>A small-group build series where the output is not more inspiration. It is a working node—or a credible, supported path to one.</p>
        </div>
        <ol className={styles.sessionTrack} aria-label="Draft four-session schedule">
          <li><span>01</span><p>Monday</p><strong>August 17</strong><small>Foundations + hardware</small></li>
          <li><span>02</span><p>Monday</p><strong>August 24</strong><small>Install + sync</small></li>
          <li><span>03</span><p>Monday</p><strong>August 31</strong><small>Verify + operate</small></li>
          <li className={styles.dateRisk}><span>04</span><p>Monday</p><strong>September 7</strong><small>Labour Day—confirm, or move to September 14</small></li>
        </ol>
        <div className={styles.outcomeBand}>
          <p>THE PARTICIPANT PROMISE</p>
          <blockquote>Leave with a working node—or a credible path to one—and enough confidence to help the next person begin.</blockquote>
        </div>
      </section>

      <section className={styles.paperSection} aria-labelledby="room-title">
        <div className={styles.sectionIndex}><span>04 / KEEP IT SMALL</span><span>Less production. More participation.</span></div>
        <div className={styles.roomHeading}>
          <div>
            <p className={styles.eyebrow}><span>THE TWO-PIZZA ROOM</span> ONE CLEAR OUTCOME</p>
            <h2 id="room-title">Six learners.<br />Up to three hosts.</h2>
          </div>
          <p>Borrow the spirit of Amazon’s two-pizza rule: fewer than ten people total, so nobody disappears into the room and every learner can get hands-on help.</p>
        </div>
        <div className={styles.commitmentGrid}>
          <article><span>ACCESS</span><strong>$10 suggested</strong><p>Keep a no-friction free/student route. If someone attends free, invite them to help document, share, volunteer, or teach the next person.</p></article>
          <article><span>FOOD</span><strong>$50–$100 from Sathian</strong><p>I’ll put this toward the two pizzas, drinks, or simple snacks. Keep it light and useful.</p></article>
          <article><span>OPTION</span><strong>One simple sponsor</strong><p>If the team wants, a local sponsor can cover the food. One line of thanks; no sponsor deck and no extra machinery.</p></article>
        </div>

        <div className={styles.hardwareBlock}>
          <header>
            <p className={styles.eyebrow}><span>BRING TO THE LAB</span> WORKING FLOOR—BITCOIN BAY TO CONFIRM</p>
            <h3>A machine we can actually build on.</h3>
          </header>
          <ul>
            <li><span>01</span><p>A recent Windows, macOS, or Linux machine with at least <strong>8 GB RAM</strong>.</p></li>
            <li><span>02</span><p>For a full-chain build: <strong>1 TB SSD</strong> minimum today, with <strong>2 TB preferred</strong> for breathing room.</p></li>
            <li><span>03</span><p>Power adapter, reliable Wi-Fi, and an Ethernet adapter or cable if available.</p></li>
            <li><span>04</span><p>A pruned setup can be the space-limited path; it still completes the initial blockchain download.</p></li>
            <li><span>05</span><p>Linux-capable Chromebooks, mini-PCs, and dedicated node boxes are welcome after a quick compatibility preflight.</p></li>
          </ul>
          <p className={styles.sourceNote}>Bitcoin.org currently estimates roughly 740 GB for initial synchronization and describes a full-node install as requiring more than 750 GB. The final supported stack should be tested and owned by Bitcoin Bay. <a href="https://bitcoin.org/en/full-node" target="_blank" rel="noreferrer">Review the full-node guide ↗</a></p>
        </div>
      </section>

      <section className={styles.inkSection} aria-labelledby="roles-title">
        <div className={styles.sectionIndex}><span>05 / OPERATING SPLIT</span><span>Each side owns what it does best.</span></div>
        <h2 id="roles-title" className={styles.displayHeading}>A real collaboration.<br /><em>Not vague help.</em></h2>
        <div className={styles.rolesGrid}>
          <article>
            <header><span>OFFER + EXPERIENCE</span><h3>Sathian brings</h3></header>
            <ol>
              <li><span>01</span> A sharp promise, audience, and offer</li>
              <li><span>02</span> The landing/Luma page and registration journey</li>
              <li><span>03</span> Content, distribution, and participant communication</li>
              <li><span>04</span> Co-hosting, facilitation, feedback, and iteration</li>
              <li><span>05</span> A venue preflight: clean, organize, and get ready</li>
            </ol>
          </article>
          <article className={styles.orangeRole}>
            <header><span>CURRICULUM + BUILD</span><h3>Bitcoin Bay brings</h3></header>
            <ol>
              <li><span>01</span> The technical curriculum and learning sequence</li>
              <li><span>02</span> Hardware requirements and setup</li>
              <li><span>03</span> Instruction, troubleshooting, and live build support</li>
              <li><span>04</span> The venue and a credible technical home</li>
              <li><span>05</span> The context only a long-running Bitcoin team can bring</li>
            </ol>
          </article>
        </div>
      </section>

      <section className={`${styles.inkSection} ${styles.why}`} aria-labelledby="why-title">
        <div className={styles.sectionIndex}><span>06 / WHY I’M IN</span><span>Attendee → student → useful co-host</span></div>
        <div className={styles.whyGrid}>
          <h2 id="why-title">I’m not offering to be the Bitcoin expert.</h2>
          <div className={styles.whyLetter}>
            <p>I want to learn this properly, help shape a better experience around it, and become useful to a community I respect.</p>
            <p>I work across Web3 communities and I’m continuing to learn smart contracts and adjacent systems. That broad curiosity has not erased my long-standing conviction around Bitcoin.</p>
            <p><strong>I’m not looking to charge for this first pilot.</strong> I see it as a learning exchange, a collaborative contribution, and a chance to move from attendee to useful co-host by doing the work.</p>
            <footer>— Sathian</footer>
          </div>
        </div>
      </section>

      <section className={styles.orangeSection} aria-labelledby="next-title">
        <div className={styles.sectionIndex}><span>07 / IF THE PILOT WORKS</span><span>Build the story around real proof.</span></div>
        <div className={styles.nextGrid}>
          <div><p className={`${styles.eyebrow} ${styles.dark}`}><span>PHASE TWO</span> EARNED, NOT ASSUMED</p><h2 id="next-title">Package the decade Bitcoin Bay has already lived.</h2></div>
          <div>
            <p><span>01</span> Surface the roots, archive imagery, and real proof of work.</p>
            <p><span>02</span> Shape the website and event content around clearer actions.</p>
            <p><span>03</span> Create a reusable event format and a consistent follow-through.</p>
            <p><span>04</span> Tell the founders’ stories in their own voices, with their approval.</p>
          </div>
        </div>
      </section>

      <section className={styles.inkSection} id="decisions" aria-labelledby="decisions-title">
        <div className={styles.sectionIndex}><span>08 / DECISION GATE</span><span>One room. One hour. Six answers.</span></div>
        <div className={styles.decisionIntro}>
          <h2 id="decisions-title">Let’s pressure-test this in one 60-minute working session.</h2>
          <p>I’m nearby and flexible, including weekends. If the offer survives these six questions, I can turn it into the shareable registration page and participant journey.</p>
        </div>
        <ol className={styles.decisionList}>
          <li><span>01</span><p>Is the outcome to <strong>install</strong> a node, <strong>understand</strong> a node, or both?</p></li>
          <li><span>02</span><p>Who is cohort one: beginners, technically curious people, or existing Bitcoiners?</p></li>
          <li><span>03</span><p>Which hardware paths can the team confidently support?</p></li>
          <li><span>04</span><p>Does six learners plus up to three hosts feel right for the first room?</p></li>
          <li><span>05</span><p>Keep September 7, or move the final session to September 14?</p></li>
          <li><span>06</span><p>Invitation-only, public, or a deliberately mixed cohort?</p></li>
        </ol>
        <div className={styles.cta}>
          <div><p className={`${styles.eyebrow} ${styles.orange}`}><span>NEXT MOVE</span> 60 MINUTES</p><h3>If this feels directionally right, let’s get in a room and make it real.</h3></div>
          <a href="#top">Return to the signal <span aria-hidden="true">↑</span></a>
        </div>
        <p className={styles.referenceLine}>The cohort-size idea borrows from Amazon’s two-pizza-team principle: small, single-purpose teams with fewer than ten people. <a href="https://aws.amazon.com/executive-insights/content/amazon-two-pizza-team/" target="_blank" rel="noreferrer">Read Amazon’s explanation ↗</a></p>
      </section>

      <footer className={styles.footer}>
        <div><Image src="/images/bitcoinbay/bitcoin-bay-logo.svg" alt="Bitcoin Bay" width={26} height={26} /><span>×</span><strong>SATHIAN.AI</strong></div>
        <p>Shared privately for discussion · no commitments assumed</p>
        <p>Prepared after the Bitcoin Bay event · Toronto · 10 August 2026</p>
      </footer>
    </main>
  )
}
