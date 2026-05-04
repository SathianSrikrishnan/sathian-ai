"use client"

import Image from "next/image"
import Link from "next/link"

type IconName =
  | "camera"
  | "gift"
  | "growth"
  | "shield"
  | "family"
  | "book"
  | "wallet"
  | "spark"
  | "tooth"
  | "world"
  | "lock"
  | "heart"

const assets = {
  heroFamily: "/toothfairy/visual-system/hero-family-v1.png",
  keepsake: "/toothfairy/visual-system/nft-keepsake-v1.png",
  saveMoment: "/toothfairy/visual-system/save-moment-v1.png",
  watchGrow: "/toothfairy/visual-system/watch-grow-v1.png",
  network: "/fairy-assets/fairy-network-sky.jpg",
}

const proofItems = [
  {
    icon: "wallet" as const,
    title: "Parent controlled",
    body: "You decide access and timing.",
  },
  {
    icon: "gift" as const,
    title: "One family link",
    body: "Loved ones can add a small gift.",
  },
  {
    icon: "tooth" as const,
    title: "Memory first",
    body: "Photo, drawing, and note stay together.",
  },
]

const steps = [
  {
    image: assets.saveMoment,
    number: "1",
    title: "Lost a Tooth",
    body: "The child has the moment. You save it before it disappears into bedtime memory.",
  },
  {
    image: assets.keepsake,
    number: "2",
    title: "Capture & Mint",
    body: "The photo, drawing, and note become one keepsake page your family can revisit.",
  },
  {
    image: assets.watchGrow,
    number: "3",
    title: "Grow Their Future",
    body: "Loved ones can add small gifts to a parent-controlled Smile Fund.",
  },
]

const storyCards = [
  {
    title: "Tanda's First Tooth",
    place: "Origin story",
    href: "/toothfairy/story/tanda",
    image: "/story-assets/tanda/tf-05-tanda.png",
  },
  {
    title: "The Viking Tooth",
    place: "Norse tradition",
    href: "/toothfairy/story/viking-origin",
    image: "/story-assets/viking-origin/vo-01-village.png",
  },
  {
    title: "Ratoncito Perez",
    place: "Spain",
    href: "/toothfairy/story/ratoncito-perez",
    image: "/story-assets/ratoncito-perez/rp-02-mouse.png",
  },
  {
    title: "The Tooth Kami",
    place: "Japan",
    href: "/toothfairy/story/japan",
    image: "/story-assets/japan/jp-05-shrine-gate.jpg",
  },
  {
    title: "The Magpie's Song",
    place: "Korea",
    href: "/toothfairy/story/korea",
    image: "/story-assets/korea/kr-05-magpie-facing.jpg",
  },
]

export default function ToothFairyLanding() {
  return (
    <main className="tfn-v2">
      <section className="hero">
        <div className="hero-bg" aria-hidden>
          <NetworkLines />
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>
              Mint a memory.
              <span>Start their Smile Fund.</span>
            </h1>
            <p className="hero-lede">
              A lost tooth becomes a keepsake page, a family gift link, and a
              parent-controlled digital piggy bank.
            </p>
            <div className="hero-actions">
              <Link href="/toothfairy/app" className="button primary">
                Start a keepsake
                <span aria-hidden className="button-arrow" />
              </Link>
              <Link href="#how-it-works" className="button secondary">
                See how it works
              </Link>
            </div>
          </div>

          <div className="hero-product" aria-label="Product preview">
            <div className="family-frame">
              <Image
                src={assets.heroFamily}
                alt="A parent and child celebrating a lost tooth"
                fill
                priority
                sizes="(min-width: 1024px) 580px, 92vw"
                className="object-cover"
              />
            </div>

            <article className="memory-card">
              <div className="memory-preview">
                <Image src={assets.keepsake} alt="" fill sizes="180px" className="object-cover" />
              </div>
              <p>Tooth memory</p>
              <strong>#1024</strong>
              <span>Drawing and note saved</span>
            </article>

            <article className="smile-card">
              <div className="smile-copy">
                <p>Little Smile Fund</p>
                <strong>2.35 SOL</strong>
                <span>6 loved gifts</span>
              </div>
              <div className="smile-preview">
                <div className="smile-bars" aria-hidden>
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Product benefits">
        <div className="proof-grid">
          {proofItems.map((item) => (
            <article key={item.title} className="proof-card">
              <FeatureIcon name={item.icon} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section">
        <SectionIntro
          eyebrow="How it works"
          title="Lost tooth. Keepsake. Smile Fund."
          body="Simple enough for bedtime, useful enough to revisit."
        />
        <div className="steps-grid">
          {steps.map((step) => (
            <article key={step.title} className="step-card">
              <div className="step-image">
                <Image src={step.image} alt="" fill sizes="360px" className="object-contain" />
                <span className="step-number">{step.number}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="smile-fund" className="section smile-section">
        <div className="smile-intro">
          <p className="eyebrow">Smile Fund</p>
          <h2>Small gifts from their tribe can add up.</h2>
          <p>
            Parents, grandparents, aunts, uncles, and close friends can mark the
            moment. The parent keeps control until the child is ready.
          </p>
        </div>

        <article className="smile-dashboard">
          <div className="dashboard-visual">
            <MiniFundDashboard />
          </div>
          <div className="dashboard-panel">
            <div className="fund-top">
              <FeatureIcon name="wallet" />
              <div>
                <p>Little Smile Fund</p>
                <strong>2.35 SOL</strong>
                <span>$360.00 USD</span>
              </div>
            </div>
            <div className="dashboard-stats">
              <span><b>6</b><em>loved gifts</em></span>
              <span><b>age 10</b><em>unlock default</em></span>
              <span><b>parent</b><em>controls access</em></span>
            </div>
            <div className="giver-list">
              <span><b>Grandma</b><em>$25 / 0.16 SOL</em></span>
              <span><b>Mom and Dad</b><em>$50 / 0.33 SOL</em></span>
              <span><b>Uncle Ben</b><em>$15 / 0.10 SOL</em></span>
            </div>
            <div className="dashboard-note">
              <FeatureIcon name="shield" />
              <span>Parent-controlled until the family is ready.</span>
            </div>
          </div>
        </article>
      </section>

      <section className="story-band">
        <Image src={assets.network} alt="" fill sizes="100vw" className="object-cover" />
        <div className="story-shade" />
        <div className="story-content">
          <div className="story-copy">
            <p className="eyebrow">Story world</p>
            <h2>The world behind every tooth.</h2>
            <p>
              Tanda connects tooth fairies, mice, birds, and family rituals into
              short stories children can read after the keepsake is made.
            </p>
          </div>
          <div className="story-cards-grid" aria-label="Featured tooth traditions">
            {storyCards.map((story) => (
              <Link key={story.href} href={story.href} className="story-card">
                <span className="story-image">
                  <Image src={story.image} alt="" fill sizes="220px" className="object-cover" />
                </span>
                <span className="story-title">{story.title}</span>
                <span className="story-place">{story.place}</span>
              </Link>
            ))}
          </div>
          <Link href="/toothfairy/stories" className="button gold story-button">
            Explore all stories
            <span aria-hidden className="button-arrow" />
          </Link>
        </div>
      </section>

      <style jsx>{`
        .tfn-v2 {
          --cream: #fbf7ee;
          --cream-deep: #f5efe2;
          --paper: rgba(255, 252, 246, 0.78);
          --ink: #11234a;
          --ink-soft: #334260;
          --muted: #687188;
          --purple: #6d45a8;
          --gold: #d8a43c;
          --gold-dark: #b6871f;
          --line: #e3d9c4;
          background:
            radial-gradient(circle at 88% 4%, rgba(216, 164, 60, 0.18), transparent 22rem),
            radial-gradient(circle at 8% 0%, rgba(109, 69, 168, 0.10), transparent 18rem),
            linear-gradient(180deg, var(--cream), var(--cream-deep));
          color: var(--ink);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          opacity: 0.62;
          pointer-events: none;
        }

        .hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          max-width: 1280px;
          min-height: min(700px, calc(100vh - 72px));
          align-items: center;
          gap: 4rem;
          margin: 0 auto;
          padding: 4.4rem 1.25rem 3.2rem;
        }

        .hero-copy {
          max-width: 630px;
        }

        .eyebrow {
          color: var(--gold-dark);
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .hero h1,
        .smile-intro h2,
        .story-content h2 {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-weight: 800;
          letter-spacing: 0;
        }

        .hero h1 {
          margin-top: 0;
          max-width: 650px;
          font-size: 5.25rem;
          line-height: 0.94;
        }

        .hero h1 span {
          display: block;
          color: var(--purple);
        }

        .hero-lede {
          max-width: 39rem;
          margin-top: 1.5rem;
          color: var(--ink-soft);
          font-size: 1.22rem;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
        }

        .hero-actions {
          margin-top: 2.1rem;
        }

        .button {
          display: inline-flex;
          min-height: 3.25rem;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          border-radius: 999px;
          padding: 0 1.35rem;
          font-weight: 900;
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }

        .button:hover {
          transform: translateY(-1px);
        }

        .button-arrow {
          display: inline-block;
          width: 0.55rem;
          height: 0.55rem;
          border-top: 2px solid currentColor;
          border-right: 2px solid currentColor;
          transform: rotate(45deg);
        }

        .button.primary {
          background: linear-gradient(135deg, var(--purple), #8a5cc5);
          color: #fffaf1;
          box-shadow: 0 18px 42px rgba(109, 69, 168, 0.26);
        }

        .button.secondary {
          border: 1px solid var(--line);
          background: rgba(255, 252, 246, 0.64);
          color: var(--ink);
        }

        .button.gold {
          background: linear-gradient(135deg, #efc56d, var(--gold));
          color: #2f2350;
          box-shadow: 0 16px 34px rgba(216, 164, 60, 0.28);
        }

        .button.full {
          width: 100%;
        }

        .hero-product {
          position: relative;
          min-height: 570px;
        }

        .family-frame {
          position: absolute;
          inset: 7% 1% 10% 9%;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.74);
          border-radius: 8px;
          box-shadow: 0 30px 70px rgba(47, 35, 80, 0.16);
        }

        .family-frame:after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 15% 10%, rgba(255, 252, 246, 0.85), transparent 16rem),
            linear-gradient(90deg, rgba(251, 247, 238, 0.80), transparent 45%);
        }

        .memory-card,
        .smile-card {
          position: absolute;
          background: rgba(255, 252, 246, 0.82);
          border: 1px solid rgba(227, 217, 196, 0.84);
          border-radius: 8px;
          box-shadow: 0 24px 54px rgba(47, 35, 80, 0.16);
          backdrop-filter: blur(14px);
        }

        .memory-card {
          right: 0;
          top: 24%;
          width: min(230px, 40vw);
          min-height: 238px;
          padding: 0.85rem;
        }

        .memory-card p,
        .smile-card p,
        .fund-top p {
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .memory-card strong,
        .smile-card strong,
        .fund-top strong {
          display: block;
          margin-top: 0.5rem;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.35rem;
          line-height: 1;
        }

        .memory-card span,
        .smile-card span,
        .fund-top span {
          display: block;
          margin-top: 0.55rem;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.45;
        }

        .memory-preview {
          position: relative;
          width: 100%;
          aspect-ratio: 1.1;
          overflow: hidden;
          margin-bottom: 0.9rem;
          border-radius: 8px;
          background: #fffaf1;
          box-shadow: inset 0 0 0 1px rgba(216, 164, 60, 0.28);
        }

        .smile-card {
          right: 3%;
          bottom: 5%;
          display: grid;
          width: min(430px, 62vw);
          grid-template-columns: minmax(0, 0.78fr) minmax(120px, 0.92fr);
          align-items: center;
          gap: 0.8rem;
          padding: 0.9rem;
        }

        .smile-preview {
          position: relative;
          min-height: 126px;
          overflow: hidden;
          border: 1px solid rgba(227, 217, 196, 0.76);
          border-radius: 8px;
          background: #fffaf1;
        }

        .smile-bars {
          position: absolute;
          inset: 1rem 0.85rem 0.85rem;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.45rem;
          align-items: end;
        }

        .smile-bars span {
          display: block;
          border-radius: 999px 999px 2px 2px;
          background: linear-gradient(180deg, #55c8a8, rgba(85, 200, 168, 0.24));
        }

        .smile-bars span:nth-child(1) {
          height: 28%;
        }

        .smile-bars span:nth-child(2) {
          height: 38%;
        }

        .smile-bars span:nth-child(3) {
          height: 48%;
        }

        .smile-bars span:nth-child(4) {
          height: 64%;
        }

        .smile-bars span:nth-child(5) {
          height: 78%;
        }

        .proof-strip {
          border-bottom: 1px solid var(--line);
          background: rgba(255, 252, 246, 0.44);
        }

        .proof-grid {
          display: grid;
          max-width: 880px;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.55rem;
          margin: 0 auto;
          padding: 0.7rem 1.25rem;
        }

        .proof-card,
        .step-card,
        .smile-dashboard,
        .dashboard-panel {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 16px 38px rgba(47, 35, 80, 0.06);
        }

        .proof-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.65rem;
          align-items: center;
          padding: 0.74rem 0.82rem;
          box-shadow: none;
        }

        .proof-card h2,
        .step-card h3 {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-weight: 800;
          letter-spacing: 0;
        }

        .proof-card h2 {
          font-size: 0.94rem;
        }

        .proof-card p,
        .step-card p,
        .section-intro p,
        .smile-intro p,
        .story-content p {
          color: var(--ink-soft);
          line-height: 1.6;
        }

        .proof-card p {
          margin-top: 0.1rem;
          font-size: 0.78rem;
        }

        .section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4.6rem 1.25rem;
        }

        .section-intro {
          max-width: 760px;
          margin: 0 auto 2.2rem;
          text-align: center;
        }

        .section-intro h2 {
          margin-top: 0.7rem;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 3.1rem;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.04;
        }

        .section-intro p {
          margin-top: 1rem;
          font-size: 1.08rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.95rem;
        }

        .step-card {
          position: relative;
          min-height: 430px;
          overflow: visible;
          padding: 1rem 1rem 1.25rem;
          text-align: center;
        }

        .step-card:not(:last-child):after {
          content: "";
          position: absolute;
          top: 38%;
          right: -1.15rem;
          z-index: 2;
          width: 2rem;
          height: 2rem;
          border-top: 2px dashed rgba(109, 69, 168, 0.34);
          border-right: 2px dashed rgba(109, 69, 168, 0.34);
          transform: rotate(45deg);
        }

        .step-image {
          position: relative;
          height: 255px;
          margin-bottom: 1.25rem;
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(255, 252, 246, 0.66), rgba(245, 239, 226, 0.72));
          overflow: hidden;
        }

        .step-number {
          position: absolute;
          left: 50%;
          bottom: 0.8rem;
          display: inline-grid;
          width: 3.35rem;
          height: 3.35rem;
          place-items: center;
          border-radius: 999px;
          background: var(--gold);
          color: #fffaf1;
          border: 4px solid #fffaf1;
          font-weight: 900;
          font-size: 1.28rem;
          transform: translateX(-50%);
          box-shadow: 0 12px 30px rgba(47, 35, 80, 0.14);
        }

        .step-card h3 {
          margin-top: 0;
          font-size: 1.72rem;
        }

        .step-card p {
          max-width: 21rem;
          margin: 0.62rem auto 0;
          font-size: 0.98rem;
        }

        .smile-section {
          display: grid;
          grid-template-columns: minmax(300px, 0.68fr) minmax(0, 1.32fr);
          gap: 1.4rem;
          align-items: center;
        }

        .smile-intro h2,
        .story-content h2 {
          margin-top: 0.8rem;
          font-size: 3.55rem;
          line-height: 1.03;
        }

        .smile-intro p {
          margin-top: 1rem;
          font-size: 1.08rem;
        }

        .smile-dashboard {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.82fr);
          gap: 1.05rem;
          padding: 1rem;
        }

        .dashboard-visual {
          position: relative;
          min-height: 390px;
          padding: 1.15rem;
          border-radius: 8px;
          background:
            radial-gradient(circle at 50% 75%, rgba(23, 143, 123, 0.12), transparent 12rem),
            linear-gradient(180deg, #fffaf1, #f5efe2);
          overflow: hidden;
        }

        .dashboard-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          box-shadow: none;
        }

        .fund-top {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 252, 246, 0.62);
        }

        .giver-list {
          display: grid;
          gap: 0.55rem;
        }

        .giver-list span {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--line);
          padding: 0.45rem 0;
          color: var(--ink-soft);
        }

        .giver-list b {
          font-weight: 800;
        }

        .giver-list em {
          color: var(--purple);
          font-style: normal;
          font-weight: 900;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.55rem;
        }

        .dashboard-stats span {
          display: block;
          min-height: 5.4rem;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 0.9rem;
          background: rgba(255, 252, 246, 0.62);
        }

        .dashboard-stats b,
        .dashboard-stats em {
          display: block;
        }

        .dashboard-stats b {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.2rem;
          line-height: 1.05;
        }

        .dashboard-stats em {
          margin-top: 0.32rem;
          color: var(--muted);
          font-size: 0.76rem;
          font-style: normal;
          line-height: 1.25;
        }

        .dashboard-note {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.75rem;
          align-items: center;
          border: 1px solid rgba(109, 69, 168, 0.18);
          border-radius: 8px;
          padding: 0.85rem;
          background: rgba(109, 69, 168, 0.08);
          color: var(--ink-soft);
          font-size: 0.9rem;
          font-weight: 800;
        }

        .story-band {
          position: relative;
          min-height: 520px;
          overflow: hidden;
        }

        .story-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(30, 18, 72, 0.92), rgba(30, 18, 72, 0.62), rgba(30, 18, 72, 0.24)),
            radial-gradient(circle at 74% 45%, rgba(216, 164, 60, 0.20), transparent 18rem);
        }

        .story-content {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          padding: 5rem 1.25rem;
          margin: 0 auto;
        }

        .story-content h2,
        .story-content p {
          color: #fffaf1;
        }

        .story-copy {
          max-width: 650px;
        }

        .story-content p {
          margin-top: 1rem;
          font-size: 1.08rem;
        }

        .story-cards-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.8rem;
          margin-top: 2rem;
        }

        .story-card {
          display: block;
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 250, 241, 0.20);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.88);
          color: var(--ink);
          text-decoration: none;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.20);
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .story-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 54px rgba(0, 0, 0, 0.26);
        }

        .story-image {
          position: relative;
          display: block;
          aspect-ratio: 1.45;
          background: #2f2350;
        }

        .story-title,
        .story-place {
          display: block;
          padding: 0 0.85rem;
        }

        .story-title {
          padding-top: 0.78rem;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1rem;
          font-weight: 900;
          line-height: 1.15;
        }

        .story-place {
          padding-top: 0.25rem;
          padding-bottom: 0.85rem;
          color: var(--muted);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .story-button {
          margin-top: 1.45rem;
        }

        @media (min-width: 900px) {
          .hero-grid {
            grid-template-columns: minmax(0, 0.92fr) minmax(520px, 1.08fr);
          }
        }

        @media (max-width: 1060px) {
          .proof-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .smile-section,
          .smile-dashboard {
            grid-template-columns: 1fr;
          }

          .hero-product {
            min-height: 520px;
          }

          .hero h1 {
            font-size: 4.6rem;
          }

          .section-intro h2,
          .smile-intro h2,
          .story-content h2 {
            font-size: 2.8rem;
          }

          .story-cards-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .hero-grid {
            padding-top: 2.75rem;
            gap: 2.25rem;
          }

          .hero h1 {
            font-size: 3.45rem;
          }

          .hero-lede {
            font-size: 1.08rem;
          }

          .section {
            padding: 4rem 1.25rem;
          }

          .section-intro h2,
          .smile-intro h2,
          .story-content h2 {
            font-size: 2.35rem;
          }

          .hero-actions,
          .button {
            width: 100%;
          }

          .hero-product {
            min-height: 500px;
          }

          .family-frame {
            inset: 8% 0 16% 3%;
          }

          .memory-card {
            top: 40%;
            width: 10.6rem;
            padding: 1rem;
          }

          .smile-card {
            right: 0;
            bottom: 4%;
            width: 92%;
            grid-template-columns: 1fr 120px;
          }

          .proof-grid,
          .steps-grid {
            grid-template-columns: 1fr;
          }

          .step-card:not(:last-child):after {
            display: none;
          }

          .step-card {
            min-height: auto;
          }

          .story-content {
            padding: 4rem 1.25rem;
          }

          .story-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  )
}

function MiniFundDashboard() {
  return (
    <div className="mini-fund">
      <div className="mini-head">
        <span className="mini-avatar" aria-hidden />
        <div>
          <h3>Little Explorer</h3>
          <p>Smile Fund</p>
        </div>
        <strong>Age 10</strong>
      </div>

      <div className="mini-balance">
        <span>Total saved</span>
        <b>2.35 SOL</b>
        <em>$360.00 USD</em>
      </div>

      <svg viewBox="0 0 420 160" className="mini-chart" aria-hidden>
        <defs>
          <linearGradient id="miniChartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#55C8A8" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#55C8A8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M22 126 C 62 112, 92 118, 126 96 S 186 94, 222 75 S 292 55, 334 43 S 382 28, 398 18 V146 H22Z" fill="url(#miniChartFill)" />
        <path d="M22 126 C 62 112, 92 118, 126 96 S 186 94, 222 75 S 292 55, 334 43 S 382 28, 398 18" fill="none" stroke="#55C8A8" strokeWidth="5" strokeLinecap="round" />
        {[22, 126, 222, 334, 398].map((x, index) => (
          <circle key={x} cx={x} cy={[126, 96, 75, 43, 18][index]} r="6" fill="#55C8A8" />
        ))}
      </svg>

      <div className="mini-tiles">
        <span><b>$25</b><em>Grandma</em></span>
        <span><b>$50</b><em>Mom and Dad</em></span>
        <span><b>$15</b><em>Uncle Ben</em></span>
      </div>

      <style jsx>{`
        .mini-fund {
          height: 100%;
          border: 1px solid rgba(227, 217, 196, 0.86);
          border-radius: 8px;
          background: rgba(255, 252, 246, 0.86);
          padding: 1rem;
          box-shadow: 0 20px 50px rgba(47, 35, 80, 0.10);
        }

        .mini-head {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 0.8rem;
          align-items: center;
        }

        .mini-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 999px;
          background:
            radial-gradient(circle at 42% 32%, #fff5df 0 14%, transparent 15%),
            linear-gradient(135deg, #d8a43c, #6d45a8);
        }

        .mini-head h3 {
          margin: 0;
          color: #11234a;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.2rem;
          font-weight: 900;
          line-height: 1;
        }

        .mini-head p,
        .mini-balance span,
        .mini-balance em,
        .mini-tiles em {
          color: #687188;
          font-size: 0.78rem;
          font-style: normal;
          font-weight: 800;
        }

        .mini-head strong {
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.16);
          color: #6d45a8;
          padding: 0.45rem 0.68rem;
          font-size: 0.76rem;
          white-space: nowrap;
        }

        .mini-balance {
          margin-top: 1.25rem;
        }

        .mini-balance b {
          display: block;
          margin-top: 0.2rem;
          color: #11234a;
          font-family: var(--font-display), Georgia, serif;
          font-size: 2.15rem;
          line-height: 1;
        }

        .mini-balance em {
          display: block;
          margin-top: 0.4rem;
        }

        .mini-chart {
          display: block;
          width: 100%;
          height: auto;
          margin-top: 0.65rem;
        }

        .mini-tiles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.55rem;
          margin-top: 0.65rem;
        }

        .mini-tiles span {
          border: 1px solid #e3d9c4;
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.72);
          padding: 0.72rem;
        }

        .mini-tiles b,
        .mini-tiles em {
          display: block;
        }

        .mini-tiles b {
          color: #11234a;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.05rem;
        }
      `}</style>
    </div>
  )
}

function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  )
}

function NetworkLines() {
  return (
    <svg viewBox="0 0 1200 720" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D8A43C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#D8A43C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M86 552 C 260 420, 364 492, 520 352 S 826 216, 1120 326" fill="none" stroke="#D8A43C" strokeOpacity="0.18" strokeWidth="2" />
      <path d="M720 108 C 776 236, 890 266, 1016 210" fill="none" stroke="#6D45A8" strokeOpacity="0.16" strokeWidth="2" />
      {[120, 260, 390, 520, 672, 835, 990, 1110].map((x, index) => (
        <circle key={x} cx={x} cy={index % 2 ? 420 : 320} r="28" fill="url(#nodeGlow)" />
      ))}
    </svg>
  )
}

function FeatureIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    camera: (
      <>
        <path d="M7 8h2l1-2h4l1 2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    gift: (
      <>
        <path d="M4 10h16v10H4z" />
        <path d="M12 10v10M4 14h16M8 10c-2-1.3-1.7-4 1-4 1.7 0 3 4 3 4s1.3-4 3-4c2.7 0 3 2.7 1 4" />
      </>
    ),
    growth: (
      <>
        <path d="M5 19V5M5 19h15" />
        <path d="M8 16l3-4 3 2 5-7" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.4 2.8 8.2 7 10 4.2-1.8 7-5.6 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    family: (
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <path d="M3 20c.6-3.5 2.3-5 5-5s4.4 1.5 5 5" />
        <path d="M11 20c.6-3.5 2.3-5 5-5s4.4 1.5 5 5" />
      </>
    ),
    book: (
      <>
        <path d="M5 5h6a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H5z" />
        <path d="M19 5h-5a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h5z" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7h14a2 2 0 0 1 2 2v9H4z" />
        <path d="M4 7c0-1.1.9-2 2-2h11" />
        <path d="M15 13h5" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />
        <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
      </>
    ),
    tooth: (
      <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
    ),
    world: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      </>
    ),
    heart: (
      <path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 0 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1Z" />
    ),
  }

  return (
    <span className="feature-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </svg>
      <style jsx>{`
        .feature-icon {
          display: inline-grid;
          width: 3rem;
          height: 3rem;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(216, 164, 60, 0.24);
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.10);
          color: #6d45a8;
        }

        .feature-icon svg {
          width: 1.45rem;
          height: 1.45rem;
        }
      `}</style>
    </span>
  )
}
