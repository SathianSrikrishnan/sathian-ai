import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy - Tooth Fairy Network",
  description:
    "How Tooth Fairy Network handles parent accounts, child Toothlight memories, AI polish, family links, and Solana-backed ownership.",
}

const sections = [
  {
    title: "Parents control the account",
    body: "A parent or guardian creates and recovers the Toothlight. Children do not need a wallet or account to begin.",
  },
  {
    title: "The memory comes first",
    body: "A Toothlight can include a tooth photo, drawing, short story, and parent note. Parents choose what to save and what to share.",
  },
  {
    title: "Family links are shareable",
    body: "A family link is meant for trusted relatives and friends. Do not post a child&apos;s private Toothlight publicly unless you are comfortable with that link being seen.",
  },
  {
    title: "AI polish is optional",
    body: "AI polish may process an uploaded drawing or photo to create a visual treatment. The original memory stays the anchor, and parents can start without AI.",
  },
  {
    title: "Solana is the ownership layer",
    body: "Where Solana is used, the public chain can record ownership or transaction facts. Personal family notes should stay in the application layer unless a parent explicitly chooses otherwise.",
  },
]

export default function PrivacyPage() {
  return (
    <main className="trust-page">
      <section className="hero">
        <p className="eyebrow">Privacy</p>
        <h1>Parent control comes before everything else.</h1>
        <p>
          Tooth Fairy Network is built for families. The launch version is meant
          to help parents create, save, recover, and share a Toothlight carefully
          while the product continues through controlled testing.
        </p>
        <Link href="/toothlight/start?from=privacy">Create a Toothlight</Link>
      </section>

      <section className="grid" aria-label="Privacy commitments">
        {sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: section.body }} />
          </article>
        ))}
      </section>

      <section className="note">
        <h2>Launch note</h2>
        <p>
          This page is a plain-English MVP privacy summary, not a substitute for
          final legal terms. Before broad paid acquisition, final privacy,
          deletion, support, and payment policies should be reviewed.
        </p>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .trust-page {
          --navy: #11234a;
          --ink: #23365f;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.82);
          --border: rgba(178, 151, 107, 0.30);
          min-height: 100vh;
          background: radial-gradient(circle at 84% 0%, rgba(216, 164, 60, 0.16), transparent 24rem), var(--cream);
          color: var(--navy);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }
        .hero,
        .grid,
        .note {
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
        .hero a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          border-radius: 999px;
          margin-top: 1.45rem;
          background: linear-gradient(135deg, #ffd76a, #f0c456);
          color: #081123;
          font-weight: 900;
          padding: 0 1.15rem;
          text-decoration: none;
        }
        .grid {
          display: grid;
          gap: 1rem;
          padding: 24px 0 48px;
        }
        article,
        .note {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
          padding: 1.25rem;
        }
        .note {
          margin-bottom: 72px;
        }
        @media (min-width: 840px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 680px) {
          .hero,
          .grid,
          .note {
            width: min(100% - 28px, 1180px);
          }
        }
      `,
        }}
      />
    </main>
  )
}
