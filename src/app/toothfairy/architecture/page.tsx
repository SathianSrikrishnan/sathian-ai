import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Security - Tooth Fairy Network",
  description:
    "Security, architecture, and deployment readiness overview for Tooth Fairy Network.",
}

const layers = [
  {
    title: "Parent-controlled account",
    body: "The parent or guardian controls the early account experience, sharing, and unlock path. The child sees the memory and lesson before the technical rails.",
  },
  {
    title: "Tooth Memory keepsake",
    body: "The cNFT keepsake records the tooth milestone and points to durable artwork/metadata. Personal story data can stay in the application layer where it can be presented safely.",
  },
  {
    title: "Solana escrow",
    body: "Family contributions are intended to sit in a Solana escrow flow, with the age-10 milestone as the default educational unlock target.",
  },
  {
    title: "Supabase records",
    body: "Supabase stores supporting profile, story, child, and recovery context so the product can stay understandable to parents.",
  },
]

const readiness = [
  "Vercel preview must have real environment variables.",
  "`/api/toothfairy/health` must pass before live-domain migration.",
  "One controlled mint should be tested before outside users.",
  "Fiat/card gifts stay gated until Stripe/Crossmint is wired and tested.",
]

export default function ArchitecturePage() {
  return (
    <main className="security-page">
      <section className="hero">
        <p className="eyebrow">Security and architecture</p>
        <h1>The rails should feel invisible, but they cannot be vague.</h1>
        <p>
          Tooth Fairy Network is a warm family product on the surface. Under it
          sits a minting path, a keepsake record, app-side family data, and a
          Solana escrow model. This page explains the V1 architecture plainly.
        </p>
      </section>

      <section className="layers">
        {layers.map((layer) => (
          <article key={layer.title}>
            <h2>{layer.title}</h2>
            <p>{layer.body}</p>
          </article>
        ))}
      </section>

      <section className="readiness">
        <div>
          <p className="eyebrow">Deployment gate</p>
          <h2>What must be true before the domain moves.</h2>
        </div>
        <div className="checks">
          {readiness.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="disclosure">
        <h2>Current V2 preview truth</h2>
        <p>
          The site can be reviewed visually now. The minting and wallet flows
          need real preview infrastructure before live testing. The regular
          card-gift path is intentionally gated because the repo still contains
          a legacy Coinbase onramp while the intended path is Stripe/Crossmint.
        </p>
        <Link href="/toothfairy/faq">Read parent FAQ</Link>
      </section>

      <style>{`
        .security-page {
          --navy: #11234a;
          --ink: #23365f;
          --purple: #6d45a8;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.78);
          --border: rgba(178, 151, 107, 0.30);
          min-height: 100vh;
          background:
            radial-gradient(circle at 86% 0%, rgba(216, 164, 60, 0.16), transparent 26rem),
            radial-gradient(circle at 8% 12%, rgba(109, 69, 168, 0.10), transparent 24rem),
            var(--cream);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .layers,
        .readiness,
        .disclosure {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .hero {
          padding: 72px 0 38px;
        }

        .eyebrow {
          margin: 0 0 0.72rem;
          color: #b77a11;
          font-size: 0.78rem;
          font-weight: 900;
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
          max-width: 900px;
          font-size: clamp(3rem, 7vw, 5.2rem);
          line-height: 0.95;
        }

        .hero p,
        article p,
        .disclosure p {
          color: var(--ink);
          font-size: 1.06rem;
          line-height: 1.65;
        }

        .hero p {
          max-width: 780px;
          margin: 1.15rem 0 0;
        }

        .layers {
          display: grid;
          gap: 1rem;
          padding: 28px 0 72px;
        }

        article,
        .readiness,
        .disclosure {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        article {
          padding: 1.25rem;
        }

        article h2 {
          font-size: 1.85rem;
          line-height: 1;
        }

        article p {
          margin: 0.8rem 0 0;
        }

        .readiness {
          display: grid;
          gap: 1.2rem;
          align-items: start;
          padding: 1.4rem;
        }

        .readiness h2,
        .disclosure h2 {
          font-size: clamp(2rem, 4vw, 3.1rem);
          line-height: 1;
        }

        .checks {
          display: grid;
          gap: 0.7rem;
        }

        .checks p {
          margin: 0;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.54);
          color: var(--ink);
          padding: 0.9rem;
          font-weight: 850;
        }

        .disclosure {
          margin-top: 1rem;
          margin-bottom: 78px;
          padding: 1.4rem;
        }

        .disclosure a {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
          padding: 0 1rem;
          font-weight: 900;
          text-decoration: none;
        }

        @media (min-width: 840px) {
          .layers {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .readiness {
            grid-template-columns: 0.9fr 1.1fr;
          }
        }

        @media (max-width: 680px) {
          .hero,
          .layers,
          .readiness,
          .disclosure {
            width: min(100% - 28px, 1180px);
          }
        }
      `}</style>
    </main>
  )
}
