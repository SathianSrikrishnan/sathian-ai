import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Support - Tooth Fairy Network",
  description:
    "Support paths for Tooth Fairy Network parents creating, saving, recovering, or testing a Toothlight.",
}

const supportPaths = [
  {
    title: "I need to recover a Toothlight",
    body: "Start with the same Google account used to save it. If you used a wallet during testing, keep that wallet available too.",
    href: "/toothfairy/recover",
    cta: "Recover access",
  },
  {
    title: "I am testing a wallet gift",
    body: "Wallet gifts are an advanced path during controlled testing. Save the transaction link and the family Toothlight link.",
    href: "/toothfairy/faq",
    cta: "Read gift FAQ",
  },
  {
    title: "I am a new parent",
    body: "Create the Toothlight first. You can add the note, invite family, and think about gifts after the memory exists.",
    href: "/toothlight/start?from=support",
    cta: "Create a Toothlight",
  },
]

export default function SupportPage() {
  return (
    <main className="support-page">
      <section className="hero">
        <p className="eyebrow">Support</p>
        <h1>Help for parents testing Toothlights.</h1>
        <p>
          During this launch window, the safest support path is simple: keep the
          family link, use the same Google account, and treat wallet gifts as
          controlled testing until the card on-ramp is ready.
        </p>
        <a href="mailto:support@toothfairy.network">support@toothfairy.network</a>
      </section>

      <section className="grid" aria-label="Support paths">
        {supportPaths.map((path) => (
          <article key={path.title}>
            <h2>{path.title}</h2>
            <p>{path.body}</p>
            <Link href={path.href}>{path.cta}</Link>
          </article>
        ))}
      </section>

      <section className="note">
        <h2>What to include</h2>
        <p>
          If you contact support, include the parent email used to create the
          Toothlight, the family link if you have it, and any wallet transaction
          link if you were testing a gift.
        </p>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .support-page {
          --navy: #11234a;
          --ink: #23365f;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.82);
          --border: rgba(178, 151, 107, 0.30);
          min-height: 100vh;
          background:
            radial-gradient(circle at 84% 4%, rgba(216, 164, 60, 0.16), transparent 24rem),
            radial-gradient(circle at 12% 10%, rgba(79, 209, 197, 0.1), transparent 24rem),
            var(--cream);
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
        .hero a,
        article a {
          display: inline-flex;
          width: fit-content;
          min-height: 44px;
          align-items: center;
          border-radius: 999px;
          margin-top: 1.2rem;
          background: linear-gradient(135deg, #ffd76a, #f0c456);
          color: #081123;
          font-weight: 900;
          padding: 0 1.05rem;
          text-decoration: none;
        }
        .grid {
          display: grid;
          gap: 1rem;
          padding: 24px 0 40px;
        }
        article,
        .note {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
          padding: 1.25rem;
        }
        article {
          display: grid;
          align-content: start;
        }
        .note {
          margin-bottom: 72px;
        }
        @media (min-width: 840px) {
          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
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
