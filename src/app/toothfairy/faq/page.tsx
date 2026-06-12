import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Parent FAQ - Tooth Fairy Network",
  description:
    "Parent answers about Tooth Fairy Network memories, Smile Funds, Google sign-in, family gifts, child ownership, and launch safety.",
}

const highlights = [
  {
    label: "Parent controlled",
    text: "Google recovery, family links, wallet access, and timing stay with the parent.",
  },
  {
    label: "Memory first",
    text: "The tooth story comes before money, wallets, or technical details.",
  },
  {
    label: "Small by design",
    text: "The Smile Fund is for practice, responsibility, and patience.",
  },
]

const groups = [
  {
    title: "What parents are signing up for",
    items: [
      {
        q: "What is Tooth Fairy Network?",
        a: "It is a family ritual for turning a lost tooth into a future asset. A parent captures the photo or drawing, the child's story, a note for later, and an optional Smile Fund gift under parent control.",
      },
      {
        q: "Is this crypto-first?",
        a: "No. Parents should feel the memory, the family ritual, and the learning moment first. Solana is the live ownership layer underneath so the Toothlight can become durable without making wallets the first thing families see.",
      },
      {
        q: "Is Tooth Fairy Network a bank?",
        a: "No. Tooth Fairy Network is not a bank, brokerage, exchange, or investment adviser. It is an educational family savings experience with parent-controlled access.",
      },
      {
        q: "Why not just keep the photo?",
        a: "A camera-roll photo can disappear into thousands of other photos. A Toothlight gives the moment a page, a story, a parent note, and a family path back to it over time.",
      },
    ],
  },
  {
    title: "Smile Fund and learning",
    items: [
      {
        q: "What is the Smile Fund really for?",
        a: "The Smile Fund is a first practice field for responsibility. Small gifts help a child start learning saving, patience, ownership, and the idea that something can be truly theirs without giving them adult financial control too early.",
      },
      {
        q: "Why mention ownership?",
        a: "Children will inherit a world where digital ownership matters earlier than it did for us. Tooth Fairy Network introduces that model gently: a memory they love, a gift they can understand, and a parent guiding the timing.",
      },
      {
        q: "Is this investment advice?",
        a: "No. Tooth Fairy Network is an educational family savings experience, not investment advice. Parents decide what, if anything, belongs in the Smile Fund and when the child is ready to learn from it.",
      },
      {
        q: "Why age 10?",
        a: "Age 10 is the default learning milestone because many children are ready for simple conversations about saving, value, patience, and responsibility. Parents can choose a different timing as the product matures.",
      },
    ],
  },
  {
    title: "Safety, access, and recovery",
    items: [
      {
        q: "Who controls the account?",
        a: "The parent or guardian controls the account, the family link, the wallet path, and when the child gets access to the ownership lesson.",
      },
      {
        q: "Does my child need a wallet?",
        a: "No. Parents can use Google sign-in and the app manages the technical layer. Wallets are only exposed where they are required for controlled testing of gifts.",
      },
      {
        q: "What happens if I lose access?",
        a: "Return with the same Google account used to create the memory. If you used a wallet during testing, connect the same guardian wallet from the recovery page. Keep the family memory link in the meantime.",
      },
      {
        q: "Can I share the memory safely?",
        a: "The public link is designed for family viewing and optional gifts. Parents should share it only with people they trust while the product is still in controlled testing.",
      },
      {
        q: "What emails should I expect?",
        a: "Parents should receive a welcome email after Google sign-in, a memory-created email after saving, and a gift receipt email after a verified wallet gift. Each email points back to recovery with the same Google account.",
      },
      {
        q: "What is AI polish?",
        a: "AI polish is an optional enhancement step for artwork. The original parent-submitted memory stays the anchor, and the feature should never be required to create or recover a memory.",
      },
    ],
  },
  {
    title: "Gifts and payments",
    items: [
      {
        q: "Can family members contribute today?",
        a: "Wallet-based gifts can be tested. Card gifts are paused until the payment-provider path, receipts, fee disclosures, and support process are ready.",
      },
      {
        q: "Why are card gifts paused?",
        a: "A stranger-safe payment flow needs verified provider terms, clear receipts, refund expectations, and plain fee language. Until then, the site should not imply card gifts are live.",
      },
      {
        q: "What are the fees?",
        a: "The current deployed contract includes a 2% network fee. Before broad release, fees and early-withdrawal rules need to be shown plainly before payment.",
      },
      {
        q: "When does a gift receipt send?",
        a: "For wallet gifts, the app asks the server to verify the on-chain transaction before sending the parent a gift receipt. Card gift receipts will wait until card gifts are actually live.",
      },
    ],
  },
  {
    title: "What is live now",
    items: [
      {
        q: "What is ready for controlled testing?",
        a: "Homepage, Google sign-in, simplified Toothlight creation, optional AI polish, live Solana ownership in the advanced app path, memory pages, family sharing, dashboard, recovery, wallet-based gift testing, and the core parent emails.",
      },
      {
        q: "What still needs work before 100 users?",
        a: "Card gifts, privacy and terms pages, a clearer support path, a cleaner recovery runbook, and more testing across fresh browsers and wallets.",
      },
      {
        q: "Where does the story world fit?",
        a: "Tanda and the story world are the magical layer. They help make permanence, ownership, saving, and growth understandable to a child.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <main className="faq-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Parent FAQ</p>
          <h1>Sweet enough for children. Clear enough for parents.</h1>
          <p>
            Tooth Fairy Network should feel safe before it feels technical. These
            answers explain what is live, what is paused, and how a Toothlight
            can become a future asset without turning a childhood moment into a
            transaction.
          </p>
          <div className="actions">
            <Link href="/toothlight/start?from=faq">Create a Toothlight</Link>
            <Link href="/toothfairy/smile-fund">Smile Fund</Link>
          </div>
        </div>
        <div className="trust-panel" aria-label="Trust summary">
          {highlights.map((item) => (
            <div key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-grid" aria-label="Frequently asked questions">
        {groups.map((group) => (
          <article key={group.title}>
            <h2>{group.title}</h2>
            <div className="items">
              {group.items.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="cta">
        <div>
          <p className="eyebrow">Launch stance</p>
          <h2>Memory first. Payments only when the path is ready.</h2>
          <p>
            The product should not ask families to trust money flow until card
            checkout, receipts, disclosures, and support are complete.
          </p>
        </div>
        <Link href="/toothfairy/recover">Recover access</Link>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .faq-page {
          --navy: #11234a;
          --ink: #23365f;
          --muted: #687186;
          --purple: #6d45a8;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.78);
          --border: rgba(178, 151, 107, 0.30);
          min-height: 100vh;
          background: linear-gradient(180deg, #fbf7ee, #f5efe2);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .faq-grid,
        .cta {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .hero {
          display: grid;
          gap: 2rem;
          align-items: end;
          padding: 72px 0 42px;
          border-bottom: 1px solid var(--border);
        }

        .hero-copy {
          max-width: 790px;
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
          max-width: 820px;
          font-size: 4.8rem;
          line-height: 0.94;
        }

        .hero p,
        .cta p {
          max-width: 760px;
          margin: 1.15rem 0 0;
          color: var(--ink);
          font-size: 1.08rem;
          line-height: 1.65;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.6rem;
        }

        .actions a,
        .cta > a {
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

        .actions a:last-child,
        .cta > a {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.62);
          color: var(--navy);
        }

        .trust-panel {
          display: grid;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 252, 247, 0.72);
          overflow: hidden;
        }

        .trust-panel div {
          padding: 1rem;
        }

        .trust-panel div:not(:last-child) {
          border-bottom: 1px solid var(--border);
        }

        .trust-panel strong,
        .trust-panel span {
          display: block;
        }

        .trust-panel strong {
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.18rem;
        }

        .trust-panel span {
          margin-top: 0.25rem;
          color: var(--ink);
          font-size: 0.92rem;
          line-height: 1.45;
        }

        .faq-grid {
          display: grid;
          gap: 1rem;
          padding: 32px 0 72px;
        }

        article {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          padding: 1.2rem;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        article h2 {
          font-size: 1.8rem;
          line-height: 1;
        }

        .items {
          display: grid;
          gap: 0.7rem;
          margin-top: 1rem;
        }

        details {
          border-top: 1px solid var(--border);
          padding-top: 0.8rem;
        }

        summary {
          cursor: pointer;
          color: var(--navy);
          font-weight: 900;
          line-height: 1.35;
        }

        details p {
          margin: 0.65rem 0 0;
          color: var(--ink);
          line-height: 1.58;
        }

        .cta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          padding: 54px 0 78px;
        }

        .cta h2 {
          max-width: 760px;
          font-size: 3rem;
          line-height: 1;
        }

        @media (min-width: 840px) {
          .hero {
            grid-template-columns: minmax(0, 1fr) 320px;
          }

          .faq-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 960px) {
          h1 {
            font-size: 3.7rem;
          }
        }

        @media (max-width: 680px) {
          .hero,
          .faq-grid,
          .cta {
            width: min(100% - 28px, 1180px);
          }

          h1 {
            font-size: 3rem;
          }

          .actions,
          .actions a,
          .cta > a {
            width: 100%;
          }
        }
      `,
        }}
      />
    </main>
  )
}
