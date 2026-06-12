import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Learn with Toothlight | Tooth Fairy Network',
  description:
    'A simple age-10 learning track for helping children grow into their Toothlight, Smile Fund, and family handoff.',
}

const lessons = [
  {
    label: 'Story',
    title: 'What did we save?',
    body: 'Start with the memory: the tooth, the drawing, the child&apos;s words, and the parent note waiting for later.',
  },
  {
    label: 'Saving',
    title: 'What is a gift for?',
    body: 'Talk about waiting, choosing, and why a family might save something small instead of spending it right away.',
  },
  {
    label: 'Ownership',
    title: 'What does it mean to care for something?',
    body: 'Use the Toothlight as a gentle first lesson in responsibility before any child controls accounts, wallets, or money.',
  },
  {
    label: 'Handoff',
    title: 'When are they ready?',
    body: 'Age 10 is the default milestone, but parents decide when the child is ready to receive more of the story and responsibility.',
  },
]

export default function ToothlightLearnPage() {
  return (
    <main className="learn-page">
      <header className="topbar">
        <Link href="/toothlight">Toothlight</Link>
        <Link href="/toothlight/start" data-tfn-event="cta_click">Create</Link>
      </header>

      <section className="hero">
        <p className="eyebrow">Learning track</p>
        <h1>Help them grow into the Toothlight.</h1>
        <p>
          The fourth step is not a payment screen. It is the reason the product
          has weight: the child gets a memory, a message, and a small lesson in
          care, patience, and ownership when they are ready.
        </p>
        <div className="actions">
          <Link href="/toothlight/start" data-tfn-event="cta_click">Create a Toothlight</Link>
          <Link href="/toothfairy/smile-fund">Smile Fund details</Link>
        </div>
      </section>

      <section className="lesson-grid" aria-label="Toothlight learning steps">
        {lessons.map((lesson, index) => (
          <article key={lesson.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <small>{lesson.label}</small>
            <h2>{lesson.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: lesson.body }} />
          </article>
        ))}
      </section>

      <section className="close">
        <h2>Parent control stays the default.</h2>
        <p>
          The child can learn from the Toothlight without being handed adult
          financial control too early. Solana-backed ownership can sit under the
          product when the family is ready for that path.
        </p>
      </section>

      <style>{`
        .learn-page {
          --ink: #17262a;
          --muted: #5f7175;
          --paper: #fbf8ef;
          --gold: #f6c95f;
          --mint: #8fe6c6;
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 4%, rgba(246, 201, 95, 0.17), transparent 24rem),
            radial-gradient(circle at 88% 10%, rgba(143, 230, 198, 0.14), transparent 24rem),
            linear-gradient(180deg, #fbf8ef, #eef6f3 54%, #fbf8ef);
          color: var(--ink);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }
        .topbar,
        .hero,
        .lesson-grid,
        .close {
          width: min(100% - 2rem, 1120px);
          margin: 0 auto;
        }
        .topbar {
          display: flex;
          min-height: 4.5rem;
          align-items: center;
          justify-content: space-between;
          font-weight: 900;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        .hero {
          padding: 4rem 0 2rem;
        }
        .eyebrow {
          margin: 0 0 0.72rem;
          color: #9d6b17;
          font-size: 0.74rem;
          font-weight: 900;
          text-transform: uppercase;
        }
        h1,
        h2 {
          margin: 0;
          font-family: var(--font-display), Georgia, serif;
          letter-spacing: 0;
        }
        h1 {
          max-width: 760px;
          font-size: clamp(3rem, 7vw, 5.2rem);
          line-height: 0.94;
        }
        h2 {
          font-size: 2rem;
          line-height: 1;
        }
        p {
          color: #34484d;
          font-size: 1.04rem;
          line-height: 1.65;
        }
        .hero p,
        .close p {
          max-width: 720px;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.72rem;
          margin-top: 1.4rem;
        }
        .actions a {
          display: inline-flex;
          min-height: 3rem;
          align-items: center;
          border-radius: 999px;
          padding: 0 1rem;
          font-weight: 900;
        }
        .actions a:first-child {
          background: linear-gradient(135deg, var(--gold), #eaa340);
          color: #1e2718;
        }
        .actions a + a {
          border: 1px solid rgba(23, 38, 42, 0.14);
          background: rgba(255, 255, 255, 0.66);
        }
        .lesson-grid {
          display: grid;
          gap: 1rem;
          padding: 1.5rem 0 3rem;
        }
        article,
        .close {
          border: 1px solid rgba(23, 38, 42, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.72);
          box-shadow: 0 18px 44px rgba(25, 42, 46, 0.08);
          padding: 1.2rem;
        }
        article span {
          color: #9d6b17;
          font-size: 0.76rem;
          font-weight: 950;
        }
        article small {
          display: block;
          margin: 0.22rem 0 0.7rem;
          color: #5f7175;
          font-weight: 900;
          text-transform: uppercase;
        }
        .close {
          margin-bottom: 4.5rem;
        }
        @media (min-width: 840px) {
          .lesson-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
    </main>
  )
}
