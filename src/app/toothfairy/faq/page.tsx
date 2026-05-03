import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ - Tooth Fairy Network",
  description:
    "Answers for parents about Tooth Fairy Network keepsakes, Smile Funds, NFTs, Solana, fees, safety, and the age-10 milestone.",
}

const groups = [
  {
    title: "Product",
    items: [
      {
        q: "What is Tooth Fairy Network?",
        a: "A parent-and-child activity that turns a lost tooth into a digital keepsake, a family gift page, and a parent-controlled Smile Fund.",
      },
      {
        q: "What is the Smile Fund?",
        a: "The Smile Fund is the savings layer attached to a child&apos;s tooth memory. Family contributions can be tracked in one place while the parent stays in control.",
      },
      {
        q: "Why age 10?",
        a: "Age 10 is the default milestone because children are usually ready for simple conversations about saving, patience, value, and digital ownership. Parents can choose another timing later.",
      },
    ],
  },
  {
    title: "Safety and control",
    items: [
      {
        q: "Who controls the account?",
        a: "The parent or guardian controls the account, sharing, access, and unlock path during the child&apos;s early years.",
      },
      {
        q: "Does my child need a crypto wallet?",
        a: "No. The V1 flow is designed so the parent manages the technical layer. The child experiences it as a memory, story, and savings milestone.",
      },
      {
        q: "What happens if I lose access?",
        a: "The recovery page explains the paths available. Wallet-based recovery depends on the guardian wallet, while email/server-assisted paths depend on the final production setup.",
      },
    ],
  },
  {
    title: "NFTs, Solana, and fees",
    items: [
      {
        q: "Why use an NFT?",
        a: "The NFT is the keepsake record: the child&apos;s tooth art and metadata can point to a durable memory instead of a throwaway photo in a camera roll.",
      },
      {
        q: "Why Solana?",
        a: "Solana gives the product fast, low-cost rails for small family contributions and durable digital records.",
      },
      {
        q: "What are the fees?",
        a: "The current deployed contract includes a 2% fee. The target before broad release is a simpler 1% fee and a lower early-withdrawal penalty, pending contract update and testing.",
      },
    ],
  },
  {
    title: "Launch status",
    items: [
      {
        q: "Can family members contribute with a credit card today?",
        a: "Not yet. Wallet-based gifts can be tested now, and MoonPay card gifts are the next production rail to switch on after partner setup and terms review.",
      },
      {
        q: "What is live enough to test?",
        a: "The public site, story surface, keepsake page, and wallet-based Solana flow are ready for controlled testing. Keep tests small until the card-gift on-ramp and email flows are wired.",
      },
      {
        q: "Is this financial advice?",
        a: "No. Tooth Fairy Network is an educational family savings experience, not investment advice.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <main className="faq-page">
      <section className="hero">
        <p className="eyebrow">FAQ</p>
        <h1>Clear answers before families trust the product.</h1>
        <p>
          This page is intentionally plain about what the product does, what the
          parent controls, what is ready now, and what still needs production
          infrastructure before broad launch.
        </p>
      </section>

      <section className="faq-grid">
        {groups.map((group) => (
          <article key={group.title}>
            <h2>{group.title}</h2>
            <div className="items">
              {group.items.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p dangerouslySetInnerHTML={{ __html: item.a }} />
                </details>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="cta">
        <div>
          <p className="eyebrow">Next step</p>
          <h2>Review the product flow.</h2>
        </div>
        <div className="actions">
          <Link href="/toothfairy/app">Mint keepsake</Link>
          <Link href="/toothfairy/architecture">Security overview</Link>
        </div>
      </section>

      <style>{`
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
          background:
            radial-gradient(circle at 88% 0%, rgba(216, 164, 60, 0.16), transparent 24rem),
            var(--cream);
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
          max-width: 820px;
          font-size: clamp(3rem, 7vw, 5.2rem);
          line-height: 0.95;
        }

        .hero p {
          max-width: 760px;
          margin: 1.15rem 0 0;
          color: var(--ink);
          font-size: 1.08rem;
          line-height: 1.65;
        }

        .faq-grid {
          display: grid;
          gap: 1rem;
          padding: 28px 0 72px;
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
          font-size: clamp(2.1rem, 4vw, 3.2rem);
          line-height: 1;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
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

        @media (min-width: 840px) {
          .faq-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .hero,
          .faq-grid,
          .cta {
            width: min(100% - 28px, 1180px);
          }
        }
      `}</style>
    </main>
  )
}
