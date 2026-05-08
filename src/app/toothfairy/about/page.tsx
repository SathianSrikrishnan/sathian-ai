import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About - Tooth Fairy Network",
  description:
    "Tooth Fairy Network helps parents turn a lost tooth into a storybook memory, a first ownership lesson, and a parent-controlled savings ritual.",
}

const momentCards = [
  {
    title: "A tooth is different",
    body: "It is not a toy someone bought. It is not a prize someone handed over. Your child grew it, held it, and watched it change hands.",
  },
  {
    title: "A memory can last",
    body: "The first forever memory is free to save, so the moment can stay bigger than the night it happened.",
  },
  {
    title: "A family can witness it",
    body: "Grandparents, godparents, aunties, uncles, and the people who matter can be part of the ritual without taking control away from parents.",
  },
]

const trustCards = [
  {
    title: "Parents set the pace",
    body: "You decide what is saved, who can see it, and when your child is ready to learn from the Smile Fund.",
  },
  {
    title: "The technology stays quiet",
    body: "The durable rails sit behind the scenes. The story, the drawing, and the parent-child ritual stay in front.",
  },
  {
    title: "Small amounts are enough",
    body: "The Smile Fund is for practice: saving, growth, compounding, patience, generosity, and responsibility in amounts that can stay small.",
  },
  {
    title: "The boundaries are real",
    body: "Tooth Fairy Network is not a bank and this is not investment advice. Card-funded gifts are paused until the safety, fee, and parent-control path is ready.",
  },
]

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">About Tooth Fairy Network</p>
          <h1>A lost tooth can teach ownership before money ever does.</h1>
          <p>
            Children do not need to wait until adulthood to meet big ideas. They
            need the idea placed in front of them at the right size. A tooth is
            perfect because their body made it, their hands held it, and the
            Tooth Fairy already makes the moment feel worth protecting.
          </p>
          <div className="hero-actions">
            <Link href="/toothfairy/app/draw?from=about">Create a memory</Link>
            <Link href="/toothfairy/story/tanda">Meet Tanda</Link>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <Image
            src="/toothfairy/visual-system/tanda-guide-v1.png"
            alt=""
            fill
            sizes="(min-width: 900px) 380px, 88vw"
            priority
          />
        </div>
      </section>

      <section className="why-section">
        <div className="why-copy">
          <p className="eyebrow">Why this exists</p>
          <h2>Make the first lesson small enough to hold.</h2>
        </div>
        <div className="why-body">
          <p>
            Tooth Fairy Network is a parent-child activity for the night a tooth
            comes out. It turns a familiar childhood ritual into a first lesson
            in ownership, permanence, and care.
          </p>
          <p>
            The tooth is the catalyst. It opens a conversation you can return
            to through the stories, resources, and Smile Fund: saving,
            compounding, growth, and what it means to own something with care.
            Invite your tribe, your family, and the closest loved ones into that
            lesson while you keep the controls.
          </p>
        </div>
      </section>

      <section className="moment-grid" aria-label="What the tooth moment becomes">
        {momentCards.map((card) => (
          <article key={card.title} className="moment-card">
            <span aria-hidden />
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </section>

      <section className="story-band">
        <Image
          src="/fairy-assets/fairy-network-sky.jpg"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="story-copy">
          <p className="eyebrow">Tanda and the storybook layer</p>
          <h2>Tanda gives the lesson a world to live in.</h2>
          <p>
            As Tanda builds and unites the collectors of the Tooth Fairy Network,
            children get bedtime stories instead of lectures. Each character can
            carry a lesson about memory, courage, patience, value, and what we
            choose to protect.
          </p>
          <div className="story-actions">
            <Link href="/toothfairy/stories">Read the stories</Link>
            <Link href="/toothfairy/story/tanda">Meet Tanda</Link>
          </div>
        </div>
      </section>

      <section className="smile-section">
        <div className="smile-heading">
          <p className="eyebrow">The Smile Fund</p>
          <h2>It takes a family to make ownership feel gentle.</h2>
        </div>
        <div className="smile-body">
          <p>
            The Smile Fund gives small gifts a job. Each gift can become a
            conversation about saving, waiting, growth, compounding, patience,
            generosity, and responsibility.
          </p>
          <p>
            Parents decide when a child is ready for the next lesson. Until
            then, the story, the memory, and the parent-controlled fund can
            grow together at the child's pace.
          </p>
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-heading">
          <p className="eyebrow">What parents should know</p>
          <h2>The child gets joy. The parent keeps control.</h2>
        </div>
        <div className="trust-grid">
          {trustCards.map((card) => (
            <article key={card.title} className="trust-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta">
        <div>
          <p className="eyebrow">Start with one tooth</p>
          <h2>Keep the magic. Save the memory for free. Let the lesson grow.</h2>
        </div>
        <Link href="/toothfairy/app/draw?from=about">Create a memory</Link>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        body {
          margin: 0;
        }

        .about-page {
          --navy: #11234a;
          --ink: #26395f;
          --muted: #64708a;
          --purple: #6d45a8;
          --rose: #b94f8f;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.86);
          --border: rgba(178, 151, 107, 0.32);
          min-height: 100vh;
          background:
            radial-gradient(circle at 88% 4%, rgba(216, 164, 60, 0.16), transparent 26rem),
            radial-gradient(circle at 8% 14%, rgba(185, 79, 143, 0.08), transparent 22rem),
            linear-gradient(180deg, #fffaf1 0%, var(--cream) 46%, #fffaf1 100%);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .why-section,
        .moment-grid,
        .smile-section,
        .trust-section,
        .cta {
          width: min(100% - 40px, 1180px);
          margin: 0 auto;
        }

        .hero {
          display: grid;
          gap: 2.2rem;
          align-items: center;
          padding: 78px 0 68px;
        }

        .eyebrow {
          margin: 0 0 0.75rem;
          color: #a46b0b;
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
          max-width: 820px;
          font-size: clamp(3rem, 6.8vw, 5.25rem);
          line-height: 0.96;
        }

        h2 {
          font-size: clamp(2.15rem, 4vw, 3.45rem);
          line-height: 1;
        }

        h3 {
          font-size: 1.34rem;
          line-height: 1.06;
        }

        p {
          margin: 0;
        }

        .hero-copy p:not(.eyebrow),
        .why-body p,
        .story-copy p,
        .smile-body p,
        .moment-card p,
        .trust-card p {
          color: var(--ink);
          font-size: 1.05rem;
          line-height: 1.66;
        }

        .hero-copy p:not(.eyebrow) {
          max-width: 700px;
          margin-top: 1.2rem;
          font-size: 1.12rem;
        }

        .hero-actions,
        .story-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.55rem;
        }

        .hero-actions a,
        .story-actions a,
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

        .hero-actions a:first-child,
        .cta a {
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
          box-shadow: 0 16px 34px rgba(109, 69, 168, 0.22);
        }

        .hero-actions a:last-child {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.68);
          color: var(--navy);
        }

        .hero-art {
          position: relative;
          min-height: 430px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background:
            radial-gradient(circle at 50% 18%, rgba(255, 244, 203, 0.74), transparent 16rem),
            linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(255, 250, 241, 0.34));
          box-shadow: 0 22px 60px rgba(48, 38, 24, 0.1);
          overflow: hidden;
        }

        .hero-art img {
          object-fit: contain;
          padding: 1rem;
        }

        .why-section,
        .smile-section,
        .trust-section {
          display: grid;
          gap: 1.5rem;
          align-items: start;
          padding: 76px 0;
          border-top: 1px solid var(--border);
        }

        .why-body,
        .smile-body {
          display: grid;
          gap: 1rem;
        }

        .moment-grid {
          display: grid;
          gap: 1rem;
          padding-bottom: 76px;
        }

        .moment-card,
        .trust-card {
          position: relative;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          padding: 1.2rem;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.07);
        }

        .moment-card span {
          display: block;
          width: 38px;
          height: 4px;
          margin-bottom: 1rem;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--gold), var(--rose), var(--purple));
        }

        .moment-card p,
        .trust-card p {
          margin-top: 0.72rem;
        }

        .story-band {
          position: relative;
          min-height: 500px;
          overflow: hidden;
          background: #12192c;
        }

        .story-band img {
          object-fit: cover;
        }

        .story-band:after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(17, 18, 45, 0.96), rgba(17, 18, 45, 0.66), rgba(17, 18, 45, 0.12));
        }

        .story-copy {
          position: relative;
          z-index: 1;
          width: min(100% - 40px, 1180px);
          max-width: 760px;
          margin: 0 auto;
          padding: 96px 0;
        }

        .story-copy h2 {
          color: #fffaf1;
        }

        .story-copy p {
          color: #f4edff;
          margin-top: 1rem;
        }

        .story-copy .eyebrow {
          color: #f4d98c;
        }

        .story-actions a {
          border: 1px solid rgba(244, 217, 140, 0.42);
          background: rgba(255, 250, 241, 0.12);
          color: #fffaf1;
        }

        .story-actions a:first-child {
          background: #f4d98c;
          color: #1f2340;
        }

        .trust-grid {
          display: grid;
          gap: 0.9rem;
        }

        .cta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          padding: 54px 0 82px;
          border-top: 1px solid var(--border);
        }

        .cta h2 {
          max-width: 820px;
        }

        @media (min-width: 840px) {
          .hero {
            grid-template-columns: minmax(0, 1.16fr) minmax(320px, 0.84fr);
          }

          .why-section,
          .smile-section,
          .trust-section {
            grid-template-columns: 0.96fr 1.04fr;
          }

          .moment-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .trust-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .story-copy {
            margin-left: max(20px, calc((100vw - 1180px) / 2));
          }
        }

        @media (max-width: 680px) {
          .hero,
          .why-section,
          .moment-grid,
          .smile-section,
          .trust-section,
          .cta,
          .story-copy {
            width: min(100% - 28px, 1180px);
          }

          .hero {
            padding: 52px 0;
          }

          .hero-art {
            min-height: 330px;
          }

          .why-section,
          .smile-section,
          .trust-section {
            padding: 56px 0;
          }

          .moment-grid {
            padding-bottom: 56px;
          }
        }
      `,
        }}
      />
    </main>
  )
}
