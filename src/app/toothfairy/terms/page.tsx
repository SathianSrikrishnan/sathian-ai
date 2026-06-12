import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms - Tooth Fairy Network",
  description:
    "Plain-English launch terms for Tooth Fairy Network Toothlights, Smile Fund testing, Solana ownership, and parent-controlled access.",
}

const terms = [
  {
    title: "Controlled launch",
    body: "Tooth Fairy Network is in controlled launch. Features may change while we test the parent flow, recovery, sharing, and payment support.",
  },
  {
    title: "Parent or guardian use",
    body: "A parent or guardian is responsible for creating, saving, sharing, and recovering a child&apos;s Toothlight.",
  },
  {
    title: "Not financial advice",
    body: "The Smile Fund is an educational family savings concept. Tooth Fairy Network is not a bank, brokerage, exchange, or investment adviser.",
  },
  {
    title: "Card gifts are paused",
    body: "Card checkout and fiat on-ramp gifts are paused until provider terms, receipts, fee language, refunds, and support are ready.",
  },
  {
    title: "Wallet gifts are advanced testing",
    body: "Wallet-based gifts and Solana actions are for controlled testing. Parents should only use them if they understand the wallet path and transaction finality.",
  },
  {
    title: "Family sharing",
    body: "Family links are intended for trusted people. Parents decide who receives a Toothlight link and what personal information appears in the memory.",
  },
]

export default function TermsPage() {
  return (
    <main className="terms-page">
      <section className="hero">
        <p className="eyebrow">Terms</p>
        <h1>Clear boundaries for the launch version.</h1>
        <p>
          These plain-English terms describe the current Toothlight launch
          posture. They are meant to help parents understand what is live, what
          is paused, and what should be treated as controlled testing.
        </p>
        <div className="actions">
          <Link href="/toothfairy/faq">Read FAQ</Link>
          <Link href="/toothfairy/support">Get support</Link>
        </div>
      </section>

      <section className="grid" aria-label="Launch terms">
        {terms.map((term) => (
          <article key={term.title}>
            <h2>{term.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: term.body }} />
          </article>
        ))}
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .terms-page {
          --navy: #11234a;
          --ink: #23365f;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.82);
          --border: rgba(178, 151, 107, 0.30);
          min-height: 100vh;
          background: radial-gradient(circle at 18% 4%, rgba(79, 209, 197, 0.12), transparent 24rem), var(--cream);
          color: var(--navy);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }
        .hero,
        .grid {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }
        .hero {
          padding: 72px 0 36px;
        }
        .eyebrow {
          margin: 0 0 0.72rem;
          color: #b77a11;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.12em;
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
          max-width: 860px;
          font-size: clamp(3rem, 7vw, 5.1rem);
          line-height: 0.95;
        }
        h2 {
          font-size: 2rem;
          line-height: 1;
        }
        p {
          color: var(--ink);
          font-size: 1.04rem;
          line-height: 1.65;
        }
        .hero p {
          max-width: 760px;
          margin: 1.15rem 0 0;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.45rem;
        }
        .actions a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #ffd76a, #f0c456);
          color: #081123;
          font-weight: 900;
          padding: 0 1.15rem;
          text-decoration: none;
        }
        .actions a + a {
          border: 1px solid var(--border);
          background: var(--paper);
          color: var(--navy);
        }
        .grid {
          display: grid;
          gap: 1rem;
          padding: 24px 0 72px;
        }
        article {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
          padding: 1.25rem;
        }
        @media (min-width: 840px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 680px) {
          .hero,
          .grid {
            width: min(100% - 28px, 1180px);
          }
        }
      `,
        }}
      />
    </main>
  )
}
