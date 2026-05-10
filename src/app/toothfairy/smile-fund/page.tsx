import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Smile Fund - Tooth Fairy Network",
  description:
    "A parent-controlled Smile Fund preview helps a tooth memory become an early lesson about saving, patience, responsibility, and care.",
}

const lessons = [
  {
    title: "Saving is visible",
    body: "A small gift becomes something they can point to, revisit, and understand as patience over time.",
  },
  {
    title: "Ownership has context",
    body: "Any future gift is attached to a real family moment, so ownership starts with memory instead of speculation.",
  },
  {
    title: "Parents stay in control",
    body: "Access, timing, and explanations stay with the parent until the child is ready for the next lesson.",
  },
]

const timeline = [
  "The tooth moment is saved as a first forever memory.",
  "Grandparents and family can celebrate the page without needing a wallet.",
  "Family gifts can start the Smile Fund after the card-funded gift path is ready.",
  "The child grows into saving, patience, responsibility, and why ownership matters with a parent guiding the pace.",
]

const status = [
  ["Live now", "Memory creation, Google sign-in, public family links, and a parent-controlled gift preview."],
  ["Not live yet", "Card-funded gifts are paused until provider verification, receipts, fee disclosures, and terms are final."],
  ["Boundary", "The Smile Fund is an educational savings experience, not investment advice or an investment product."],
]

const parentResources = [
  {
    source: "CFPB",
    title: "Young children and saving",
    href: "https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/young-children/explore-saving/",
    body: "Use waiting, jars, and small choices to make saving concrete before money feels abstract.",
  },
  {
    source: "Investor.gov",
    title: "Small Savings Add Up to Big Money",
    href: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/small-savings-add-big-money",
    body: "A simple parent reference for showing how small habits can matter over a long time.",
  },
  {
    source: "Investor.gov",
    title: "Risk and timing basics",
    href: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/understand-what-it-means-invest",
    body: "A parent-facing reminder that savings conversations should include care, risk, and timing.",
  },
]

export default function SmileFundPage() {
  return (
    <main className="smile-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Smile Fund</p>
          <h1>A small gift can become a gentle money lesson.</h1>
          <p>
            The Smile Fund starts as a preview beside the tooth memory. Parents
            keep the pace gentle while children begin to learn patience, saving,
            responsibility, and why care matters.
          </p>
          <div className="actions">
            <Link href="/toothfairy/app/draw?from=smile-fund">Create a memory</Link>
            <Link href="/toothfairy/faq">Read parent FAQ</Link>
            <Link href="/toothfairy/grandparents">Grandparent guide</Link>
          </div>
        </div>

        <div className="hero-panel" aria-label="Smile Fund preview">
          <div className="fund-card">
            <p>Little Smile Fund</p>
            <strong>$360</strong>
            <span>Family gift preview</span>
            <div className="locked-row" aria-label="Example Smile Fund gift">
              <i aria-hidden />
              <div>
                <b>Example Smile Fund gift</b>
                <small>Held with the memory until the child is ready</small>
              </div>
            </div>
            <div className="bars" aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="image-frame">
            <Image
              src="/toothfairy/visual-system/watch-grow-v1.png"
              alt="A child watching their Smile Fund grow"
              fill
              priority
              sizes="(min-width: 960px) 460px, 88vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="lesson-band" aria-label="Smile Fund lessons">
        <div className="lesson-heading">
          <p className="eyebrow">What it teaches</p>
          <h2>The gift is optional. The lesson comes first.</h2>
        </div>
        <div className="lesson-grid">
          {lessons.map((lesson) => (
            <article key={lesson.title}>
              <h3>{lesson.title}</h3>
              <p>{lesson.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flow">
        <div>
          <p className="eyebrow">Family flow</p>
          <h2>Memory first, gifts later, responsibility over time.</h2>
          <p>
            A lost tooth should not become a transaction. The memory is the
            emotional anchor. The Smile Fund is the learning layer that can
            slowly introduce saving, patience, responsibility, and ownership
            without handing a child grown-up financial control too early.
          </p>
        </div>
        <ol>
          {timeline.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="resources" aria-label="Parent learning resources">
        <div className="resources-heading">
          <p className="eyebrow">Parent reading</p>
          <h2>Trusted references for the lesson underneath.</h2>
          <p>
            The Smile Fund should make parents feel prepared, not sold to. These
            references keep the focus on saving, small habits, and the risk
            boundary around any grown-up money decision.
          </p>
        </div>
        <div className="resource-grid">
          {parentResources.map((resource) => (
            <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer">
              <span>{resource.source}</span>
              <strong>{resource.title}</strong>
              <p>{resource.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="status">
        <div className="status-heading">
          <p className="eyebrow">Launch status</p>
          <h2>What families can trust right now.</h2>
        </div>
        <div className="status-grid">
          {status.map(([title, body]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="close">
        <p>
          Parent-controlled means the child can feel ownership before they are
          responsible for accounts, trading, or grown-up financial decisions.
          That is the point.
        </p>
        <Link href="/toothfairy/app/draw?from=smile-fund">Start with the memory</Link>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .smile-page {
          --navy: #10234c;
          --ink: #24385f;
          --muted: #65728a;
          --purple: #6d45a8;
          --gold: #d8a43c;
          --mint: #33b89f;
          --rose: #c94b7c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.80);
          --border: rgba(178, 151, 107, 0.32);
          min-height: 100vh;
          background:
            linear-gradient(90deg, rgba(16, 35, 76, 0.045) 1px, transparent 1px),
            linear-gradient(180deg, #fffaf1, var(--cream));
          background-size: 56px 56px, auto;
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .lesson-band,
        .flow,
        .resources,
        .status,
        .close {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .hero {
          display: grid;
          gap: 2.6rem;
          align-items: center;
          min-height: min(740px, calc(100vh - 72px));
          padding: 66px 0 46px;
        }

        .hero-copy {
          max-width: 760px;
        }

        .eyebrow {
          margin: 0 0 0.78rem;
          color: #9b690f;
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3 {
          margin: 0;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          letter-spacing: 0;
        }

        h1 {
          max-width: 800px;
          font-size: clamp(3rem, 7vw, 5.45rem);
          line-height: 0.94;
        }

        h2 {
          font-size: clamp(2.15rem, 4vw, 3.45rem);
          line-height: 0.98;
        }

        h3 {
          font-size: 1.55rem;
          line-height: 1.05;
        }

        p {
          color: var(--ink);
          line-height: 1.65;
        }

        .hero-copy > p:not(.eyebrow) {
          max-width: 680px;
          margin: 1.15rem 0 0;
          font-size: 1.12rem;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.82rem;
          margin-top: 1.65rem;
        }

        .actions a,
        .close a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 1.15rem;
          font-weight: 900;
          text-decoration: none;
        }

        .actions a:first-child,
        .close a {
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
          box-shadow: 0 15px 34px rgba(109, 69, 168, 0.2);
        }

        .actions a:not(:first-child) {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.68);
          color: var(--navy);
        }

        .hero-panel {
          display: grid;
          gap: 1rem;
        }

        .fund-card {
          border: 1px solid rgba(16, 35, 76, 0.14);
          border-radius: 8px;
          background: #10234c;
          color: #fffaf1;
          padding: 1.25rem;
          box-shadow: 0 24px 60px rgba(16, 35, 76, 0.18);
        }

        .fund-card p,
        .fund-card span {
          margin: 0;
          color: rgba(255, 250, 241, 0.76);
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .fund-card strong {
          display: block;
          margin-top: 0.5rem;
          color: #fffaf1;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(3.1rem, 7vw, 5rem);
          line-height: 0.9;
        }

        .fund-card span {
          display: block;
          margin-top: 0.5rem;
          letter-spacing: 0;
          text-transform: none;
        }

        .locked-row {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 0.8rem;
          align-items: center;
          margin-top: 1.15rem;
          border-top: 1px solid rgba(255, 250, 241, 0.18);
          padding-top: 1rem;
        }

        .locked-row i {
          position: relative;
          display: block;
          width: 34px;
          height: 38px;
        }

        .locked-row i:before {
          position: absolute;
          left: 7px;
          top: 0;
          width: 20px;
          height: 18px;
          border: 4px solid var(--gold);
          border-bottom: 0;
          border-radius: 999px 999px 0 0;
          content: "";
        }

        .locked-row i:after {
          position: absolute;
          left: 3px;
          bottom: 0;
          width: 28px;
          height: 25px;
          border-radius: 7px;
          background: linear-gradient(135deg, var(--gold), var(--mint));
          content: "";
        }

        .locked-row b {
          display: block;
          color: #fffaf1;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.2rem;
          line-height: 1;
        }

        .locked-row small {
          display: block;
          margin-top: 0.22rem;
          color: rgba(255, 250, 241, 0.76);
          font-size: 0.9rem;
          font-weight: 800;
        }

        .bars {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.55rem;
          align-items: end;
          height: 120px;
          margin-top: 1.35rem;
          border-top: 1px solid rgba(255, 250, 241, 0.18);
          padding-top: 1rem;
        }

        .bars i {
          display: block;
          min-height: 34px;
          border-radius: 999px 999px 0 0;
          background: linear-gradient(180deg, var(--mint), rgba(51, 184, 159, 0.22));
        }

        .bars i:nth-child(2) { min-height: 52px; }
        .bars i:nth-child(3) { min-height: 68px; }
        .bars i:nth-child(4) { min-height: 90px; }
        .bars i:nth-child(5) { min-height: 112px; }

        .image-frame {
          position: relative;
          min-height: 300px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.64);
          box-shadow: 0 22px 56px rgba(48, 38, 24, 0.08);
          overflow: hidden;
        }

        .lesson-band {
          border-top: 1px solid var(--border);
          padding: 58px 0 64px;
        }

        .lesson-heading {
          max-width: 780px;
        }

        .lesson-grid,
        .status-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1.35rem;
        }

        article {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          padding: 1.15rem;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        article p {
          margin: 0.7rem 0 0;
        }

        .flow {
          display: grid;
          gap: 2rem;
          align-items: start;
          border-top: 1px solid var(--border);
          padding: 62px 0;
        }

        .flow > div > p:not(.eyebrow) {
          max-width: 650px;
          margin-top: 1rem;
          font-size: 1.05rem;
        }

        ol {
          display: grid;
          gap: 0.82rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        li {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 0.85rem;
          align-items: start;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.66);
          padding: 1rem;
        }

        li span {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.18);
          color: #956407;
          font-weight: 900;
        }

        li p {
          margin: 0;
          font-weight: 800;
        }

        .resources {
          display: grid;
          gap: 1.35rem;
          border-top: 1px solid var(--border);
          padding: 60px 0;
        }

        .resources-heading {
          max-width: 760px;
        }

        .resources-heading > p:not(.eyebrow) {
          margin: 1rem 0 0;
          font-size: 1.03rem;
        }

        .resource-grid {
          display: grid;
          gap: 1rem;
        }

        .resource-grid a {
          display: block;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          padding: 1.1rem;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        .resource-grid span {
          display: block;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .resource-grid strong {
          display: block;
          margin-top: 0.38rem;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.35rem;
          line-height: 1.08;
        }

        .resource-grid p {
          margin: 0.68rem 0 0;
          color: var(--ink);
          font-size: 0.96rem;
        }

        .status {
          border-top: 1px solid var(--border);
          padding: 62px 0;
        }

        .status-heading {
          max-width: 720px;
        }

        .status strong {
          display: block;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.42rem;
          line-height: 1.08;
        }

        .status article:nth-child(2) {
          border-color: rgba(201, 75, 124, 0.28);
          background: rgba(255, 246, 249, 0.82);
        }

        .close {
          display: grid;
          gap: 1.2rem;
          align-items: center;
          border-top: 1px solid var(--border);
          padding: 54px 0 78px;
        }

        .close p {
          max-width: 700px;
          margin: 0;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.55rem, 3vw, 2.4rem);
          line-height: 1.12;
          color: var(--navy);
        }

        .close a {
          width: fit-content;
        }

        @media (min-width: 860px) {
          .hero {
            grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
          }

          .lesson-grid,
          .resource-grid,
          .status-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .flow {
            grid-template-columns: minmax(0, 1fr) minmax(380px, 0.88fr);
          }

          .close {
            grid-template-columns: minmax(0, 1fr) auto;
          }
        }

        @media (max-width: 680px) {
          .hero,
          .lesson-band,
          .flow,
          .resources,
          .status,
          .close {
            width: min(100% - 28px, 1180px);
          }

          .hero {
            min-height: auto;
            padding-top: 46px;
          }

          .fund-card strong {
            font-size: 3.2rem;
          }
        }
      `,
        }}
      />
    </main>
  )
}
