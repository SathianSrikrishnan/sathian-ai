import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Family Memory - Tooth Fairy Network",
  description:
    "A simple guide for grandparents and family storytellers who want to read a tooth story, remember the old version, and leave something for later.",
}

const roles = [
  {
    title: "Read a story together",
    body: "Let the child choose the keeper first. Tanda, Perez, the Father, a bird on a roof. The world opens better when the child leads.",
  },
  {
    title: "Tell your version",
    body: "Say what happened in your house when a tooth fell out. A coin, a glass, a drawer, a prayer, a joke. That detail is part of the magic.",
  },
  {
    title: "Leave something small",
    body: "A note for later is enough. A small gift can come after the memory, never before it.",
  },
]

const questions = [
  "What did your parents do when you lost a tooth?",
  "Was there a coin, a hiding place, a song, or a warning?",
  "What small thing do you remember from being this age?",
  "What do you want this child to know when they are older?",
]

const bridgeLinks = [
  {
    title: "Story Atlas",
    href: "/toothfairy/stories",
    body: "Choose a bedtime story from the global tradition shelf.",
  },
  {
    title: "Smile Fund",
    href: "/toothfairy/smile-fund",
    body: "See how small family gifts stay parent-controlled and child-centered.",
  },
  {
    title: "FAQ",
    href: "/toothfairy/faq",
    body: "Read what is live now, what is paused, and how parents stay in control.",
  },
]

export default function GrandparentsPage() {
  return (
    <main className="grandparents-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Grandparents and family storytellers</p>
          <h1>Tell the version only your family knows.</h1>
          <p>
            The child may come for Tanda, Perez, or a keeper on the map. You
            bring the part no one else can: what losing a tooth felt like in
            another kitchen, another house, another time.
          </p>
          <div className="actions">
            <Link href="/toothfairy/stories">Read a story together</Link>
            <Link href="/toothfairy/smile-fund">Leave something for later</Link>
          </div>
        </div>
        <div className="hero-memory" aria-label="Grandparent keepsake moment">
          <Image
            src="/story-assets/viking-origin/vo-02b-kneeling.png"
            alt="A grandparent and child kneeling beside a glowing tooth memory"
            fill
            priority
            sizes="(min-width: 860px) 430px, 92vw"
            className="hero-image"
          />
          <div>
            <span>Try this first</span>
            <b>Ask what happened when they lost a tooth.</b>
          </div>
        </div>
      </section>

      <section className="role-band" aria-label="Grandparent roles">
        <div className="section-head">
          <p className="eyebrow">How to enter the story</p>
          <h2>Start with memory. Let the gift stay quiet.</h2>
        </div>
        <div className="role-grid">
          {roles.map((role, index) => (
            <article key={role.title}>
              <span>0{index + 1}</span>
              <h3>{role.title}</h3>
              <p>{role.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="prompt-band">
        <div>
          <p className="eyebrow">Conversation starters</p>
          <h2>The best contribution may be the story no one wrote down.</h2>
          <p>
            These questions are deliberately simple. They give the child one
            more voice in the room and keep the moment from turning into
            homework.
          </p>
        </div>
        <ul>
          {questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </section>

      <section className="bridge-band" aria-label="Family memory next steps">
        <div className="section-head">
          <p className="eyebrow">Where this connects</p>
          <h2>Three places to go next.</h2>
        </div>
        <div className="bridge-grid">
          {bridgeLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span>{link.title}</span>
              <p>{link.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="close">
        <p>
          The tradition is not only the tooth. It is the person who says, "I
          remember when this happened to me."
        </p>
        <Link href="/toothfairy/app/draw?from=grandparents">Help save the memory</Link>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .grandparents-page {
          --ink: #11234a;
          --ink-soft: #334260;
          --muted: #687188;
          --cream: #fbf7ee;
          --paper: #fffaf1;
          --gold: #d8a43c;
          --gold-deep: #9b690f;
          --forest: #142920;
          --teal: #2f917f;
          --rose: #bd536f;
          --border: rgba(178, 151, 107, 0.32);
          min-height: 100vh;
          background:
            linear-gradient(90deg, rgba(20, 41, 32, 0.05) 1px, transparent 1px),
            linear-gradient(180deg, var(--paper), var(--cream));
          background-size: 54px 54px, auto;
          color: var(--ink);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .hero,
        .role-band,
        .prompt-band,
        .bridge-band,
        .close {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .hero {
          display: grid;
          gap: 2.5rem;
          align-items: center;
          min-height: min(720px, calc(100vh - 72px));
          padding: 62px 0 52px;
        }

        .eyebrow {
          margin: 0 0 0.8rem;
          color: var(--gold-deep);
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3 {
          margin: 0;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          letter-spacing: 0;
        }

        h1 {
          max-width: 820px;
          font-size: clamp(3.2rem, 7vw, 6.1rem);
          line-height: 0.9;
        }

        h2 {
          max-width: 760px;
          font-size: clamp(2.35rem, 5vw, 3.9rem);
          line-height: 0.95;
        }

        h3 {
          font-size: 1.55rem;
          line-height: 1.05;
        }

        p {
          color: var(--ink-soft);
          line-height: 1.65;
        }

        .hero-copy > p:not(.eyebrow),
        .prompt-band > div > p {
          max-width: 720px;
          margin: 1rem 0 0;
          font-size: 1.1rem;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.82rem;
          margin-top: 1.6rem;
        }

        .actions a,
        .close a {
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
        .close a {
          background: linear-gradient(135deg, var(--gold), #efc56d);
          color: #2c2148;
          box-shadow: 0 18px 42px rgba(151, 102, 12, 0.2);
        }

        .actions a:last-child {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.68);
          color: var(--ink);
        }

        .hero-memory {
          position: relative;
          min-height: 520px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--forest);
          box-shadow: 0 30px 78px rgba(20, 41, 32, 0.2);
        }

        .hero-image {
          object-fit: cover;
        }

        .hero-memory:after {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 42%, rgba(20, 41, 32, 0.82));
          content: '';
        }

        .hero-memory div {
          position: absolute;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          z-index: 1;
          border: 1px solid rgba(255, 250, 241, 0.24);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.92);
          padding: 1rem;
        }

        .hero-memory span,
        .role-grid article span {
          color: var(--gold-deep);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .hero-memory b {
          display: block;
          margin-top: 0.4rem;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.65rem;
          line-height: 1.02;
        }

        .role-band,
        .prompt-band,
        .bridge-band,
        .close {
          border-top: 1px solid var(--border);
          padding: 62px 0;
        }

        .role-grid,
        .bridge-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1.6rem;
        }

        .role-grid article,
        .bridge-grid a {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.78);
          padding: 1.1rem;
          box-shadow: 0 20px 46px rgba(48, 38, 24, 0.08);
        }

        .role-grid h3 {
          margin-top: 0.45rem;
        }

        .role-grid p {
          margin: 0.65rem 0 0;
        }

        .prompt-band {
          display: grid;
          gap: 2rem;
          align-items: start;
        }

        ul {
          display: grid;
          gap: 0;
          margin: 0;
          padding: 0;
          list-style: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.78);
          overflow: hidden;
        }

        li {
          padding: 1rem;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1.1;
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--border);
        }

        .bridge-grid a {
          color: inherit;
          text-decoration: none;
        }

        .bridge-grid span {
          color: var(--teal);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.6rem;
          font-weight: 900;
          line-height: 1;
        }

        .bridge-grid p {
          margin: 0.7rem 0 0;
        }

        .close {
          display: grid;
          gap: 1.2rem;
          align-items: center;
          padding-bottom: 82px;
        }

        .close p {
          max-width: 780px;
          margin: 0;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          line-height: 1.08;
        }

        @media (min-width: 860px) {
          .hero {
            grid-template-columns: minmax(0, 1fr) minmax(360px, 0.72fr);
          }

          .role-grid,
          .bridge-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .prompt-band {
            grid-template-columns: minmax(0, 0.9fr) minmax(360px, 0.82fr);
          }

          .close {
            grid-template-columns: minmax(0, 1fr) auto;
          }
        }

        @media (max-width: 680px) {
          .hero,
          .role-band,
          .prompt-band,
          .bridge-band,
          .close {
            width: min(100% - 28px, 1180px);
          }

          .hero {
            min-height: auto;
            padding-top: 42px;
          }

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
