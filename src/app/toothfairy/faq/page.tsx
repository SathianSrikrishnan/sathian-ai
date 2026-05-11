import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ - Tooth Fairy Network",
  description:
    "Frequently asked questions about Tooth Fairy Network memories, Smile Funds, parent control, family gifts, recovery, and launch safety.",
}

const essentials = [
  "A lost tooth becomes a first forever memory: photo, drawing, story, and Smile Fund.",
  "The child can begin with their first digital asset, with parent control around the edges.",
  "Access is simple: sign in with Google. All you need is the Gmail address connected to the parent account.",
  "The Smile Fund is parent-controlled until you decide to claim it together when your child is ready.",
  "Card gifts are paused until payment verification, receipts, fee language, refunds, and support are ready.",
]

const faqItems = [
  {
    title: "What is Tooth Fairy Network?",
    body: "It turns a lost tooth into a child's first forever memory: a smile, a drawing, a story, and a parent-controlled Smile Fund. The goal is to turn a small family ritual into a lifetime journey about permanence, ownership, and care.",
  },
  {
    title: "What happens on tooth night?",
    body: "You read or remember a story together, save the tooth moment, let the child draw what happened, and keep the memory. The technology should feel like a helper in the room, not the reason the room exists.",
  },
  {
    title: "Is this my child's first digital wallet?",
    body: "It can become that, but not all at once. If you are a crypto parent, you can think of the keepsake as the child's first digital asset and the Smile Fund as an early, parent-guided savings rail. If you are not a crypto parent, start simpler: it is a memory your child can grow into.",
  },
  {
    title: "How do parents get back in?",
    body: "Continue with Google using the Gmail address connected to the parent account. That inbox is where memories, receipts, and recovery links belong.",
  },
  {
    title: "What is the Smile Fund?",
    body: "It is a parent-controlled practice space for saving, patience, responsibility, ownership, and family generosity. Small gifts can become small conversations about growth, especially when the child can see that family showed up for them.",
  },
  {
    title: "Can family add gifts?",
    body: "Yes, the memory link can invite grandparents, aunties, uncles, and close friends. A gift receipt should send only after the gift is verified.",
  },
  {
    title: "Where do grandparents fit?",
    body: "Grandparents can read a story with the child, share the tooth tradition they remember, and use the Smile Fund link only when the parent invites them.",
  },
  {
    title: "Are card gifts live?",
    body: "Card gifts are paused while payment verification, receipts, fee language, refunds, and support are finalized. The memory path works first; the payment path stays controlled.",
  },
  {
    title: "What is happening under the hood?",
    body: "The keepsake can use a blockchain record, and the Smile Fund can use a smart contract escrow, but parents should not need to manage that vocabulary to use the product. The point is independent financial rails with parent control: durable records, clear permissions, and a simple family experience on top.",
  },
  {
    title: "Is this about self-sovereignty?",
    body: "Eventually, yes, in a child-safe way. Self-sovereignty here does not mean handing a young child a crypto wallet and hoping for the best. It means teaching that some things can truly belong to them, while parents keep the keys, context, and pace until the lesson is ready.",
  },
  {
    title: "What are the stories trying to teach?",
    body: "The stories make ownership feel warm instead of abstract. They give children a fun way to learn that memories can last, promises can be kept, family can participate, and growing up comes with both wonder and responsibility.",
  },
  {
    title: "What does AI polish do?",
    body: "AI polish helps turn a child's drawing, photo, and story into something that feels like a masterpiece. Children love seeing their work transformed, and their colors and marks should be celebrated, not erased.",
  },
  {
    title: "What child data is used?",
    body: "Photos, drawings, and story text are used to build the memory, enhance the artwork, display the finished page, send parent emails, and help with parent-controlled recovery.",
  },
  {
    title: "Is this financial advice?",
    body: "No. Tooth Fairy Network is not a bank, brokerage, exchange, or investment adviser, and it is not investment advice. It is a learning and development ritual for saving, patience, ownership, and responsibility.",
  },
]

const launchNotes = [
  "The memory path is live: create the memory, share the family link, and come back through Google and the parent Gmail inbox.",
  "Card gifts stay paused until the payment provider is live and receipts, fees, refunds, and support are tested end to end.",
  "Advanced wallet gifts are only for controlled testing with families who already know that path.",
  "Parents decide what belongs in a Smile Fund and when to turn the lesson over to the child.",
]

export default function FAQPage() {
  return (
    <main className="guide-page">
      <section className="hero">
        <p className="eyebrow">FAQ</p>
        <h1>The first forever memory: their first digital asset, with parent control around the edges.</h1>
        <p>
          For crypto parents, not-yet-crypto parents, grandparents, and anyone
          wondering what this is really trying to promote: permanence,
          ownership, a fun way to learn, and an activity families can do
          together.
        </p>
        <div className="actions">
          <Link href="/toothfairy/app/draw?from=faq">Create a memory</Link>
          <Link href="/api/auth/google?next=%2Ftoothfairy%2Fapp%2Fdashboard" prefetch={false}>
            Continue with Google
          </Link>
          <Link href="/toothfairy/grandparents">Grandparent guide</Link>
        </div>
      </section>

      <section className="essentials" aria-label="Parent essentials">
        <h2>What matters first</h2>
        <ul>
          {essentials.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="notes" aria-label="Frequently asked questions">
        {faqItems.map((note) => (
          <article key={note.title}>
            <h2>{note.title}</h2>
            <p>{note.body}</p>
          </article>
        ))}
      </section>

      <section className="boundaries">
        <div>
          <p className="eyebrow">Launch status</p>
          <h2>Memory is live. Card gifts wait until the money path is ready.</h2>
        </div>
        <div className="boundary-list">
          {launchNotes.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .guide-page {
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
        .essentials,
        .notes,
        .boundaries,
        .launch {
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
          max-width: 910px;
          font-size: clamp(3rem, 7vw, 5.25rem);
          line-height: 0.95;
        }

        .hero p,
        .essentials li,
        article p,
        .boundary-list p,
        .launch p {
          color: var(--ink);
          font-size: 1.06rem;
          line-height: 1.65;
        }

        .hero p {
          max-width: 760px;
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

        .actions a:not(:first-child) {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.62);
          color: var(--navy);
        }

        .essentials {
          display: grid;
          gap: 1.2rem;
          padding: 36px 0 28px;
        }

        .essentials h2,
        .boundaries h2,
        .launch h2 {
          max-width: 760px;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1;
        }

        .essentials ul {
          display: grid;
          gap: 0;
          margin: 0;
          padding: 0;
          list-style: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 252, 247, 0.62);
          overflow: hidden;
        }

        .essentials li {
          margin: 0;
          padding: 1rem;
          font-weight: 850;
        }

        .essentials li:not(:last-child) {
          border-bottom: 1px solid var(--border);
        }

        .notes {
          display: grid;
          gap: 1rem;
          padding: 8px 0 44px;
        }

        article {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          padding: 1.25rem;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        article h2 {
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
          font-size: 1.35rem;
          line-height: 1.12;
          font-weight: 900;
        }

        article p {
          margin: 0.8rem 0 0;
        }

        .boundaries {
          display: grid;
          gap: 1.2rem;
          border-top: 1px solid var(--border);
          padding: 44px 0;
        }

        .boundary-list {
          display: grid;
          gap: 0.8rem;
        }

        .boundary-list p {
          margin: 0;
          border-left: 4px solid var(--gold);
          padding-left: 1rem;
          font-weight: 800;
        }

        .launch {
          padding: 44px 0 78px;
        }

        .launch p {
          max-width: 800px;
          margin: 1rem 0 0;
        }

        @media (min-width: 840px) {
          .essentials,
          .boundaries {
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
            align-items: start;
          }

          .notes {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .hero,
          .essentials,
          .notes,
          .boundaries,
          .launch {
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
