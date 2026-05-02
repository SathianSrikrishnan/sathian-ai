import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About - Tooth Fairy Network",
  description:
    "Tooth Fairy Network turns a lost tooth into a family keepsake, a Smile Fund, and a first lesson in digital ownership.",
}

const pillars = [
  {
    title: "A ritual parents already understand",
    body: "A child loses a tooth. The family pauses, saves the moment, and turns it into something worth revisiting.",
  },
  {
    title: "A simple savings milestone",
    body: "The Smile Fund keeps the financial layer parent controlled, transparent, and pointed toward the age-10 learning moment.",
  },
  {
    title: "A story world with room to grow",
    body: "Tanda connects global tooth traditions into one playful network that can become stories, books, animation, and games.",
  },
]

const principles = [
  "Parents stay in control.",
  "The child sees magic first, finance second.",
  "Fees and product limits should be plain.",
  "The story universe should make the product more understandable, not more confusing.",
]

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Company</p>
          <h1>We are turning a tiny childhood ritual into a first lesson in ownership.</h1>
          <p>
            Tooth Fairy Network is a family product for the moment children lose
            their teeth. It combines a digital keepsake, a shareable gift page,
            and a parent-controlled Smile Fund that can unlock around age 10.
          </p>
          <div className="actions">
            <Link href="/toothfairy/app">Mint a keepsake</Link>
            <Link href="/toothfairy/faq">Read the FAQ</Link>
          </div>
        </div>
        <div className="hero-art">
          <Image
            src="/toothfairy/visual-system/tanda-guide-v1.png"
            alt="Tanda, the Tooth Fairy Network guide"
            fill
            sizes="(min-width: 900px) 380px, 88vw"
            className="object-contain"
            priority
          />
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">What we are building</p>
        <div className="split">
          <h2>A product simple enough for bedtime, with enough depth to become a universe.</h2>
          <p>
            The core product is intentionally small: save the tooth memory,
            invite loved ones to contribute, and let the child grow into the
            account later. The content layer gives families a reason to return:
            Tanda, cultural tooth traditions, and stories from around the world.
          </p>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="network">
        <Image
          src="/fairy-assets/fairy-network-sky.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="network-copy">
          <p className="eyebrow">The network idea</p>
          <h2>The folklore is the metaphor.</h2>
          <p>
            Around the world, children give lost teeth to fairies, mice, birds,
            the sun, rooftops, rivers, and family rituals. Tooth Fairy Network
            turns that old idea into a modern one: many small moments connected
            into one durable family record.
          </p>
        </div>
      </section>

      <section className="section proof">
        <div>
          <p className="eyebrow">Operating principles</p>
          <h2>Trust has to be visible.</h2>
        </div>
        <div className="principle-list">
          {principles.map((principle) => (
            <p key={principle}>{principle}</p>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Start with one tooth memory.</h2>
        <Link href="/toothfairy/app">Create the first keepsake</Link>
      </section>

      <style>{`
        .about-page {
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
            radial-gradient(circle at 86% 0%, rgba(216, 164, 60, 0.16), transparent 26rem),
            radial-gradient(circle at 12% 6%, rgba(109, 69, 168, 0.09), transparent 22rem),
            var(--cream);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .section,
        .cta {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .hero {
          display: grid;
          gap: 2rem;
          align-items: center;
          padding: 72px 0;
        }

        .eyebrow {
          margin: 0 0 0.75rem;
          color: #b77a11;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3 {
          margin: 0;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          letter-spacing: 0;
        }

        h1 {
          max-width: 760px;
          font-size: clamp(3rem, 7vw, 5.4rem);
          line-height: 0.95;
        }

        h2 {
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          line-height: 1;
        }

        .hero-copy p:not(.eyebrow),
        .split p,
        .network-copy p,
        article p {
          color: var(--ink);
          font-size: 1.06rem;
          line-height: 1.65;
        }

        .hero-copy p:not(.eyebrow) {
          max-width: 660px;
          margin: 1.15rem 0 0;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.6rem;
        }

        .actions a,
        .cta a {
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
        .cta a {
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
          box-shadow: 0 16px 34px rgba(109, 69, 168, 0.22);
        }

        .actions a:last-child {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.62);
          color: var(--navy);
        }

        .hero-art {
          position: relative;
          min-height: 430px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.54);
          box-shadow: 0 22px 60px rgba(48, 38, 24, 0.10);
          overflow: hidden;
        }

        .section {
          padding: 72px 0;
          border-top: 1px solid var(--border);
        }

        .split {
          display: grid;
          gap: 1.2rem;
          align-items: start;
        }

        .split p {
          margin: 0;
        }

        .pillar-grid {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }

        article,
        .principle-list p {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          padding: 1.2rem;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        article h3 {
          font-size: 1.5rem;
          line-height: 1;
        }

        article p {
          margin: 0.75rem 0 0;
        }

        .network {
          position: relative;
          min-height: 440px;
          overflow: hidden;
          background: #191535;
        }

        .network:after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(25, 16, 54, 0.96), rgba(25, 16, 54, 0.62), rgba(25, 16, 54, 0.15));
        }

        .network-copy {
          position: relative;
          z-index: 1;
          width: min(100% - 40px, 1180px);
          max-width: 720px;
          margin: 0 auto;
          padding: 86px 0;
        }

        .network-copy h2 {
          color: #fffaf1;
        }

        .network-copy p {
          color: #f1e7ff;
        }

        .network-copy .eyebrow {
          color: #f4d98c;
        }

        .proof {
          display: grid;
          gap: 2rem;
          align-items: start;
        }

        .principle-list {
          display: grid;
          gap: 0.8rem;
        }

        .principle-list p {
          margin: 0;
          color: var(--ink);
          font-weight: 850;
        }

        .cta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          padding: 54px 0 78px;
        }

        @media (min-width: 840px) {
          .hero {
            grid-template-columns: 1.18fr 0.82fr;
          }

          .split,
          .proof {
            grid-template-columns: 0.95fr 1.05fr;
          }

          .pillar-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .network-copy {
            margin-left: max(20px, calc((100vw - 1180px) / 2));
          }
        }

        @media (max-width: 680px) {
          .hero,
          .section,
          .cta,
          .network-copy {
            width: min(100% - 28px, 1180px);
          }

          .hero {
            padding: 52px 0;
          }

          .hero-art {
            min-height: 330px;
          }
        }
      `}</style>
    </main>
  )
}
