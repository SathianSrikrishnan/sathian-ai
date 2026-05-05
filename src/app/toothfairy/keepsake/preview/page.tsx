"use client"

import Link from "next/link"
import { KeepsakeCard } from "@/components/toothfairy/keepsake/keepsake-card"

const liveMemory = {
  id: "F8pf5qkNMkSL5pBdrfk88piukq65MLTjsnYyXYBix62E",
  childName: "Jhonny",
  toothType: "Upper right central incisor",
  storyOrigin: "Live minted memory",
  drawingUrl: "https://gateway.irys.xyz/_asoyYnN6mYDzOpC_tJ3taAONF_zkM7lFEgQdx7pbnk",
  mintDate: new Date("2026-05-05T10:51:55.000Z"),
  deposits: [],
  toothStory:
    "My first baby tooth fell out today. It was wiggling for two weeks a little bit but only really shaking for the last three days. I was pulling and pulling and nothing came out but it finally came out.",
  message:
    "A childhood milestone from Jhonny's journey, preserved on the Tooth Fairy Network.",
}

const liveMemoryHref = `/toothfairy/keepsake/${liveMemory.id}`

const proof = [
  {
    label: "Real minted image",
    value: "Stored on Irys",
  },
  {
    label: "Parent access",
    value: "Controlled by family",
  },
  {
    label: "Smile Fund",
    value: "Ready for gifts",
  },
]

export default function KeepsakePreviewPage() {
  return (
    <main className="preview-page">
      <section className="preview-hero">
        <div className="copy">
          <p className="eyebrow">Live preview</p>
          <h1>A real first forever memory, already saved on the Network.</h1>
          <p className="lede">
            This is the product after a parent captures the tooth moment:
            the artwork, the story, and the family page stay together as
            something a child can grow up owning.
          </p>
          <div className="actions">
            <Link href={liveMemoryHref}>Open live memory</Link>
            <Link href="/toothfairy/app">Create your child's memory</Link>
          </div>
        </div>

        <div className="card-wrap" aria-label="Real minted Tooth Fairy memory preview">
          <KeepsakeCard {...liveMemory} />
        </div>
      </section>

      <section className="context" aria-label="What this preview shows">
        <div>
          <p className="eyebrow">What parents should understand</p>
          <h2>The memory comes first. The fund comes after.</h2>
        </div>
        <p>
          The page should not feel like an NFT pitch. It should feel like a
          family record that can become a gentle practice field for saving,
          patience, and responsibility. Loved ones can celebrate the moment;
          parents decide when the child is ready to learn from the fund.
        </p>
      </section>

      <section className="proof-grid" aria-label="Preview details">
        {proof.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="next-step">
        <div>
          <p className="eyebrow">Next step</p>
          <h2>Make one that feels like your child.</h2>
          <p>
            A better memory starts with the real smile, the real drawing, and a
            short story in their own words. That is the part families remember.
          </p>
        </div>
        <Link href="/toothfairy/app">Start the ritual</Link>
      </section>

      <style jsx>{`
        .preview-page {
          --navy: #11234a;
          --ink: #23365f;
          --muted: #687186;
          --purple: #6d45a8;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --cream-deep: #f3ead8;
          --paper: rgba(255, 252, 247, 0.74);
          --border: rgba(178, 151, 107, 0.32);
          min-height: 100vh;
          background:
            radial-gradient(circle at 84% 0%, rgba(216, 164, 60, 0.18), transparent 22rem),
            radial-gradient(circle at 6% 8%, rgba(109, 69, 168, 0.11), transparent 18rem),
            linear-gradient(180deg, var(--cream-deep), var(--cream));
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .preview-hero,
        .context,
        .proof-grid,
        .next-step {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .preview-hero {
          display: grid;
          gap: 2.5rem;
          align-items: center;
          padding: 68px 0 44px;
        }

        .copy {
          max-width: 720px;
        }

        .eyebrow {
          margin: 0 0 0.75rem;
          color: #a9700f;
          font-size: 0.76rem;
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
          max-width: 760px;
          font-size: clamp(3.05rem, 7vw, 5.35rem);
          line-height: 0.95;
        }

        h2 {
          font-size: clamp(2.15rem, 4vw, 3.35rem);
          line-height: 0.98;
        }

        p {
          color: var(--ink);
          line-height: 1.66;
        }

        .lede {
          max-width: 650px;
          margin: 1.2rem 0 0;
          font-size: 1.12rem;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.82rem;
          margin-top: 1.65rem;
        }

        .actions a,
        .next-step a {
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
        .next-step a {
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
          box-shadow: 0 16px 34px rgba(109, 69, 168, 0.2);
        }

        .actions a:last-child {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.66);
          color: var(--navy);
        }

        .card-wrap {
          position: relative;
        }

        .card-wrap:before {
          position: absolute;
          inset: 8% 7% auto auto;
          width: min(46vw, 360px);
          height: min(46vw, 360px);
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.18);
          content: "";
          filter: blur(34px);
        }

        .card-wrap :global(article) {
          position: relative;
        }

        .context {
          display: grid;
          gap: 1.4rem;
          align-items: end;
          border-top: 1px solid var(--border);
          padding: 58px 0 30px;
        }

        .context p {
          max-width: 620px;
          margin: 0;
          font-size: 1.04rem;
        }

        .proof-grid {
          display: grid;
          gap: 1rem;
          padding: 0 0 64px;
        }

        .proof-grid article {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          padding: 1.1rem;
          box-shadow: 0 18px 42px rgba(48, 38, 24, 0.07);
        }

        .proof-grid span {
          display: block;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .proof-grid strong {
          display: block;
          margin-top: 0.35rem;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.45rem;
          line-height: 1.05;
        }

        .next-step {
          display: grid;
          gap: 1.2rem;
          align-items: center;
          border-top: 1px solid var(--border);
          padding: 58px 0 78px;
        }

        .next-step p {
          max-width: 620px;
          margin: 1rem 0 0;
        }

        .next-step a {
          width: fit-content;
        }

        @media (min-width: 900px) {
          .preview-hero {
            grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
            min-height: min(740px, calc(100vh - 72px));
          }

          .context {
            grid-template-columns: minmax(0, 1fr) minmax(420px, 0.82fr);
          }

          .proof-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .next-step {
            grid-template-columns: minmax(0, 1fr) auto;
          }
        }

        @media (max-width: 680px) {
          .preview-hero,
          .context,
          .proof-grid,
          .next-step {
            width: min(100% - 28px, 1180px);
          }

          .preview-hero {
            padding-top: 48px;
          }
        }
      `}</style>
    </main>
  )
}
