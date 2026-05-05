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

const networkSignals = [
  {
    label: "Memory",
    value: "Photo, art, and story stay together",
  },
  {
    label: "Access",
    value: "Parent keeps the keys",
  },
  {
    label: "Smile Fund",
    value: "A locked gift can start the habit",
  },
]

const parentReads = [
  {
    source: "CFPB",
    title: "Young children and saving",
    href: "https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/young-children/explore-saving/",
    body: "A practical parent guide for turning waiting, saving, and small choices into age-appropriate conversations.",
  },
  {
    source: "Investor.gov",
    title: "Small Savings Add Up to Big Money",
    href: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/small-savings-add-big-money",
    body: "A plain-language compounding primer that helps explain why tiny amounts can matter over time.",
  },
  {
    source: "Investor.gov",
    title: "Understand What It Means to Invest",
    href: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/understand-what-it-means-invest",
    body: "A sober risk note for parents: investing can grow money, but it also means accepting the chance of loss.",
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
          <div className="network-halo" aria-hidden>
            <span>saved</span>
            <span>parent key</span>
            <span>fund</span>
          </div>
          <div className="network-lock" aria-hidden>
            <i />
            <b />
          </div>
          <KeepsakeCard {...liveMemory} />
          <div className="deposit-chip" aria-label="Example locked Smile Fund gift">
            <span>Example locked Smile Fund gift</span>
            <strong>0.05 SOL</strong>
            <small>From Jimmy, held with this memory</small>
          </div>
        </div>
      </section>

      <section className="parent-lens" aria-label="What parents should understand">
        <div className="lens-copy">
          <p className="eyebrow">What parents should understand</p>
          <h2>They are not buying an NFT. They are practicing ownership.</h2>
          <p>
            The tooth is the emotional doorway. A child sees a real moment
            become something permanent, then watches a small locked gift sit
            beside it. That is the lesson: some things are worth saving, some
            things are truly yours, and parents decide when the next concept is
            ready.
          </p>
        </div>

        <div className="lens-note">
          <span>What should be obvious</span>
          <ul>
            <li>The memory is preserved.</li>
            <li>The parent controls access.</li>
            <li>The fund can become a lesson over time.</li>
          </ul>
        </div>
      </section>

      <section className="signal-grid" aria-label="Preview details">
        {networkSignals.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="parent-reads" aria-label="Parent reading">
        <div>
          <p className="eyebrow">For parents</p>
          <h2>Use the page as a first money conversation.</h2>
        </div>
        <div className="read-grid">
          {parentReads.map((read) => (
            <a key={read.href} href={read.href} target="_blank" rel="noreferrer">
              <span>{read.source}</span>
              <strong>{read.title}</strong>
              <p>{read.body}</p>
            </a>
          ))}
        </div>
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
        .parent-lens,
        .signal-grid,
        .parent-reads,
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
          isolation: isolate;
        }

        .card-wrap:before {
          position: absolute;
          inset: 8% 7% auto auto;
          z-index: -2;
          width: min(46vw, 360px);
          height: min(46vw, 360px);
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.18);
          content: "";
          filter: blur(34px);
        }

        .network-halo {
          position: absolute;
          inset: 3% -2% auto auto;
          z-index: -1;
          width: min(92%, 500px);
          aspect-ratio: 1;
          border: 1px solid rgba(109, 69, 168, 0.22);
          border-radius: 999px;
          transform: rotate(-8deg);
        }

        .network-halo span {
          position: absolute;
          border: 1px solid rgba(216, 164, 60, 0.34);
          border-radius: 999px;
          background: rgba(255, 252, 247, 0.88);
          color: var(--purple);
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          padding: 0.38rem 0.55rem;
          text-transform: uppercase;
          transform: rotate(8deg);
        }

        .network-halo span:nth-child(1) {
          left: 12%;
          top: 10%;
        }

        .network-halo span:nth-child(2) {
          right: -2%;
          top: 44%;
        }

        .network-halo span:nth-child(3) {
          bottom: 9%;
          left: 20%;
        }

        .network-lock {
          position: absolute;
          right: clamp(0.5rem, 3vw, 1.8rem);
          top: clamp(1.2rem, 6vw, 3rem);
          z-index: 4;
          display: grid;
          width: 58px;
          height: 70px;
          place-items: center;
          pointer-events: none;
        }

        .network-lock i {
          position: absolute;
          top: 2px;
          width: 34px;
          height: 30px;
          border: 5px solid rgba(216, 164, 60, 0.9);
          border-bottom: 0;
          border-radius: 999px 999px 0 0;
        }

        .network-lock b {
          position: absolute;
          bottom: 5px;
          width: 44px;
          height: 38px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6d45a8, #d8a43c);
          box-shadow: 0 12px 28px rgba(109, 69, 168, 0.24);
        }

        .network-lock b:after {
          position: absolute;
          inset: 11px 19px;
          border-radius: 999px;
          background: #fffaf1;
          content: "";
        }

        .card-wrap :global(article) {
          position: relative;
          z-index: 1;
        }

        .deposit-chip {
          position: relative;
          z-index: 3;
          width: min(88%, 360px);
          margin: -2.1rem auto 0;
          border: 1px solid rgba(109, 69, 168, 0.18);
          border-radius: 8px;
          background: rgba(255, 252, 247, 0.94);
          padding: 0.9rem 1rem;
          box-shadow: 0 20px 44px rgba(48, 38, 24, 0.12);
        }

        .deposit-chip span,
        .lens-note span,
        .read-grid span {
          display: block;
          color: var(--muted);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .deposit-chip strong {
          display: block;
          margin-top: 0.25rem;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.9rem;
          line-height: 0.96;
        }

        .deposit-chip small {
          display: block;
          margin-top: 0.3rem;
          color: var(--ink);
          font-size: 0.9rem;
          font-weight: 800;
        }

        .parent-lens {
          display: grid;
          gap: 1.4rem;
          align-items: stretch;
          border-top: 1px solid var(--border);
          padding: 58px 0 24px;
        }

        .lens-copy p {
          max-width: 620px;
          margin: 1rem 0 0;
          font-size: 1.04rem;
        }

        .lens-note {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.58);
          padding: 1.15rem;
        }

        .lens-note ul {
          display: grid;
          gap: 0.65rem;
          margin: 1rem 0 0;
          padding: 0;
          list-style: none;
        }

        .lens-note li {
          position: relative;
          padding-left: 1rem;
          color: var(--ink);
          font-weight: 850;
          line-height: 1.45;
        }

        .lens-note li:before {
          position: absolute;
          left: 0;
          top: 0.62em;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--gold);
          content: "";
        }

        .signal-grid {
          display: grid;
          gap: 1rem;
          padding: 0 0 58px;
        }

        .signal-grid article,
        .read-grid a {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 42px rgba(48, 38, 24, 0.07);
        }

        .signal-grid article {
          padding: 1.1rem;
        }

        .signal-grid span {
          display: block;
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .signal-grid strong {
          display: block;
          margin-top: 0.35rem;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.45rem;
          line-height: 1.05;
        }

        .parent-reads {
          display: grid;
          gap: 1.3rem;
          border-top: 1px solid var(--border);
          padding: 54px 0 60px;
        }

        .parent-reads h2 {
          max-width: 620px;
        }

        .read-grid {
          display: grid;
          gap: 1rem;
        }

        .read-grid a {
          display: block;
          padding: 1.1rem;
          color: inherit;
          text-decoration: none;
        }

        .read-grid strong {
          display: block;
          margin-top: 0.38rem;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.35rem;
          line-height: 1.08;
        }

        .read-grid p {
          margin: 0.65rem 0 0;
          color: var(--ink);
          font-size: 0.96rem;
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

          .parent-lens {
            grid-template-columns: minmax(0, 1fr) minmax(420px, 0.82fr);
          }

          .signal-grid,
          .read-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .next-step {
            grid-template-columns: minmax(0, 1fr) auto;
          }
        }

        @media (max-width: 680px) {
          .preview-hero,
          .parent-lens,
          .signal-grid,
          .parent-reads,
          .next-step {
            width: min(100% - 28px, 1180px);
          }

          .preview-hero {
            padding-top: 48px;
          }

          .network-halo {
            display: none;
          }

          .network-lock {
            right: 0.35rem;
            top: 1rem;
            transform: scale(0.82);
            transform-origin: top right;
          }
        }
      `}</style>
    </main>
  )
}
