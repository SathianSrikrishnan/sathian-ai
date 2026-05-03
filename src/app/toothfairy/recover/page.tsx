import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Recover - Tooth Fairy Network",
  description:
    "Recovery and support options for Tooth Fairy Network parents and guardians.",
}

const paths = [
  {
    title: "I used a wallet",
    body: "Connect the same guardian wallet to find your child's keepsakes and any gifts that are ready to withdraw.",
    href: "/toothfairy/app/recover",
    cta: "Find keepsakes",
  },
  {
    title: "I used Google sign-in",
    body: "Open the parent dashboard with the same Google account you used when saving the keepsake.",
    href: "/toothfairy/faq",
    cta: "Read account FAQ",
  },
  {
    title: "I have a family link",
    body: "Paste or open the keepsake link your family received. You do not need a wallet just to view a child's tooth story.",
    href: "/toothfairy/architecture",
    cta: "How it works",
  },
]

export default function RecoverLandingPage() {
  return (
    <main className="recover-page">
      <section className="hero">
        <p className="eyebrow">Recovery</p>
        <h1>Find a child&apos;s keepsake.</h1>
        <p>
          If a parent comes back later, this page should help them find the
          memory first. Wallet tools are still here, but they sit one step
          behind the family language.
        </p>
      </section>

      <section className="path-grid">
        {paths.map((path) => (
          <article key={path.title}>
            <h2>{path.title}</h2>
            <p>{path.body}</p>
            <Link href={path.href}>{path.cta}</Link>
          </article>
        ))}
      </section>

      <section className="note">
        <h2>For controlled testing</h2>
        <p>
          The recovery path should be tested with the same live infrastructure
          used for minting: real Supabase records, Solana RPC, the server mint
          keypair, and the deployed escrow program. Keep early tests small and
          obvious until the public support process is written.
        </p>
      </section>

      <style>{`
        .recover-page {
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
            radial-gradient(circle at 82% 4%, rgba(216, 164, 60, 0.17), transparent 24rem),
            radial-gradient(circle at 8% 12%, rgba(109, 69, 168, 0.10), transparent 22rem),
            var(--cream);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .path-grid,
        .note {
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
          max-width: 850px;
          font-size: clamp(3rem, 7vw, 5.2rem);
          line-height: 0.95;
        }

        .hero p,
        article p,
        .note p {
          color: var(--ink);
          font-size: 1.06rem;
          line-height: 1.65;
        }

        .hero p {
          max-width: 760px;
          margin: 1.15rem 0 0;
        }

        .path-grid {
          display: grid;
          gap: 1rem;
          padding: 28px 0 72px;
        }

        article,
        .note {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        article {
          display: grid;
          align-content: start;
          gap: 0.85rem;
          min-height: 250px;
          padding: 1.25rem;
        }

        article h2,
        .note h2 {
          font-size: 2rem;
          line-height: 1;
        }

        article p,
        .note p {
          margin: 0;
        }

        article a {
          display: inline-flex;
          width: fit-content;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          align-self: end;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
          padding: 0 1rem;
          font-weight: 900;
          text-decoration: none;
        }

        .note {
          padding: 1.4rem;
          margin-bottom: 78px;
        }

        .note p {
          margin-top: 0.8rem;
        }

        @media (min-width: 840px) {
          .path-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .hero,
          .path-grid,
          .note {
            width: min(100% - 28px, 1180px);
          }
        }
      `}</style>
    </main>
  )
}
