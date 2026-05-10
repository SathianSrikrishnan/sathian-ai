import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Parent Recovery Guide - Tooth Fairy Network",
  description:
    "A plain parent guide for returning to a Tooth Fairy Network memory with Google, Gmail, family links, and support before any wallet fallback.",
}

const steps = [
  {
    number: "1",
    title: "Come back with Google or Gmail",
    body: "Use the same Google account, usually the Gmail address receiving Tooth Fairy Network emails. This is the normal parent path for memories, child profiles, and parent-controlled recovery.",
  },
  {
    number: "2",
    title: "Keep the family memory link",
    body: "A family memory link helps trusted relatives view the tooth story. It is useful context for support, but it is not a password, wallet, or proof that someone controls the account.",
  },
  {
    number: "3",
    title: "Ask support if anything feels missing",
    body: "If Google does not show the child, keep the family memory link and the parent email used to create the memory. A support pass should connect those records before any advanced fallback is needed.",
  },
]

const reassurance = [
  "No child wallet is needed for a parent to create or return to a memory.",
  "Most families can start with Google and email.",
  "The Smile Fund stays parent-controlled until your child is ready.",
  "No recovery phrase should be part of the normal parent experience.",
  "Advanced wallet fallback is optional and belongs to controlled testing or edge cases, not the first parent path.",
]

export default function RecoverLandingPage() {
  return (
    <main className="recover-page">
      <section className="hero">
        <p className="eyebrow">Returning parents</p>
        <h1>Come back with Google. The memory stays with your family.</h1>
        <p>
          Most families can start with Google and return through the same Gmail
          inbox that received the memory. It should feel like coming back to a
          family moment, not solving a technical account puzzle.
        </p>
        <div className="actions">
          <Link href="/api/auth/google?next=%2Ftoothfairy%2Fapp%2Fdashboard" prefetch={false}>
            Continue with Google
          </Link>
          <Link href="/toothfairy/faq">Read the parent guide</Link>
        </div>
      </section>

      <section className="steps" aria-label="Returning parent steps">
        {steps.map((step) => (
          <article key={step.number}>
            <span>{step.number}</span>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <section className="explain">
        <div>
          <p className="eyebrow">Parent access</p>
          <h2>The wallet can stay in the background.</h2>
        </div>
        <div className="copy">
          <p>
            Parents should understand one thing first: the account they already
            know, Google, is the front door. The Gmail inbox is where the family
            can receive the memory, gift receipts, and recovery links, while
            the Smile Fund can remain parent-controlled until the child is
            ready.
          </p>
          <p>
            If a family explicitly tested Phantom or another wallet, that can be
            handled as a separate recovery support path. Advanced wallet
            recovery should not be the page a returning parent has to understand
            before trusting the product.
          </p>
        </div>
      </section>

      <section className="reassurance" aria-label="Recovery reassurance">
        {reassurance.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </section>

      <section className="support">
        <p className="eyebrow">If support is needed</p>
        <h2>Start with the parent inbox and the memory link.</h2>
        <p>
          If Google does not show the right child, support should connect the
          parent email, the family memory link, and the mint or account records
          before asking anyone to use a wallet fallback. The memory link helps
          support find context, but it is not a password or proof of ownership.
        </p>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .recover-page {
          --navy: #11234a;
          --ink: #23365f;
          --muted: #687186;
          --purple: #6d45a8;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.76);
          --border: rgba(178, 151, 107, 0.30);
          min-height: 100vh;
          background: linear-gradient(180deg, #fbf7ee, #f5efe2);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .steps,
        .explain,
        .reassurance,
        .support {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .hero {
          padding: 76px 0 42px;
          border-bottom: 1px solid var(--border);
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
          max-width: 880px;
          font-size: clamp(3rem, 7vw, 5.3rem);
          line-height: 0.95;
        }

        .hero p,
        .copy p,
        .support p,
        article p,
        .reassurance p {
          color: var(--ink);
          font-size: 1.06rem;
          line-height: 1.65;
        }

        .hero p {
          max-width: 750px;
          margin: 1.15rem 0 0;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.55rem;
        }

        .actions a {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 1rem;
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

        .steps {
          display: grid;
          gap: 1rem;
          padding: 32px 0;
        }

        article {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          padding: 1.25rem;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        article span {
          display: inline-grid;
          width: 32px;
          height: 32px;
          place-items: center;
          border-radius: 999px;
          background: #fffaf1;
          color: var(--purple);
          font-weight: 900;
        }

        article h2 {
          margin-top: 1rem;
          font-size: 2rem;
          line-height: 1;
        }

        article p {
          margin: 0.8rem 0 0;
        }

        .explain {
          display: grid;
          gap: 1.2rem;
          border-top: 1px solid var(--border);
          padding: 44px 0;
        }

        .explain h2,
        .support h2 {
          max-width: 720px;
          font-size: clamp(2.35rem, 5vw, 3.7rem);
          line-height: 0.98;
        }

        .copy {
          display: grid;
          gap: 1rem;
        }

        .copy p,
        .support p {
          margin: 0;
        }

        .reassurance {
          display: grid;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 252, 247, 0.62);
          overflow: hidden;
        }

        .reassurance p {
          margin: 0;
          padding: 1rem;
          font-weight: 800;
        }

        .reassurance p:not(:last-child) {
          border-bottom: 1px solid var(--border);
        }

        .support {
          padding: 54px 0 78px;
        }

        .support p {
          max-width: 760px;
          margin-top: 1rem;
        }

        @media (min-width: 840px) {
          .steps {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .explain {
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          }
        }

        @media (max-width: 680px) {
          .hero,
          .steps,
          .explain,
          .reassurance,
          .support {
            width: min(100% - 28px, 1180px);
          }

          .actions,
          .actions a {
            width: 100%;
          }
        }
      `,
        }}
      />
    </main>
  )
}
