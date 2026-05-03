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
  tanda: "/toothfairy/visual-system/tanda-guide-v1.png",
  keepsake: "/toothfairy/visual-system/nft-keepsake-v1.png",
  dashboard: "/toothfairy/visual-system/smile-dashboard-v1.png",
  saveMoment: "/toothfairy/visual-system/save-moment-v1.png",
  inviteFamily: "/toothfairy/visual-system/invite-family-v1.png",
  watchGrow: "/toothfairy/visual-system/watch-grow-v1.png",
  network: "/fairy-assets/fairy-network-sky.jpg",
  storyNetwork: "/story-assets/shared/shared-network-station.jpg",
  collectors: "/story-assets/shared/shared-multiple-collectors.jpg",
  familyConnected: "/story-assets/shared/shared-family-connected.jpg",
}

const proofItems = [
  {
    icon: "gift" as const,
    title: "Family gifting",
    body: "One link for grandparents and loved ones.",
  },
  {
    icon: "shield" as const,
    title: "Parent controlled",
    body: "You manage access, sharing, and unlock timing.",
  },
  {
    icon: "book" as const,
    title: "Story led",
    body: "Tanda and global traditions make the ritual worth revisiting.",
  },
  {
    icon: "wallet" as const,
    title: "Built on Solana",
    body: "Modern rails tucked under a friendly family flow.",
  },
]

const steps = [
  {
    icon: "camera" as const,
    image: assets.saveMoment,
    number: "1",
    title: "Save the moment",
    body: "Photo, tooth, drawing, and a few words become one keepsake.",
  },
  {
    icon: "gift" as const,
    image: assets.inviteFamily,
    number: "2",
    title: "Invite loved ones",
    body: "Share one family link so small gifts can start the Smile Fund.",
  },
  {
    icon: "growth" as const,
    image: assets.watchGrow,
    number: "3",
    title: "Watch it grow",
    body: "By age 10, the child can see how tiny gifts became a first lesson in ownership.",
  },
]

const parentReasons = [
  {
    icon: "heart" as const,
    title: "Preserve the ritual",
    body: "The tooth fairy stays magical, but the memory no longer disappears by morning.",
  },
  {
    icon: "gift" as const,
    title: "Make gifts useful",
    body: "Loved ones can mark the moment with something small and meaningful.",
  },
  {
    icon: "family" as const,
    title: "Bring the tribe in",
    body: "Aunts, uncles, grandparents, and close friends get one simple place to participate.",
  },
  {
    icon: "growth" as const,
    title: "Teach growth early",
    body: "The Smile Fund becomes a soft introduction to saving, ownership, and time.",
  },
]

const tales = [
  {
    title: "Tanda and the First Memory",
    region: "Network origin",
    image: "/story-assets/tanda/tf-05-tanda.png",
    href: "/toothfairy/story/tanda",
    body: "The first tooth Tanda turns into a memory that can grow.",
  },
  {
    title: "Ratoncito Perez",
    region: "Spain",
    image: "/story-assets/ratoncito-perez/rp-02-mouse.png",
    href: "/toothfairy/story/ratoncito-perez",
    body: "A careful mouse discovers a new way to connect families.",
  },
  {
    title: "The Viking Promise",
    region: "Northern Europe",
    image: "/story-assets/viking-origin/vo-03-tooth.png",
    href: "/toothfairy/story/viking-origin",
    body: "A tooth talisman becomes a promise carried across generations.",
  },
  {
    title: "The Tooth Shrine",
    region: "Japan",
    image: "/story-assets/japan/jp-05-shrine-gate.jpg",
    href: "/toothfairy/stories",
    body: "A quiet ritual links a lost tooth to growth and direction.",
  },
  {
    title: "The Magpie Messenger",
    region: "Korea",
    image: "/story-assets/korea/kr-03-magpie-descends.jpg",
    href: "/toothfairy/stories",
    body: "A rooftop wish becomes a message carried across the sky.",
  },
]

const faqItems = [
  {
    q: "Do I need crypto already?",
    a: "No. The public flow is designed for parents first. Wallet gifts work today for controlled tests; card gifts are the next on-ramp.",
  },
  {
    q: "Who controls the fund?",
    a: "The parent controls the account, sharing, and unlock timing. Age 10 is the suggested learning milestone.",
  },
  {
    q: "Is the keepsake public?",
    a: "Only people with the family link can find it easily. We will tighten privacy controls before broad launch.",
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
            <p className="eyebrow">Tooth Fairy Network</p>
            <h1>
              Mint a memory.
              <span>Start their Smile Fund.</span>
            </h1>
            <p className="hero-lede">
              A lost tooth becomes a keepsake, a family gift link, and a
              parent-controlled digital piggy bank your child can grow into.
            </p>
            <div className="hero-actions">
              <Link href="/toothfairy/app" className="button primary">
                Mint their first memory
                <span aria-hidden>{"->"}</span>
              </Link>
              <Link href="#how-it-works" className="button secondary">
                See how it works
              </Link>
            </div>
            <div className="hero-note">
              <span>Free to start</span>
              <span>Parent controlled</span>
              <span>Built on Solana</span>
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

            <div className="tanda-float" aria-label="Tanda, Tooth Fairy Network guide">
              <Image
                src={assets.tanda}
                alt=""
                fill
                priority
                sizes="180px"
                className="object-cover"
              />
            </div>

            <article className="memory-card">
              <div className="memory-orb">
                <Image src={assets.keepsake} alt="" fill sizes="84px" className="object-cover" />
              </div>
              <p>Tooth memory</p>
              <strong>#1024</strong>
              <span>Photo, drawing, and note saved</span>
            </article>

            <article className="smile-card">
              <div>
                <p>Little Smile Fund</p>
                <strong>12.45 SOL</strong>
                <span>23 family gifts</span>
              </div>
              <MiniChart />
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
          title="Three steps parents can explain at bedtime."
          body="The whole product should feel this simple: save the moment, invite loved ones, watch the fund grow."
        />
        <div className="steps-grid">
          {steps.map((step) => (
            <article key={step.title} className="step-card">
              <div className="step-image">
                <Image src={step.image} alt="" fill sizes="360px" className="object-contain" />
              </div>
              <div className="step-title-row">
                <span>{step.number}</span>
                <FeatureIcon name={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section product-section">
        <div className="product-copy">
          <p className="eyebrow">The actual product</p>
          <h2>A keepsake page your family can share.</h2>
          <p>
            Memory first. Smile Fund second. Blockchain quietly underneath.
            The child sees something they made. The parent sees a controlled
            account with a simple family contribution path.
          </p>
        </div>

        <div className="product-showcase">
          <article className="keepsake-demo">
            <div className="demo-art">
              <Image
                src={assets.keepsake}
                alt="Tooth keepsake preview"
                fill
                sizes="(min-width: 1024px) 420px, 92vw"
                className="object-contain"
              />
            </div>
            <div className="demo-copy">
              <p>Tanda's note</p>
              <h3>Your first owned memory.</h3>
              <span>
                A photo, drawing, date, and little story become the first
                digital object the child can point to and say: this is mine.
              </span>
            </div>
          </article>

          <article className="fund-demo">
            <div className="fund-top">
              <FeatureIcon name="wallet" />
              <div>
                <p>Smile Fund</p>
                <strong>$45 saved by family</strong>
                <span>Unlocks when they turn 10</span>
              </div>
            </div>
            <MiniChart large />
            <div className="giver-list">
              <span><b>Grandma</b><em>$20</em></span>
              <span><b>Mom and Dad</b><em>$15</em></span>
              <span><b>Uncle Ben</b><em>$10</em></span>
            </div>
            <Link href="/toothfairy/keepsake/preview" className="button gold full">
              View keepsake preview
              <span aria-hidden>{"->"}</span>
            </Link>
          </article>
        </div>
      </section>

      <section className="section parents-section">
        <SectionIntro
          eyebrow="Why parents love it"
          title="It keeps the magic and adds a first money lesson."
          body="This is not trying to make childhood financial. It is using a familiar ritual to teach ownership, patience, and growth."
        />
        <div className="reason-grid">
          {parentReasons.map((item) => (
            <article key={item.title} className="reason-card">
              <FeatureIcon name={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-band">
        <Image src={assets.network} alt="" fill sizes="100vw" className="object-cover" />
        <div className="story-shade" />
        <div className="story-content">
          <p className="eyebrow">The world behind it</p>
          <h2>Tanda is building the Tooth Fairy Network.</h2>
          <p>
            Fairies, mice, birds, sun spirits, and family rituals from around
            the world become one connected folklore network. The Smile Fund is
            the modern ritual underneath.
          </p>
          <Link href="/toothfairy/stories" className="button gold">
            Explore the stories
            <span aria-hidden>{"->"}</span>
          </Link>
        </div>
      </section>

      <section id="cultural-tales" className="section tales-section">
        <SectionIntro
          eyebrow="Cultural tales"
          title="Stories families can actually share."
          body="The story universe should make the product feel bigger without making the purchase decision complicated."
        />

        <div className="tales-grid">
          {tales.map((tale) => (
            <Link key={tale.title} href={tale.href} className="tale-card">
              <span className="tale-image">
                <Image src={tale.image} alt={tale.title} fill sizes="260px" className="object-cover" />
              </span>
              <span className="tale-copy">
                <strong>{tale.title}</strong>
                <em>{tale.region}</em>
                <span>{tale.body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="faq-strip">
        {faqItems.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="final-cta">
        <Image src={assets.storyNetwork} alt="" fill sizes="100vw" className="object-cover" />
        <div className="final-shade" />
        <div className="final-copy">
          <h2>Every tooth is a memory. Every gift is a little skin in the game.</h2>
          <Link href="/toothfairy/app" className="button gold">
            Mint their first memory
            <span aria-hidden>{"->"}</span>
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
          min-height: min(760px, calc(100vh - 72px));
          align-items: center;
          gap: clamp(2rem, 5vw, 4.5rem);
          margin: 0 auto;
          padding: clamp(3.5rem, 6vw, 5.5rem) 1.25rem 3.5rem;
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
        .product-copy h2,
        .story-content h2,
        .final-copy h2 {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-weight: 800;
          letter-spacing: 0;
        }

        .hero h1 {
          margin-top: 1.1rem;
          max-width: 650px;
          font-size: clamp(4rem, 9vw, 7.35rem);
          line-height: 0.88;
        }

        .hero h1 span {
          display: block;
          color: var(--purple);
        }

        .hero-lede {
          max-width: 39rem;
          margin-top: 1.5rem;
          color: var(--ink-soft);
          font-size: clamp(1.08rem, 2vw, 1.3rem);
          line-height: 1.7;
        }

        .hero-actions,
        .final-copy {
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

        .hero-note {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          margin-top: 1.6rem;
          color: var(--ink);
          font-size: 0.88rem;
          font-weight: 900;
        }

        .hero-note span {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .hero-note span:before {
          content: "";
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 999px;
          border: 1px solid var(--gold);
        }

        .hero-product {
          position: relative;
          min-height: 570px;
        }

        .family-frame {
          position: absolute;
          inset: 7% 3% 9% 18%;
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

        .tanda-float {
          position: absolute;
          left: 0;
          top: 17%;
          width: clamp(8.5rem, 14vw, 11.5rem);
          aspect-ratio: 0.78;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 8px;
          box-shadow: 0 24px 54px rgba(47, 35, 80, 0.18);
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
          top: 25%;
          width: min(220px, 38vw);
          min-height: 210px;
          padding: 1.35rem;
        }

        .memory-card p,
        .smile-card p,
        .fund-top p,
        .demo-copy p {
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
        .fund-top span,
        .demo-copy span {
          display: block;
          margin-top: 0.55rem;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.45;
        }

        .memory-orb {
          position: relative;
          width: 5.3rem;
          height: 5.3rem;
          overflow: hidden;
          margin-bottom: 1rem;
          border-radius: 999px;
          background: #fffaf1;
          box-shadow: inset 0 0 0 1px rgba(216, 164, 60, 0.28);
        }

        .smile-card {
          right: 6%;
          bottom: 5%;
          display: grid;
          width: min(360px, 58vw);
          grid-template-columns: 1fr 140px;
          align-items: end;
          gap: 1rem;
          padding: 1.35rem;
        }

        .proof-strip,
        .faq-strip {
          border-bottom: 1px solid var(--line);
          background: rgba(255, 252, 246, 0.5);
        }

        .proof-grid {
          display: grid;
          max-width: 1280px;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.85rem;
          margin: 0 auto;
          padding: 1.1rem 1.25rem;
        }

        .proof-card,
        .reason-card,
        .step-card,
        .keepsake-demo,
        .fund-demo,
        .tale-card,
        .faq-strip details {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 16px 38px rgba(47, 35, 80, 0.06);
        }

        .proof-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.95rem;
          align-items: center;
          padding: 1rem;
        }

        .proof-card h2,
        .reason-card h3,
        .step-card h3,
        .demo-copy h3 {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-weight: 800;
          letter-spacing: 0;
        }

        .proof-card h2 {
          font-size: 1rem;
        }

        .proof-card p,
        .reason-card p,
        .step-card p,
        .section-intro p,
        .product-copy p,
        .story-content p {
          color: var(--ink-soft);
          line-height: 1.6;
        }

        .proof-card p {
          margin-top: 0.2rem;
          font-size: 0.86rem;
        }

        .section {
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 6.5rem) 1.25rem;
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
          font-size: clamp(2rem, 4vw, 3.4rem);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.04;
        }

        .section-intro p {
          margin-top: 1rem;
          font-size: 1.08rem;
        }

        .steps-grid,
        .reason-grid,
        .tales-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.1rem;
        }

        .step-card {
          min-height: 440px;
          padding: 1.2rem;
        }

        .step-image {
          position: relative;
          height: 180px;
          margin-bottom: 0.7rem;
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(255, 252, 246, 0.66), rgba(245, 239, 226, 0.72));
          overflow: hidden;
        }

        .step-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.9rem;
        }

        .step-title-row span {
          display: inline-grid;
          width: 2.35rem;
          height: 2.35rem;
          place-items: center;
          border-radius: 999px;
          background: var(--gold);
          color: #fffaf1;
          font-weight: 900;
        }

        .step-card h3 {
          margin-top: 1rem;
          font-size: 1.55rem;
        }

        .step-card p {
          margin-top: 0.7rem;
          font-size: 1rem;
        }

        .product-section {
          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 1.5rem;
          align-items: center;
        }

        .product-copy h2,
        .story-content h2,
        .final-copy h2 {
          margin-top: 0.8rem;
          font-size: clamp(2.2rem, 4.6vw, 4rem);
          line-height: 1.03;
        }

        .product-copy p {
          margin-top: 1rem;
          font-size: 1.08rem;
        }

        .product-showcase {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 1rem;
        }

        .keepsake-demo,
        .fund-demo {
          padding: 1rem;
        }

        .demo-art {
          position: relative;
          min-height: 330px;
          border-radius: 8px;
          background:
            radial-gradient(circle at 50% 82%, rgba(216, 164, 60, 0.22), transparent 10rem),
            linear-gradient(180deg, #fffaf1, #f5efe2);
          overflow: hidden;
        }

        .demo-copy {
          padding: 1.2rem 0.25rem 0.25rem;
        }

        .demo-copy h3 {
          margin-top: 0.45rem;
          font-size: 1.55rem;
        }

        .fund-demo {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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

        .reason-grid {
          grid-template-columns: repeat(4, 1fr);
        }

        .reason-card {
          padding: 1.35rem;
        }

        .reason-card h3 {
          margin-top: 1.1rem;
          font-size: 1.3rem;
        }

        .reason-card p {
          margin-top: 0.6rem;
          font-size: 0.94rem;
        }

        .story-band,
        .final-cta {
          position: relative;
          min-height: 360px;
          overflow: hidden;
        }

        .story-shade,
        .final-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(30, 18, 72, 0.88), rgba(30, 18, 72, 0.52), rgba(30, 18, 72, 0.18)),
            radial-gradient(circle at 74% 45%, rgba(216, 164, 60, 0.20), transparent 18rem);
        }

        .story-content {
          position: relative;
          z-index: 1;
          max-width: 680px;
          padding: clamp(4rem, 7vw, 6rem) 1.25rem;
          margin-left: max(1.25rem, calc((100vw - 1280px) / 2 + 1.25rem));
        }

        .story-content h2,
        .story-content p {
          color: #fffaf1;
        }

        .story-content p {
          margin-top: 1rem;
          font-size: 1.08rem;
        }

        .tales-grid {
          grid-template-columns: repeat(5, 1fr);
        }

        .tale-card {
          overflow: hidden;
          color: inherit;
          text-decoration: none;
        }

        .tale-image {
          position: relative;
          display: block;
          height: 150px;
        }

        .tale-copy {
          display: block;
          padding: 1rem;
        }

        .tale-copy strong,
        .tale-copy em,
        .tale-copy span {
          display: block;
        }

        .tale-copy strong {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.08rem;
          font-weight: 800;
        }

        .tale-copy em {
          margin-top: 0.2rem;
          color: var(--gold-dark);
          font-size: 0.8rem;
          font-style: normal;
          font-weight: 900;
        }

        .tale-copy span {
          margin-top: 0.55rem;
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .faq-strip {
          display: grid;
          max-width: 1280px;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 0 auto;
          padding: 1.3rem 1.25rem;
        }

        .faq-strip details {
          padding: 1rem 1.1rem;
        }

        .faq-strip summary {
          cursor: pointer;
          color: var(--ink);
          font-weight: 900;
        }

        .faq-strip p {
          margin-top: 0.75rem;
          color: var(--ink-soft);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        .final-cta {
          min-height: 300px;
          border-top: 1px solid var(--line);
        }

        .final-shade {
          background:
            linear-gradient(90deg, rgba(30, 18, 72, 0.80), rgba(30, 18, 72, 0.56)),
            radial-gradient(circle at 76% 46%, rgba(216, 164, 60, 0.28), transparent 18rem);
        }

        .final-copy {
          position: relative;
          z-index: 1;
          min-height: 300px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
          align-items: center;
          justify-content: space-between;
        }

        .final-copy h2 {
          max-width: 650px;
          color: #fffaf1;
          font-size: clamp(2rem, 4vw, 3.5rem);
        }

        .mini-chart {
          display: flex;
          align-items: end;
          gap: 0.38rem;
          height: 88px;
        }

        .mini-chart.large {
          height: 148px;
          padding: 1rem;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(23, 143, 123, 0.06), rgba(255, 252, 246, 0.7));
        }

        .mini-chart i {
          display: block;
          flex: 1;
          min-width: 12px;
          border-radius: 999px 999px 0 0;
          background: linear-gradient(180deg, #5fc9aa, rgba(95, 201, 170, 0.22));
        }

        @media (min-width: 900px) {
          .hero-grid {
            grid-template-columns: minmax(0, 0.92fr) minmax(520px, 1.08fr);
          }
        }

        @media (max-width: 1060px) {
          .proof-grid,
          .reason-grid,
          .tales-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .product-section,
          .product-showcase {
            grid-template-columns: 1fr;
          }

          .hero-product {
            min-height: 520px;
          }
        }

        @media (max-width: 720px) {
          .hero-grid {
            padding-top: 2.75rem;
          }

          .hero h1 {
            font-size: clamp(3.3rem, 17vw, 4.5rem);
          }

          .hero-actions,
          .button,
          .final-copy {
            width: 100%;
          }

          .hero-product {
            min-height: 500px;
          }

          .family-frame {
            inset: 8% 0 16% 5%;
          }

          .tanda-float {
            top: 2%;
            left: 2%;
            width: 8rem;
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
          .steps-grid,
          .reason-grid,
          .tales-grid,
          .faq-strip {
            grid-template-columns: 1fr;
          }

          .step-card {
            min-height: auto;
          }

          .story-content {
            margin-left: 0;
          }
        }
      `}</style>
    </main>
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

function MiniChart({ large = false }: { large?: boolean }) {
  const heights = [26, 38, 32, 52, 72, 92]
  return (
    <div className={large ? "mini-chart large" : "mini-chart"} aria-hidden>
      {heights.map((height, index) => (
        <i key={`${height}-${index}`} style={{ height: `${large ? height + 20 : height}%` }} />
      ))}
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
