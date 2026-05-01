"use client"

import Image from "next/image"
import Link from "next/link"
import { FEATURED_STORIES } from "@/data/stories"

const storyImages: Record<string, string> = {
  tanda: "/story-assets/tanda/tf-05-tanda.png",
  "viking-origin": "/story-assets/viking-origin/vo-01-village.png",
  "ratoncito-perez": "/story-assets/ratoncito-perez/rp-02-mouse.png",
}

const trustStats = [
  { value: "3 min", label: "to create" },
  { value: "Age 10", label: "suggested unlock" },
  { value: "Family", label: "gift link" },
  { value: "Solana", label: "transparent rails" },
]

const steps = [
  {
    title: "Capture the tooth",
    body: "Add a smile photo, a drawing, and a note while the moment is fresh.",
  },
  {
    title: "Mint the memory",
    body: "Create a shareable keepsake page that belongs to the family.",
  },
  {
    title: "Invite the village",
    body: "Grandparents and loved ones can add gifts to the Smile Fund.",
  },
]

const reasons = [
  "Preserve the moment",
  "Turn gifting into saving",
  "Invite grandparents",
  "Teach ownership early",
]

export default function ToothFairyLanding() {
  const tales = FEATURED_STORIES.slice(0, 3)

  return (
    <main className="tfn-page min-h-screen overflow-hidden">
      <section className="hero">
        <Image
          src="/toothfairy/concept-b/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-bg object-cover"
        />
        <div className="network-lines" aria-hidden>
          <span className="node node-a" />
          <span className="node node-b" />
          <span className="node node-c" />
          <span className="line line-a" />
          <span className="line line-b" />
        </div>

        <div className="hero-inner mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div className="hero-copy-wrap">
            <p className="eyebrow">Tooth Fairy Network</p>
            <h1>
              Mint a memory.
              <span>Start their Smile Fund.</span>
            </h1>
            <p className="hero-copy">
              A child loses a tooth. You save the story, mint a keepsake, and
              share one simple link so family can contribute to a
              parent-controlled fund they can grow into by age 10.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/toothfairy/app" className="primary-cta">
                Mint their first memory
                <span aria-hidden>{"->"}</span>
              </Link>
              <Link href="#how-it-works" className="secondary-cta">
                See how it works
              </Link>
            </div>

            <div className="stat-strip">
              {trustStats.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-stage" aria-label="Tooth Fairy Network preview">
            <div className="photo-frame">
              <Image
                src="/toothfairy/concept-b/hero.png"
                alt="A smiling child showing a newly lost tooth"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 92vw"
                className="object-cover"
              />
            </div>

            <div className="tanda">
              <Image
                src="/story-assets/refs/ref-01-tanda.jpg"
                alt="Tanda, the Tooth Fairy Network guide"
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>

            <div className="memory-card">
              <p>Tooth Memory</p>
              <strong>#1024</strong>
              <span>Saved on Solana</span>
            </div>

            <div className="fund-card">
              <p>Little Smile Fund</p>
              <strong>12.45 SOL</strong>
              <span>Family gifts and notes</span>
              <div className="chart" aria-hidden>
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="band">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
          <div className="section-heading">
            <p className="eyebrow">The product</p>
            <h2>One tooth becomes one first lesson in ownership.</h2>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="step">
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-16">
        <div className="section-heading left">
          <p className="eyebrow">Smile Fund</p>
          <h2>A gift page grandparents can understand.</h2>
          <p>
            The launch version should feel like a birthday card, not a crypto
            dashboard. Family sees the keepsake, adds a gift, leaves a note,
            and the parent remains in control.
          </p>
          <Link href="/toothfairy/app" className="text-link">
            Start the first memory <span aria-hidden>{"->"}</span>
          </Link>
        </div>

        <div className="product-preview">
          <div className="keepsake-image">
            <Image
              src="/toothfairy/concept-b/keepsake-mockup.png"
              alt="A sample Tooth Fairy Network keepsake"
              fill
              sizes="(min-width: 1024px) 300px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="preview-panel">
            <p>Little Smile Fund</p>
            <strong>12.45 SOL</strong>
            <span>23 family gifts</span>
            <div className="wide-chart" aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="preview-row">
              <span>Suggested unlock</span>
              <strong>Age 10</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="story-callout">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div>
            <p className="eyebrow">The story layer</p>
            <h2>Tanda makes the financial product feel magical.</h2>
            <p>
              The product is simple: a keepsake and a small savings account.
              The universe around it makes it memorable: fairies, mice, birds,
              and guardians around the world all connected by the Network.
            </p>
          </div>
          <div className="network-image">
            <Image
              src="/story-assets/shared/shared-network-station.jpg"
              alt="A glowing Tooth Fairy Network station"
              fill
              sizes="(min-width: 1024px) 460px, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
          <div className="section-heading">
            <p className="eyebrow">Why parents love it</p>
            <h2>A familiar ritual with a useful next step.</h2>
          </div>

          <div className="reason-strip">
            {reasons.map((reason) => (
              <div key={reason}>{reason}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="cultural-tales" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="section-heading">
          <p className="eyebrow">Cultural tales</p>
          <h2>Stories that make families come back.</h2>
          <p>
            The first stories introduce Tanda and the global traditions that
            will make the Network feel alive.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {tales.map((story) => (
            <Link
              key={story.id}
              href={`/toothfairy/story/${story.id}`}
              className="tale"
            >
              <span className="tale-img">
                <Image
                  src={storyImages[story.id] || story.scenes[0]?.background || "/toothfairy/concept-b/hero-bg.png"}
                  alt={story.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 90vw"
                  className="object-cover"
                />
              </span>
              <span className="tale-copy">
                <strong>{story.title}</strong>
                <em>{story.region}</em>
                <span>{story.description}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/toothfairy/stories" className="secondary-cta">
            Explore more tales
          </Link>
        </div>
      </section>

      <style jsx>{`
        .tfn-page {
          background: var(--tfn-surface);
          color: var(--tfn-ink);
          font-family: var(--font-body), "Alegreya Sans", system-ui, sans-serif;
        }

        .hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--tfn-border);
          background: var(--tfn-surface);
        }

        .hero-bg {
          opacity: 0.28;
          filter: saturate(0.9);
        }

        .hero:after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, var(--tfn-surface) 0%, oklch(97.5% 0.01 80 / 0.88) 44%, oklch(97.5% 0.01 80 / 0.34) 100%),
            linear-gradient(180deg, transparent 0%, var(--tfn-surface) 100%);
          pointer-events: none;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
        }

        .network-lines {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.52;
        }

        .node,
        .line {
          position: absolute;
          display: block;
        }

        .node {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--tfn-gold);
          box-shadow: 0 0 24px oklch(72% 0.145 75 / 0.5);
        }

        .node-a { left: 58%; top: 22%; }
        .node-b { left: 76%; top: 36%; }
        .node-c { left: 88%; top: 54%; }

        .line {
          height: 1px;
          background: linear-gradient(90deg, transparent, oklch(72% 0.145 75 / 0.5), transparent);
          transform-origin: left center;
        }

        .line-a { left: 58%; top: 23%; width: 260px; transform: rotate(24deg); }
        .line-b { left: 76%; top: 37%; width: 220px; transform: rotate(35deg); }

        .eyebrow {
          margin: 0 0 0.8rem;
          color: var(--tfn-gold-hover);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .hero-copy-wrap h1,
        .section-heading h2,
        .story-callout h2 {
          margin: 0;
          color: var(--tfn-ink);
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          letter-spacing: 0;
        }

        .hero-copy-wrap h1 {
          max-width: 10em;
          font-size: clamp(3rem, 7vw, 5.8rem);
          font-weight: 800;
          line-height: 0.94;
        }

        .hero-copy-wrap h1 span {
          display: block;
          color: #6d45a8;
        }

        .hero-copy {
          max-width: 36rem;
          margin-top: 1.25rem;
          color: var(--tfn-ink-soft);
          font-size: clamp(1.02rem, 1.5vw, 1.2rem);
          line-height: 1.68;
        }

        .primary-cta,
        .secondary-cta {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border-radius: 999px;
          padding: 0.88rem 1.35rem;
          font-weight: 900;
          text-decoration: none;
        }

        .primary-cta {
          background: linear-gradient(135deg, #6d45a8, #8a5cc5);
          color: #fffaf1;
          box-shadow: 0 14px 34px oklch(37% 0.11 302 / 0.22);
        }

        .secondary-cta {
          border: 1px solid var(--tfn-border);
          color: var(--tfn-ink);
          background: oklch(100% 0 0 / 0.45);
        }

        .stat-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          max-width: 620px;
          margin-top: 2rem;
          overflow: hidden;
          border: 1px solid var(--tfn-border);
          border-radius: 8px;
          background: var(--tfn-border);
        }

        .stat-strip div {
          min-height: 84px;
          padding: 0.9rem;
          background: oklch(100% 0 0 / 0.68);
        }

        .stat-strip strong {
          display: block;
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          font-size: 1.16rem;
          line-height: 1;
        }

        .stat-strip span {
          display: block;
          margin-top: 0.4rem;
          color: var(--tfn-ink-muted);
          font-size: 0.8rem;
          line-height: 1.25;
        }

        .hero-stage {
          position: relative;
          min-height: 590px;
        }

        .photo-frame {
          position: absolute;
          inset: 0 5% 4% 13%;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 34px 80px oklch(30% 0.035 65 / 0.18);
        }

        .tanda {
          position: absolute;
          left: 0;
          top: 12%;
          width: 156px;
          height: 196px;
          overflow: hidden;
          border: 1px solid oklch(100% 0 0 / 0.78);
          border-radius: 8px;
          box-shadow: 0 24px 60px oklch(37% 0.11 302 / 0.22);
        }

        .memory-card,
        .fund-card,
        .step,
        .product-preview,
        .reason-strip div,
        .tale {
          border: 1px solid var(--tfn-border);
          border-radius: 8px;
          box-shadow: 0 12px 30px oklch(30% 0.035 65 / 0.06);
        }

        .memory-card,
        .fund-card {
          position: absolute;
          background: oklch(99% 0.006 82 / 0.94);
          backdrop-filter: blur(14px);
        }

        .memory-card {
          right: 0;
          top: 18%;
          width: 158px;
          padding: 1rem;
          color: var(--tfn-ink);
        }

        .memory-card p,
        .fund-card p {
          margin: 0;
          color: var(--tfn-ink-muted);
          font-size: 0.75rem;
          font-weight: 800;
        }

        .memory-card strong,
        .fund-card strong {
          display: block;
          margin-top: 0.35rem;
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          font-size: 1.28rem;
          line-height: 1;
        }

        .memory-card span,
        .fund-card span {
          display: block;
          margin-top: 0.35rem;
          color: var(--tfn-ink-muted);
          font-size: 0.76rem;
        }

        .fund-card {
          right: 7%;
          bottom: 2%;
          width: min(260px, 62vw);
          padding: 1rem;
        }

        .chart,
        .wide-chart {
          display: flex;
          align-items: end;
          gap: 7px;
        }

        .chart {
          height: 56px;
          margin-top: 0.85rem;
        }

        .chart i,
        .wide-chart i {
          flex: 1;
          border-radius: 999px 999px 0 0;
          background: linear-gradient(180deg, #4fb891, #dff4e8);
        }

        .chart i:nth-child(1) { height: 24%; }
        .chart i:nth-child(2) { height: 40%; }
        .chart i:nth-child(3) { height: 36%; }
        .chart i:nth-child(4) { height: 64%; }
        .chart i:nth-child(5) { height: 92%; }

        .band {
          border-bottom: 1px solid var(--tfn-border);
          border-top: 1px solid var(--tfn-border);
          background: linear-gradient(180deg, var(--tfn-surface-alt), var(--tfn-surface));
        }

        .section-heading {
          max-width: 690px;
          margin: 0 auto;
          text-align: center;
        }

        .section-heading.left {
          margin: 0;
          text-align: left;
        }

        .section-heading h2,
        .story-callout h2 {
          font-size: clamp(2rem, 4vw, 3.25rem);
          line-height: 1;
        }

        .section-heading p:not(.eyebrow),
        .story-callout p:not(.eyebrow) {
          margin-top: 1rem;
          color: var(--tfn-ink-soft);
          font-size: 1.05rem;
          line-height: 1.65;
        }

        .step {
          min-height: 210px;
          padding: 1.25rem;
          background: oklch(100% 0 0 / 0.58);
        }

        .step span {
          color: var(--tfn-gold-hover);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .step h3 {
          margin: 0.9rem 0 0.55rem;
          color: var(--tfn-ink);
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          font-size: 1.45rem;
          line-height: 1;
        }

        .step p {
          color: var(--tfn-ink-soft);
          line-height: 1.58;
        }

        .text-link {
          display: inline-flex;
          gap: 0.4rem;
          margin-top: 1.4rem;
          color: #6d45a8;
          font-weight: 900;
          text-decoration: none;
        }

        .product-preview {
          display: grid;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, oklch(100% 0 0 / 0.64), oklch(96% 0.018 75 / 0.75));
        }

        .keepsake-image,
        .network-image {
          position: relative;
          min-height: 270px;
          overflow: hidden;
          border: 1px solid var(--tfn-border);
          border-radius: 8px;
        }

        .preview-panel {
          border: 1px solid var(--tfn-border);
          border-radius: 8px;
          background: oklch(100% 0 0 / 0.72);
          padding: 1.1rem;
        }

        .preview-panel p {
          margin: 0;
          color: var(--tfn-ink-soft);
          font-weight: 900;
        }

        .preview-panel > strong {
          display: block;
          margin-top: 0.45rem;
          color: var(--tfn-ink);
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          line-height: 1;
        }

        .preview-panel > span {
          color: var(--tfn-ink-muted);
        }

        .wide-chart {
          height: 112px;
          margin-top: 1.25rem;
          border-bottom: 1px solid var(--tfn-border);
        }

        .wide-chart i:nth-child(1) { height: 20%; }
        .wide-chart i:nth-child(2) { height: 34%; }
        .wide-chart i:nth-child(3) { height: 48%; }
        .wide-chart i:nth-child(4) { height: 66%; }
        .wide-chart i:nth-child(5) { height: 78%; }
        .wide-chart i:nth-child(6) { height: 96%; }

        .preview-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
          color: var(--tfn-ink-muted);
          font-size: 0.9rem;
        }

        .preview-row strong {
          color: var(--tfn-ink);
        }

        .story-callout {
          background:
            radial-gradient(circle at 88% 10%, oklch(72% 0.145 75 / 0.18), transparent 20rem),
            linear-gradient(135deg, #241142, #311c58);
          color: #fffaf1;
        }

        .story-callout .eyebrow {
          color: #f3d88d;
        }

        .story-callout h2 {
          color: #fffaf1;
        }

        .story-callout p:not(.eyebrow) {
          color: #efe5ff;
        }

        .network-image {
          border-color: oklch(100% 0 0 / 0.18);
          box-shadow: 0 22px 60px oklch(16% 0.05 296 / 0.24);
        }

        .reason-strip {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }

        .reason-strip div {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: oklch(100% 0 0 / 0.58);
          color: var(--tfn-ink);
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
        }

        .tale {
          display: block;
          overflow: hidden;
          color: inherit;
          text-decoration: none;
          background: oklch(100% 0 0 / 0.6);
        }

        .tale-img {
          position: relative;
          display: block;
          height: 178px;
        }

        .tale-copy {
          display: block;
          padding: 1rem;
        }

        .tale-copy strong {
          display: block;
          color: var(--tfn-ink);
          font-family: var(--font-display), "Alegreya", Georgia, serif;
          font-size: 1.35rem;
          line-height: 1;
        }

        .tale-copy em {
          display: block;
          margin-top: 0.25rem;
          color: var(--tfn-gold-hover);
          font-size: 0.88rem;
          font-style: normal;
          font-weight: 900;
        }

        .tale-copy span {
          display: block;
          margin-top: 0.75rem;
          color: var(--tfn-ink-soft);
          line-height: 1.55;
        }

        @media (min-width: 768px) {
          .product-preview {
            grid-template-columns: 0.78fr 1.22fr;
          }

          .reason-strip {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 1023px) {
          .hero-stage {
            min-height: 560px;
          }

          .photo-frame {
            inset: 4% 0 0 8%;
          }
        }

        @media (max-width: 640px) {
          .stat-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .hero-stage {
            min-height: 510px;
          }

          .photo-frame {
            inset: 7% 0 0 0;
          }

          .tanda {
            left: 0;
            top: 0;
            width: 126px;
            height: 158px;
          }

          .memory-card {
            right: 0;
            top: 8%;
            width: 138px;
          }

          .fund-card {
            left: 5%;
            right: auto;
            bottom: 0;
          }
        }
      `}</style>
    </main>
  )
}
