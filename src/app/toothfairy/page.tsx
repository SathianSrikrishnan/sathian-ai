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

const assets = {
  heroFamily: "/toothfairy/visual-system/hero-family-v1.png",
  tanda: "/toothfairy/visual-system/tanda-guide-v1.png",
  keepsake: "/toothfairy/visual-system/nft-keepsake-v1.png",
  dashboard: "/toothfairy/visual-system/smile-dashboard-v1.png",
  saveMoment: "/toothfairy/visual-system/save-moment-v1.png",
  inviteFamily: "/toothfairy/visual-system/invite-family-v1.png",
  watchGrow: "/toothfairy/visual-system/watch-grow-v1.png",
  network: "/fairy-assets/fairy-network-sky.jpg",
  talesBanner: "/story-assets/shared/shared-multiple-collectors.jpg",
  final: "/story-assets/shared/shared-network-station.jpg",
}

const proofItems = [
  {
    icon: "gift" as const,
    title: "Family gifting made easy",
    body: "One simple link for grandparents, aunties, uncles, and loved ones.",
  },
  {
    icon: "shield" as const,
    title: "Parent-controlled savings",
    body: "You approve access, sharing, contributions, and the unlock age.",
  },
  {
    icon: "book" as const,
    title: "Story-led ritual",
    body: "Tanda and global tooth traditions make the keepsake worth revisiting.",
  },
  {
    icon: "wallet" as const,
    title: "Built on Solana",
    body: "Modern rails sit under a friendly experience families can understand.",
  },
]

const steps = [
  {
    icon: "camera" as const,
    image: assets.saveMoment,
    number: "01",
    title: "Save the moment",
    body: "Capture the smile, the tooth, a drawing, and a little note before the memory disappears into bedtime.",
  },
  {
    icon: "gift" as const,
    image: assets.inviteFamily,
    number: "02",
    title: "Invite the family",
    body: "Share one gift page so loved ones can add a small contribution to the child's Smile Fund.",
  },
  {
    icon: "growth" as const,
    image: assets.watchGrow,
    number: "03",
    title: "Watch it grow",
    body: "By age 10, the child can see how tiny gifts became their first lesson in ownership and compounding.",
  },
]

const reasons = [
  {
    icon: "spark" as const,
    title: "Preserve the magic",
    body: "The tooth fairy stays joyful, but the moment becomes something the family can keep.",
  },
  {
    icon: "gift" as const,
    title: "Make gifting useful",
    body: "Birthdays, holidays, and tooth-fairy money can all point to one child-friendly fund.",
  },
  {
    icon: "family" as const,
    title: "Bring family in",
    body: "Loved ones get a warm reason to participate without learning crypto first.",
  },
  {
    icon: "growth" as const,
    title: "Teach value early",
    body: "Children start to understand that small things can grow when they are cared for.",
  },
]

const learningPoints = [
  {
    title: "A first asset",
    body: "The child starts with something they made: a memory, a drawing, and a story.",
  },
  {
    title: "A visible balance",
    body: "Family gifts become a number they can revisit with a parent.",
  },
  {
    title: "A milestone at 10",
    body: "The unlock moment turns into a natural conversation about saving, custody, and choice.",
  },
]

const tales = [
  {
    title: "Tanda and the First Memory",
    region: "Network origin",
    body: "The first tooth Tanda turns into a memory that can grow.",
    href: "/toothfairy/story/tanda",
    image: "/story-assets/tanda/tf-05-tanda.png",
  },
  {
    title: "Ratoncito Perez",
    region: "Spain",
    body: "A clever mouse collector discovers a new family network.",
    href: "/toothfairy/story/ratoncito-perez",
    image: "/story-assets/ratoncito-perez/rp-02-mouse.png",
  },
  {
    title: "The Viking Promise",
    region: "Northern Europe",
    body: "A tooth talisman becomes a promise carried through generations.",
    href: "/toothfairy/story/viking-origin",
    image: "/story-assets/viking-origin/vo-03-tooth.png",
  },
  {
    title: "The Tooth Shrine",
    region: "Japan",
    body: "A quiet ritual links a lost tooth to growth and direction.",
    href: "/toothfairy/stories",
    image: "/story-assets/japan/jp-05-shrine-gate.jpg",
  },
  {
    title: "The Magpie Messenger",
    region: "Korea",
    body: "A rooftop wish becomes a message carried across the sky.",
    href: "/toothfairy/stories",
    image: "/story-assets/korea/kr-03-magpie-descends.jpg",
  },
]

export default function ToothFairyLanding() {
  return (
    <main className="tfn-page">
      <section className="hero-shell">
        <NetworkConstellation />

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Tooth Fairy Network</p>
            <h1>
              Mint a memory.
              <span>Build their future.</span>
            </h1>
            <p className="hero-lede">
              Turn a lost tooth into a digital keepsake, a family gift page, and
              a parent-controlled Smile Fund your child can grow into by age 10.
            </p>

            <div className="hero-actions">
              <Link href="/toothfairy/app" className="button primary">
                Mint their first memory
                <span aria-hidden>{"->"}</span>
              </Link>
              <Link href="#how-it-works" className="button ghost">
                See how it works
              </Link>
            </div>

            <div className="hero-promises" aria-label="Product promises">
              <span>Free to start</span>
              <span>Secure and private</span>
              <span>Made for families</span>
            </div>
          </div>

          <div className="hero-product" aria-label="Tooth Fairy Network product preview">
            <div className="hero-photo">
              <Image
                src={assets.heroFamily}
                alt="A parent and child saving a tooth memory together"
                fill
                priority
                sizes="(min-width: 1024px) 540px, 92vw"
                className="object-cover"
              />
            </div>

            <div className="tanda-guide" aria-label="Tanda, the Tooth Fairy Network guide">
              <Image
                src={assets.tanda}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 180px, 34vw"
                className="object-cover"
              />
            </div>

            <div className="nft-float" aria-label="Tooth Memory NFT preview">
              <Image
                src={assets.keepsake}
                alt="Tooth Memory NFT keepsake preview"
                fill
                sizes="190px"
                className="object-cover"
              />
            </div>

            <div className="dashboard-float" aria-label="Smile Fund dashboard preview">
              <Image
                src={assets.dashboard}
                alt="Smile Fund dashboard preview"
                fill
                sizes="330px"
                className="object-cover"
              />
            </div>

            <CoinDropLoop />
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Product proof points">
        <div className="proof-grid">
          {proofItems.map((item) => (
            <article key={item.title} className="proof-card">
              <FeatureIcon name={item.icon} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section how">
        <SectionIntro
          eyebrow="How it works"
          title="Three simple steps. One tiny ritual."
          body="The product needs to be easy enough to explain at bedtime: save the moment, invite the family, watch the fund grow."
        />

        <div className="steps-grid">
          {steps.map((step) => (
            <article key={step.title} className="step-card">
              <div className="step-top">
                <span className="step-number">{step.number}</span>
                <FeatureIcon name={step.icon} />
              </div>
              <div className="step-image">
                <Image
                  src={step.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 360px, 92vw"
                  className="object-contain"
                />
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section product-demo">
        <div className="demo-copy">
          <p className="eyebrow">Tooth memory in action</p>
          <h2>The keepsake makes the savings product click.</h2>
          <p>
            The share page should feel like a memory first and a financial
            account second: a child&apos;s note, a minted keepsake, a family
            contribution button, and a dashboard parents can trust.
          </p>
        </div>

        <div className="demo-stage">
          <article className="demo-panel keepsake-panel">
            <div className="panel-copy">
              <span>NFT keepsake</span>
              <h3>One tooth becomes a record of the moment.</h3>
              <p>
                The photo, drawing, and note travel with the child&apos;s first
                digital collectible.
              </p>
            </div>
            <div className="product-shot keepsake-shot">
              <Image
                src={assets.keepsake}
                alt="Tooth Memory NFT keepsake"
                fill
                sizes="(min-width: 900px) 380px, 92vw"
                className="object-contain"
              />
            </div>
            <Link href="/toothfairy/keepsake/preview" className="text-link">
              View keepsake preview
            </Link>
          </article>

          <article className="demo-panel dashboard-panel">
            <div className="panel-copy">
              <span>Smile Fund</span>
              <h3>Family gifts become a simple growth story.</h3>
              <p>
                Contributions stay parent controlled, transparent, and pointed
                toward the age-10 learning milestone.
              </p>
            </div>
            <div className="product-shot dashboard-shot">
              <Image
                src={assets.dashboard}
                alt="Smile Fund dashboard"
                fill
                sizes="(min-width: 900px) 460px, 92vw"
                className="object-contain"
              />
            </div>
            <Link href="/toothfairy/app/dashboard" className="text-link">
              Open dashboard preview
            </Link>
          </article>
        </div>
      </section>

      <section className="section parents">
        <SectionIntro
          eyebrow="Why parents love it"
          title="It keeps the magic and adds a lesson."
          body="Parents get a joyful activity, a shareable page for the family, and a lightweight way to introduce saving without turning childhood into homework."
        />

        <div className="reason-grid">
          {reasons.map((reason) => (
            <article key={reason.title} className="reason-card">
              <FeatureIcon name={reason.icon} />
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="network-band">
        <Image
          src={assets.network}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="network-overlay" />
        <div className="network-content">
          <p className="eyebrow">The story universe</p>
          <h2>Tanda is building the Tooth Fairy Network.</h2>
          <p>
            Fairies, mice, birds, sun spirits, and family rituals around the
            world become one connected folklore network. The Smile Fund is the
            modern ritual underneath.
          </p>
          <Link href="/toothfairy/stories" className="button gold">
            Explore the tales
            <span aria-hidden>{"->"}</span>
          </Link>
        </div>
      </section>

      <section id="cultural-tales" className="section tales">
        <SectionIntro
          eyebrow="Cultural tales"
          title="Stories families can actually share."
          body="This is the content engine: bedtime stories rooted in global tooth traditions, tied back to the child's own first digital keepsake."
        />

        <div className="tales-banner">
          <Image
            src={assets.talesBanner}
            alt="Collectors from different tooth traditions flying through the Tooth Fairy Network"
            fill
            sizes="(min-width: 1024px) 1180px, 96vw"
            className="object-cover"
          />
          <div>
            <span>Network canon</span>
            <strong>Every tradition has a place in the story.</strong>
          </div>
        </div>

        <div className="tale-grid">
          {tales.map((tale) => (
            <Link key={tale.title} href={tale.href} className="tale-card">
              <span className="tale-image">
                <Image
                  src={tale.image}
                  alt={tale.title}
                  fill
                  sizes="(min-width: 900px) 20vw, 92vw"
                  className="object-cover"
                />
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

      <section className="learning-band">
        <div className="learning-inner">
          <div className="learning-copy">
            <p className="eyebrow">Age 10 milestone</p>
            <h2>Make their first lesson in value feel personal.</h2>
            <p>
              The point is not to teach a child trading. The point is to show,
              gently and repeatedly, that memories, gifts, and patience can
              compound into something real.
            </p>
          </div>
          <div className="learning-grid">
            {learningPoints.map((point) => (
              <article key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-image" aria-hidden>
          <Image
            src={assets.final}
            alt=""
            fill
            sizes="(min-width: 900px) 390px, 92vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">Start small</p>
          <h2>Every tooth is a memory. Every gift can become a lesson.</h2>
          <Link href="/toothfairy/app" className="button gold">
            Mint their first tooth memory
            <span aria-hidden>{"->"}</span>
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .tfn-page {
          --navy: #11234a;
          --ink: #23365f;
          --muted: #687186;
          --purple: #6d45a8;
          --purple-soft: #8b5cc8;
          --gold: #d8a43c;
          --gold-deep: #b77a11;
          --green: #4fb891;
          --cream: #fbf7ee;
          --cream-deep: #f3eadc;
          --paper: rgba(255, 252, 247, 0.82);
          --border: rgba(178, 151, 107, 0.30);
          overflow: hidden;
          background: var(--cream);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero-shell {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
          background:
            linear-gradient(90deg, #fffaf3 0%, rgba(255, 250, 243, 0.96) 42%, rgba(247, 231, 197, 0.72) 100%),
            #fffaf3;
        }

        .hero-shell:before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(216, 164, 60, 0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(216, 164, 60, 0.08) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(90deg, transparent 0%, black 42%, black 100%);
          opacity: 0.34;
          pointer-events: none;
        }

        .hero-grid {
          position: relative;
          z-index: 2;
          display: grid;
          width: min(100% - 40px, 1240px);
          min-height: 680px;
          align-items: center;
          gap: 42px;
          margin: 0 auto;
          padding: 50px 0 56px;
        }

        .eyebrow {
          margin: 0 0 0.72rem;
          color: var(--gold-deep);
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

        .hero-copy h1 {
          max-width: 8.7em;
          font-size: 5rem;
          font-weight: 850;
          line-height: 0.95;
        }

        .hero-copy h1 span {
          display: block;
          color: var(--purple);
        }

        .hero-lede {
          max-width: 39rem;
          margin: 1.2rem 0 0;
          color: var(--ink);
          font-size: 1.18rem;
          line-height: 1.62;
        }

        .hero-actions,
        .hero-promises,
        .final-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .hero-actions {
          margin-top: 1.65rem;
        }

        .button {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          border-radius: 999px;
          padding: 0.88rem 1.2rem;
          color: inherit;
          font-size: 0.95rem;
          font-weight: 900;
          letter-spacing: 0;
          text-decoration: none;
          white-space: nowrap;
        }

        .button.primary {
          background: linear-gradient(135deg, var(--purple), var(--purple-soft));
          color: #fffaf1;
          box-shadow: 0 16px 34px rgba(109, 69, 168, 0.23);
        }

        .button.ghost {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.62);
          color: var(--navy);
        }

        .button.gold {
          background: linear-gradient(180deg, #f4cb69, var(--gold));
          color: var(--navy);
          box-shadow: 0 16px 32px rgba(216, 164, 60, 0.28);
        }

        .hero-promises {
          margin-top: 1.4rem;
          color: var(--ink);
          font-size: 0.94rem;
          font-weight: 800;
        }

        .hero-promises span {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
        }

        .hero-promises span:before {
          content: "";
          width: 7px;
          height: 7px;
          border: 1px solid var(--gold);
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.24);
        }

        .hero-product {
          position: relative;
          min-height: 560px;
        }

        .hero-photo {
          position: absolute;
          inset: 6% 9% 0 18%;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.82);
          border-radius: 8px;
          background: #efe6d5;
          box-shadow: 0 34px 86px rgba(32, 26, 21, 0.18);
        }

        .hero-photo:after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(17, 35, 74, 0.04), transparent 44%),
            linear-gradient(180deg, transparent 68%, rgba(17, 35, 74, 0.18));
          pointer-events: none;
        }

        .tanda-guide,
        .nft-float,
        .dashboard-float,
        .proof-card,
        .step-card,
        .demo-panel,
        .reason-card,
        .tale-card,
        .learning-grid article {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.08);
          backdrop-filter: blur(14px);
        }

        .tanda-guide,
        .nft-float,
        .dashboard-float {
          position: absolute;
          overflow: hidden;
        }

        .tanda-guide {
          left: 0;
          top: 10%;
          width: 174px;
          height: 242px;
          background: #f8f0e3;
          box-shadow: 0 24px 58px rgba(109, 69, 168, 0.24);
        }

        .nft-float {
          right: 0;
          top: 16%;
          width: 166px;
          height: 236px;
          background: #141737;
          box-shadow: 0 20px 52px rgba(17, 35, 74, 0.20);
        }

        .dashboard-float {
          right: 4%;
          bottom: 0;
          width: 320px;
          height: 214px;
          background: #fffaf1;
          box-shadow: 0 22px 54px rgba(48, 38, 24, 0.12);
        }

        .coin-loop {
          position: absolute;
          left: 16%;
          bottom: 4%;
          z-index: 3;
          width: 210px;
          height: 118px;
          pointer-events: none;
        }

        .coin-loop svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          filter: drop-shadow(0 16px 24px rgba(48, 38, 24, 0.12));
        }

        .coin-loop .trail {
          fill: none;
          stroke: rgba(216, 164, 60, 0.42);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 2 8;
          animation: trail-drift 2.8s linear infinite;
        }

        .coin-loop .fairy {
          transform-origin: center;
          animation: fairy-flight 2.8s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        .coin-loop .wing {
          transform-origin: 48px 26px;
          animation: wing-flutter 520ms ease-in-out infinite alternate;
        }

        .coin-loop .coin {
          transform-origin: center;
          animation: coin-drop 2.8s cubic-bezier(0.55, 0, 0.2, 1) infinite;
        }

        .coin-loop .piggy-glow {
          animation: piggy-pulse 2.8s ease-in-out infinite;
        }

        @keyframes fairy-flight {
          0% { transform: translate(0, 10px) rotate(-7deg); opacity: 0; }
          12% { opacity: 1; }
          52% { transform: translate(80px, -15px) rotate(5deg); opacity: 1; }
          78% { transform: translate(122px, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(150px, 16px) rotate(8deg); opacity: 0; }
        }

        @keyframes wing-flutter {
          from { transform: scaleX(0.86) rotate(-8deg); }
          to { transform: scaleX(1.08) rotate(8deg); }
        }

        @keyframes coin-drop {
          0%, 42% { transform: translate(92px, 15px) scale(0.7); opacity: 0; }
          53% { transform: translate(102px, 22px) scale(1); opacity: 1; }
          80% { transform: translate(124px, 64px) scale(0.9); opacity: 1; }
          92%, 100% { transform: translate(124px, 76px) scale(0.45); opacity: 0; }
        }

        @keyframes piggy-pulse {
          0%, 62%, 100% { opacity: 0.15; transform: scale(0.92); }
          78% { opacity: 0.5; transform: scale(1.04); }
        }

        @keyframes trail-drift {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -20; }
        }

        .proof-strip {
          border-bottom: 1px solid var(--border);
          background: rgba(251, 247, 238, 0.96);
        }

        .proof-grid {
          display: grid;
          width: min(100% - 40px, 1240px);
          gap: 0.85rem;
          margin: 0 auto;
          padding: 1rem 0;
        }

        .proof-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          min-height: 104px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.70);
        }

        .proof-card h3 {
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 900;
          line-height: 1.15;
        }

        .proof-card p {
          margin: 0.26rem 0 0;
          color: var(--muted);
          font-size: 0.86rem;
          line-height: 1.36;
        }

        .section {
          width: min(100% - 40px, 1240px);
          margin: 0 auto;
          padding: 76px 0;
        }

        .how,
        .parents {
          border-bottom: 1px solid var(--border);
        }

        .section-intro {
          max-width: 770px;
          margin: 0 auto 2.25rem;
          text-align: center;
        }

        .section-intro h2,
        .demo-copy h2,
        .network-content h2,
        .learning-copy h2,
        .final-cta h2 {
          font-size: 3.1rem;
          font-weight: 820;
          line-height: 1;
        }

        .section-intro p,
        .demo-copy p,
        .network-content p,
        .learning-copy p {
          margin: 1rem 0 0;
          color: var(--ink);
          font-size: 1.06rem;
          line-height: 1.62;
        }

        .steps-grid,
        .reason-grid,
        .tale-grid {
          display: grid;
          gap: 1rem;
        }

        .step-card {
          min-height: 440px;
          padding: 1.1rem;
          background: rgba(255, 255, 255, 0.68);
        }

        .step-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .step-number {
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 999px;
          background: var(--gold);
          color: var(--navy);
          font-weight: 950;
        }

        .step-image {
          position: relative;
          height: 185px;
          overflow: hidden;
          margin-top: 1.1rem;
          border: 1px solid rgba(178, 151, 107, 0.20);
          border-radius: 8px;
          background: #fffaf1;
        }

        .step-card h3,
        .reason-card h3,
        .learning-grid h3 {
          margin-top: 1rem;
          font-size: 1.52rem;
          line-height: 1;
        }

        .step-card p,
        .reason-card p,
        .learning-grid p {
          margin: 0.72rem 0 0;
          color: var(--ink);
          line-height: 1.56;
        }

        .product-demo {
          width: 100%;
          max-width: none;
          border-bottom: 1px solid var(--border);
          background:
            linear-gradient(180deg, #fffaf3, var(--cream-deep));
        }

        .demo-copy,
        .demo-stage {
          width: min(100% - 40px, 1240px);
          margin: 0 auto;
        }

        .demo-copy {
          max-width: 760px;
          text-align: center;
        }

        .demo-stage {
          display: grid;
          gap: 1rem;
          align-items: stretch;
          margin-top: 2.2rem;
        }

        .demo-panel {
          display: grid;
          align-content: start;
          gap: 1rem;
          min-height: 560px;
          padding: 1.1rem;
          background: rgba(255, 255, 255, 0.70);
        }

        .panel-copy span {
          display: block;
          color: var(--gold-deep);
          font-size: 0.76rem;
          font-weight: 950;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .panel-copy h3 {
          margin-top: 0.45rem;
          font-size: 2rem;
          line-height: 1;
        }

        .panel-copy p {
          margin: 0.72rem 0 0;
          color: var(--ink);
          line-height: 1.55;
        }

        .product-shot {
          position: relative;
          min-height: 330px;
          overflow: hidden;
          border: 1px solid rgba(178, 151, 107, 0.20);
          border-radius: 8px;
          background: #fffaf1;
        }

        .dashboard-shot {
          min-height: 345px;
        }

        .text-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          width: fit-content;
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0 1rem;
          color: var(--purple);
          font-weight: 900;
          text-decoration: none;
        }

        .reason-card {
          min-height: 218px;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.66);
        }

        .network-band {
          position: relative;
          min-height: 450px;
          overflow: hidden;
          border-block: 1px solid rgba(255, 255, 255, 0.14);
          background: #1b173b;
        }

        .network-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(28, 16, 58, 0.96) 0%, rgba(28, 16, 58, 0.72) 45%, rgba(28, 16, 58, 0.20) 100%),
            linear-gradient(180deg, rgba(17, 35, 74, 0.08), rgba(17, 35, 74, 0.30));
        }

        .network-content {
          position: relative;
          z-index: 1;
          width: min(100% - 40px, 1240px);
          max-width: 760px;
          margin: 0 auto;
          padding: 86px 0;
          color: #fffaf1;
        }

        .network-content h2,
        .final-cta h2 {
          color: #fffaf1;
        }

        .network-content p {
          max-width: 46rem;
          color: #f1e7ff;
        }

        .network-content .eyebrow,
        .final-cta .eyebrow {
          color: #f4d98c;
        }

        .network-content .button {
          margin-top: 1.45rem;
        }

        .tales-banner {
          position: relative;
          min-height: 310px;
          overflow: hidden;
          margin-bottom: 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: #1b173b;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.08);
        }

        .tales-banner:after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 42%, rgba(17, 35, 74, 0.76));
        }

        .tales-banner > div {
          position: absolute;
          left: 1.2rem;
          right: 1.2rem;
          bottom: 1.2rem;
          z-index: 1;
          color: #fffaf1;
        }

        .tales-banner span {
          display: block;
          color: #f4d98c;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .tales-banner strong {
          display: block;
          max-width: 36rem;
          margin-top: 0.25rem;
          font-family: var(--font-display), Georgia, serif;
          font-size: 2rem;
          line-height: 1;
        }

        .tale-card {
          display: block;
          overflow: hidden;
          color: inherit;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.72);
        }

        .tale-image {
          position: relative;
          display: block;
          height: 170px;
          background: #efe6d5;
        }

        .tale-copy {
          display: block;
          padding: 1rem;
        }

        .tale-copy strong {
          display: block;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.22rem;
          line-height: 1.05;
        }

        .tale-copy em {
          display: block;
          margin-top: 0.25rem;
          color: var(--gold-deep);
          font-size: 0.82rem;
          font-style: normal;
          font-weight: 900;
        }

        .tale-copy span {
          display: block;
          margin-top: 0.72rem;
          color: var(--ink);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .learning-band {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: #fffaf3;
        }

        .learning-inner {
          display: grid;
          width: min(100% - 40px, 1240px);
          gap: 2rem;
          align-items: center;
          margin: 0 auto;
          padding: 72px 0;
        }

        .learning-copy {
          max-width: 640px;
        }

        .learning-grid {
          display: grid;
          gap: 1rem;
        }

        .learning-grid article {
          min-height: 150px;
          padding: 1.2rem;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 250, 243, 0.68));
        }

        .final-cta {
          position: relative;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 56px max(20px, calc((100vw - 1240px) / 2));
          background:
            linear-gradient(135deg, #291547, #162d5b);
        }

        .final-cta > div:last-child {
          max-width: 720px;
        }

        .final-cta h2 {
          font-size: 2.5rem;
          line-height: 1;
        }

        .final-cta .button {
          margin-top: 1.3rem;
        }

        .final-image {
          position: relative;
          width: min(360px, 32vw);
          min-height: 190px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 8px;
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.18);
        }

        @media (min-width: 760px) {
          .proof-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .steps-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .reason-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .tale-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }

          .demo-stage {
            grid-template-columns: 0.9fr 1.1fr;
          }

          .learning-inner {
            grid-template-columns: 0.9fr 1.1fr;
          }

          .learning-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 0.9fr 1.1fr;
          }

          .network-content {
            margin-left: max(20px, calc((100vw - 1240px) / 2));
          }
        }

        @media (max-width: 1100px) {
          .hero-copy h1 {
            font-size: 4.1rem;
          }

          .nft-float {
            width: 146px;
            height: 210px;
          }
        }

        @media (max-width: 1023px) {
          .hero-grid {
            min-height: auto;
          }

          .hero-product {
            min-height: 560px;
          }

          .hero-photo {
            inset: 6% 4% 3% 18%;
          }

          .section-intro h2,
          .demo-copy h2,
          .network-content h2,
          .learning-copy h2 {
            font-size: 2.55rem;
          }
        }

        @media (max-width: 680px) {
          .hero-grid,
          .section,
          .demo-stage,
          .demo-copy,
          .proof-grid,
          .network-content,
          .learning-inner {
            width: min(100% - 28px, 1240px);
          }

          .hero-grid {
            padding-top: 34px;
          }

          .hero-copy h1 {
            font-size: 3.1rem;
          }

          .hero-lede {
            font-size: 1.02rem;
          }

          .hero-product {
            min-height: 530px;
          }

          .hero-photo {
            inset: 14% 0 0 0;
          }

          .tanda-guide {
            top: 0;
            left: 0;
            width: 120px;
            height: 168px;
          }

          .nft-float {
            right: 0;
            top: 7%;
            width: 126px;
            height: 176px;
          }

          .dashboard-float {
            left: 4%;
            right: auto;
            bottom: 0;
            width: min(300px, 88vw);
            height: 196px;
          }

          .coin-loop {
            left: auto;
            right: 3%;
            bottom: 36%;
            width: 154px;
            height: 88px;
            opacity: 0.82;
          }

          .proof-grid {
            grid-template-columns: 1fr;
          }

          .section {
            padding: 54px 0;
          }

          .section-intro h2,
          .demo-copy h2,
          .network-content h2,
          .learning-copy h2,
          .final-cta h2 {
            font-size: 2.08rem;
          }

          .step-card {
            min-height: auto;
          }

          .demo-panel {
            min-height: auto;
          }

          .product-shot {
            min-height: 300px;
          }

          .tales-banner {
            min-height: 240px;
          }

          .tales-banner strong {
            font-size: 1.45rem;
          }

          .final-cta {
            padding-inline: 14px;
          }

          .final-image {
            width: 100%;
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

function NetworkConstellation() {
  return (
    <div className="constellation" aria-hidden>
      <span className="node n1" />
      <span className="node n2" />
      <span className="node n3" />
      <span className="node n4" />
      <span className="line l1" />
      <span className="line l2" />
      <span className="line l3" />
      <style jsx>{`
        .constellation {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.46;
          pointer-events: none;
        }

        .node,
        .line {
          position: absolute;
          display: block;
        }

        .node {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #d8a43c;
          box-shadow: 0 0 24px rgba(216, 164, 60, 0.55);
        }

        .n1 { left: 58%; top: 18%; }
        .n2 { left: 73%; top: 28%; }
        .n3 { left: 87%; top: 45%; }
        .n4 { left: 64%; top: 58%; }

        .line {
          height: 1px;
          transform-origin: left center;
          background: linear-gradient(90deg, transparent, rgba(216, 164, 60, 0.65), transparent);
        }

        .l1 { left: 58%; top: 19%; width: 250px; transform: rotate(25deg); }
        .l2 { left: 73%; top: 29%; width: 220px; transform: rotate(35deg); }
        .l3 { left: 64%; top: 59%; width: 290px; transform: rotate(-18deg); }

        @media (max-width: 680px) {
          .constellation { opacity: 0.24; }
        }
      `}</style>
    </div>
  )
}

function CoinDropLoop() {
  return (
    <div className="coin-loop" aria-hidden>
      <svg viewBox="0 0 210 118" role="presentation">
        <path className="trail" d="M26 58 C58 22 92 18 128 52" />
        <g className="fairy">
          <path
            className="wing"
            d="M39 31 C18 8 17 54 39 43 C56 56 62 14 39 31Z"
            fill="rgba(243, 192, 228, 0.58)"
            stroke="rgba(216, 164, 60, 0.72)"
          />
          <path
            className="wing"
            d="M53 31 C80 8 77 56 53 43 C37 57 30 15 53 31Z"
            fill="rgba(156, 219, 241, 0.50)"
            stroke="rgba(216, 164, 60, 0.72)"
          />
          <circle cx="46" cy="36" r="8" fill="#fffaf1" stroke="#d8a43c" />
          <path d="M42 46 C47 53 51 53 56 46" fill="none" stroke="#6d45a8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="47" cy="25" r="3" fill="#d8a43c" />
        </g>
        <g className="coin">
          <circle cx="0" cy="0" r="11" fill="#f4cb69" stroke="#b77a11" strokeWidth="2" />
          <path d="M-4 0h8" stroke="#11234a" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g transform="translate(120 66)">
          <ellipse className="piggy-glow" cx="36" cy="28" rx="44" ry="22" fill="#4fb891" />
          <path
            d="M14 26 C14 9 29 0 47 4 C63 6 75 17 74 34 C73 48 59 57 40 57 C22 57 12 47 14 26Z"
            fill="#fffaf1"
            stroke="#6d45a8"
            strokeWidth="2"
          />
          <path d="M70 27 L84 21 L76 36Z" fill="#fffaf1" stroke="#6d45a8" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="56" cy="25" r="3" fill="#11234a" />
          <path d="M31 2 L54 2" stroke="#d8a43c" strokeWidth="4" strokeLinecap="round" />
          <path d="M26 55 V66 M58 55 V66" stroke="#6d45a8" strokeWidth="4" strokeLinecap="round" />
          <path d="M17 36 C6 38 6 25 15 26" fill="none" stroke="#6d45a8" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}

function FeatureIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, JSX.Element> = {
    camera: (
      <>
        <path d="M7 8h2l1.1-2h3.8L15 8h2a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" />
        <path d="M12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </>
    ),
    gift: (
      <>
        <path d="M5 10h14v9H5v-9Z" />
        <path d="M12 10v9" />
        <path d="M4 7h16v3H4V7Z" />
        <path d="M12 7c-2.8 0-4.2-.7-4.2-2 0-1 .8-1.7 1.8-1.7 1.4 0 2.4 1.4 2.4 3.7Z" />
        <path d="M12 7c2.8 0 4.2-.7 4.2-2 0-1-.8-1.7-1.8-1.7-1.4 0-2.4 1.4-2.4 3.7Z" />
      </>
    ),
    growth: (
      <>
        <path d="M5 18h14" />
        <path d="M7 16v-4" />
        <path d="M12 16V8" />
        <path d="M17 16V5" />
        <path d="M8 9c2.2 0 4.5-1 6.5-3" />
        <path d="M14.5 6H17V3.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 19 6v5.8c0 4.1-2.7 7.3-7 9.2-4.3-1.9-7-5.1-7-9.2V6l7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    family: (
      <>
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M5.5 11a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
        <path d="M18.5 11a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
        <path d="M4 19c.8-2.7 3.5-4.5 8-4.5s7.2 1.8 8 4.5" />
        <path d="M2 17c.5-1.8 1.8-3 4-3.4" />
        <path d="M22 17c-.5-1.8-1.8-3-4-3.4" />
      </>
    ),
    book: (
      <>
        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 4H12v15H8.5A3.5 3.5 0 0 0 5 20.5v-15Z" />
        <path d="M19 5.5A3.5 3.5 0 0 0 15.5 4H12v15h3.5a3.5 3.5 0 0 1 3.5 1.5v-15Z" />
        <path d="M15 9h2" />
      </>
    ),
    wallet: (
      <>
        <path d="M5 7.5h13a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5A2.5 2.5 0 0 1 6.5 5H17" />
        <path d="M16 13h4" />
        <path d="M17.5 14.5a1.5 1.5 0 0 0 0-3" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m6.3 6.3 2.8 2.8" />
        <path d="m14.9 14.9 2.8 2.8" />
        <path d="m17.7 6.3-2.8 2.8" />
        <path d="m9.1 14.9-2.8 2.8" />
      </>
    ),
    tooth: (
      <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
    ),
    world: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M3.6 9h16.8" />
        <path d="M3.6 15h16.8" />
        <path d="M12 3c2.2 2.3 3.3 5.3 3.3 9S14.2 18.7 12 21c-2.2-2.3-3.3-5.3-3.3-9S9.8 5.3 12 3Z" />
      </>
    ),
    lock: (
      <>
        <path d="M7 10V8a5 5 0 0 1 10 0v2" />
        <path d="M6 10h12v10H6V10Z" />
        <path d="M12 14v2" />
      </>
    ),
  }

  return (
    <span className="feature-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none">
        {paths[name]}
      </svg>
      <style jsx>{`
        .feature-icon {
          display: inline-grid;
          width: 50px;
          height: 50px;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(216, 164, 60, 0.30);
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.10);
          color: #6d45a8;
        }

        svg {
          width: 25px;
          height: 25px;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
    </span>
  )
}
