import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Smile Fund - Tooth Fairy Network",
  description:
    "A parent-controlled Smile Fund helps a child grow from a tooth memory into an early lesson about saving, patience, and ownership.",
}

const principles = [
  {
    title: "Memory first",
    body: "Loved ones open the family link to see the tooth story before they ever see a gift option.",
  },
  {
    title: "Parent controlled",
    body: "Parents control access, sharing, and the timing for when the child learns from the fund.",
  },
  {
    title: "Small by design",
    body: "The fund is built for tiny family gifts, not speculation or pressure.",
  },
]

const steps = [
  "A parent saves the lost-tooth moment.",
  "The family link lets loved ones celebrate it.",
  "Optional gifts collect in the Smile Fund.",
  "The child grows into the ownership lesson over time.",
]

export default function SmileFundPage() {
  return (
    <main className="smile-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Smile Fund</p>
          <h1>A small fund attached to their first forever memory.</h1>
          <p>
            The Smile Fund turns a family ritual into a gentle first lesson in
            saving, patience, and ownership. Parents stay in control. Children
            get something that feels like theirs to grow into.
          </p>
          <div className="actions">
            <Link href="/toothfairy/app">Create a memory</Link>
            <Link href="/toothfairy/faq">Read parent FAQ</Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="Smile Fund preview">
          <Image
            src="/toothfairy/visual-system/watch-grow-v1.png"
            alt="A child watching their Smile Fund grow"
            fill
            priority
            sizes="(min-width: 960px) 420px, 88vw"
            className="object-contain"
          />
        </div>
      </section>

      <section className="principles" aria-label="Smile Fund principles">
        {principles.map((item) => (
          <article key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="flow">
        <div>
          <p className="eyebrow">Family flow</p>
          <h2>The gift is optional. The meaning comes first.</h2>
          <p>
            A Smile Fund should not make a lost tooth feel transactional. It
            should make the child feel remembered, supported, and trusted with a
            tiny piece of responsibility.
          </p>
        </div>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="status">
        <div>
          <p className="eyebrow">Launch status</p>
          <h2>What is live now?</h2>
        </div>
        <div className="status-grid">
          <article>
            <strong>Live for controlled testing</strong>
            <p>Parent memory creation, Google sign-in, the public family link, and wallet-based gifts.</p>
          </article>
          <article>
            <strong>Paused before broad release</strong>
            <p>Card gifts, receipts, fee disclosures, and final payment-provider terms.</p>
          </article>
          <article>
            <strong>Not financial advice</strong>
            <p>The Smile Fund is an educational family savings experience, not an investment product.</p>
          </article>
        </div>
      </section>

      <style>{`
        .smile-page {
          --navy: #11234a;
          --ink: #23365f;
          --muted: #687186;
          --purple: #6d45a8;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.78);
          --border: rgba(178, 151, 107, 0.30);
          min-height: 100vh;
          background:
            radial-gradient(circle at 88% 0%, rgba(216, 164, 60, 0.17), transparent 24rem),
            radial-gradient(circle at 10% 4%, rgba(109, 69, 168, 0.10), transparent 22rem),
            var(--cream);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .principles,
        .flow,
        .status {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .hero {
          display: grid;
          gap: 2.5rem;
          align-items: center;
          min-height: min(720px, calc(100vh - 72px));
          padding: 68px 0 44px;
        }

        .hero-copy {
          max-width: 760px;
        }

        .eyebrow {
          margin: 0 0 0.72rem;
          color: #b77a11;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1,
        h2 {
          margin: 0;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          letter-spacing: 0;
        }

        h1 {
          max-width: 780px;
          font-size: clamp(3rem, 7vw, 5.4rem);
          line-height: 0.95;
        }

        h2 {
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          line-height: 0.98;
        }

        p {
          color: var(--ink);
          line-height: 1.65;
        }

        .hero p {
          max-width: 680px;
          margin: 1.15rem 0 0;
          font-size: 1.12rem;
        }

        .hero-visual {
          position: relative;
          min-height: 340px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.70), rgba(245, 239, 226, 0.76));
          box-shadow: 0 24px 70px rgba(48, 38, 24, 0.08);
          overflow: hidden;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.6rem;
        }

        .actions a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 1.1rem;
          font-weight: 900;
          text-decoration: none;
        }

        .actions a:first-child {
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
        }

        .actions a:last-child {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.62);
          color: var(--navy);
        }

        .principles {
          display: grid;
          gap: 1rem;
          padding: 18px 0 72px;
        }

        article {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        .principles article {
          padding: 1.2rem;
        }

        .principles h2 {
          font-size: 2rem;
        }

        .flow {
          display: grid;
          gap: 2rem;
          align-items: start;
          border-top: 1px solid var(--border);
          padding: 64px 0;
        }

        .flow p {
          max-width: 620px;
          font-size: 1.06rem;
        }

        ol {
          display: grid;
          gap: 0.8rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        li {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.58);
          color: var(--ink);
          font-weight: 800;
          padding: 1rem;
        }

        .status {
          border-top: 1px solid var(--border);
          padding: 64px 0 82px;
        }

        .status-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1.3rem;
        }

        .status article {
          padding: 1.15rem;
        }

        .status strong {
          color: var(--navy);
          display: block;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.35rem;
          line-height: 1.1;
        }

        .status p {
          margin: 0.7rem 0 0;
        }

        @media (min-width: 840px) {
          .hero {
            grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          }

          .principles,
          .status-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .flow {
            grid-template-columns: minmax(0, 1fr) minmax(340px, 0.82fr);
          }
        }

        @media (max-width: 680px) {
          .hero,
          .principles,
          .flow,
          .status {
            width: min(100% - 28px, 1180px);
          }

          .hero {
            min-height: auto;
            padding-top: 48px;
          }
        }
      `}</style>
    </main>
  )
}
