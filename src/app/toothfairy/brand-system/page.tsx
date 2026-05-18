import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Toothlight Brand System | Tooth Fairy Network",
  description:
    "A working brand board for Toothlight, the Smile Fund, and the Tooth Fairy Network keeper world.",
}

const parentRoutes = ["Homepage", "Preview", "Smile Fund", "FAQ", "Draw flow"]
const storyRoutes = ["Tanda", "Keepers", "Story map", "Cultural doors", "Animation"]

const palette = [
  { name: "Pearl", value: "#fffaf1", role: "parent surfaces" },
  { name: "Ink", value: "#11234a", role: "primary text" },
  { name: "Toothlight gold", value: "#f0c456", role: "memory glow" },
  { name: "Network teal", value: "#4fd1c5", role: "connection accent" },
  { name: "Keeper night", value: "#07101f", role: "storybook world" },
]

function ToothlightMark({ mode = "light" }: { mode?: "light" | "dark" }) {
  return (
    <span className={`mark ${mode}`} aria-hidden="true">
      <Image
        src="/toothfairy/brand/toothfairy-glow-tooth-256.png"
        alt=""
        width={92}
        height={92}
        priority
      />
      <span className="orbit one" />
      <span className="orbit two" />
      <span className="node n1" />
      <span className="node n2" />
      <span className="node n3" />
    </span>
  )
}

function Wordmark({ context }: { context: "parent" | "network" }) {
  return (
    <div className={`wordmark ${context}`}>
      <ToothlightMark mode={context === "network" ? "dark" : "light"} />
      <div>
        <strong>Toothlight</strong>
        <span>by Tooth Fairy Network</span>
      </div>
    </div>
  )
}

export default function ToothlightBrandSystemPage() {
  return (
    <main className="brand-system">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Brand system pass</p>
          <h1>One lost tooth becomes one Toothlight.</h1>
          <p>
            Toothlight becomes the parent-facing product. Tooth Fairy Network becomes the world of
            collectors and keepers who preserve Toothlights across cultures, stories, and learning.
          </p>
          <div className="actions">
            <Link href="/toothfairy">Current homepage</Link>
            <Link href="/toothfairy/stories">Story world</Link>
          </div>
        </div>

        <div className="hero-card" aria-label="Recommended logo direction">
          <Wordmark context="parent" />
          <div className="light-object">
            <Image
              src="/toothfairy/brand/toothfairy-glow-mark-512.png"
              alt="Glowing Toothlight mark"
              width={240}
              height={240}
              priority
            />
          </div>
          <p>
            Recommended mark: a glowing tooth capsule with gold connection arcs. It must work as an
            app icon, story object, favicon, and parent-facing trust mark.
          </p>
        </div>
      </section>

      <section className="structure" aria-label="Brand hierarchy">
        <article className="wide-card">
          <p className="eyebrow">Naming hierarchy</p>
          <h2>Toothlight sells the product. Tooth Fairy Network explains the world.</h2>
          <div className="stack">
            <div>
              <span>01</span>
              <strong>Toothlight</strong>
              <p>AI-enhanced tooth memory and private family time capsule.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Smile Fund</strong>
              <p>Parent-controlled family gifts attached to the memory.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Keepers</strong>
              <p>Story characters who collect, preserve, and explain Toothlights.</p>
            </div>
            <div>
              <span>04</span>
              <strong>Tooth Fairy Network</strong>
              <p>The cultural story world and education umbrella.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="worlds" aria-label="Two connected visual worlds">
        <article className="world parent-world">
          <Wordmark context="parent" />
          <p className="eyebrow">Parent product world</p>
          <h2>Warm, light, calm, fundable.</h2>
          <p>
            This is where parents understand the product quickly: save the tooth moment, enhance the
            story, share the link, and keep control of the Smile Fund.
          </p>
          <div className="route-list">
            {parentRoutes.map((route) => (
              <span key={route}>{route}</span>
            ))}
          </div>
          <div className="sample-product">
            <div>
              <span>Toothlight</span>
              <strong>#FDSR</strong>
              <p>Photo, drawing, and story saved.</p>
            </div>
            <div>
              <span>Little Smile Fund</span>
              <strong>$360</strong>
              <p>6 family gifts saved.</p>
            </div>
          </div>
        </article>

        <article className="world network-world">
          <Wordmark context="network" />
          <p className="eyebrow">Storybook network world</p>
          <h2>Night, gold, cinematic, keeper-led.</h2>
          <p>
            This is where Tanda and the Keepers live. They collect Toothlights, preserve cultural
            traditions, and turn the product into a story world.
          </p>
          <div className="route-list">
            {storyRoutes.map((route) => (
              <span key={route}>{route}</span>
            ))}
          </div>
          <div className="network-image">
            <Image
              src="/story-assets/network/story-world-gateway-v1.png"
              alt="Tanda and the Keepers' glowing Toothlight network"
              fill
              sizes="(min-width: 900px) 42vw, 92vw"
            />
          </div>
        </article>
      </section>

      <section className="bridge" aria-label="Shared brand bridge">
        <div>
          <p className="eyebrow">Shared rules</p>
          <h2>The background changes. The Toothlight stays constant.</h2>
        </div>
        <div className="rules">
          <article>
            <strong>No gradient wordmark</strong>
            <p>The wordmark should be solid ink or pearl. Gold/teal live in the mark, not every letter.</p>
          </article>
          <article>
            <strong>One product name first</strong>
            <p>Lead with Toothlight. Use Tooth Fairy Network as the keeper-world endorsement.</p>
          </article>
          <article>
            <strong>Same CTA shape</strong>
            <p>Create a Toothlight remains the main action in both light and dark modes.</p>
          </article>
          <article>
            <strong>Story supports product</strong>
            <p>Keepers collect Toothlights. They do not compete with the parent product.</p>
          </article>
        </div>
      </section>

      <section className="logo-options" aria-label="Logo exploration">
        <article>
          <ToothlightMark />
          <h3>Product mark</h3>
          <p>Best for app icon, header, and parent pages.</p>
        </article>
        <article>
          <div className="seal">
            <ToothlightMark mode="dark" />
          </div>
          <h3>Keeper seal</h3>
          <p>Best for storybook doors, badges, and cultural collection pages.</p>
        </article>
        <article>
          <div className="mini-network" aria-hidden="true">
            <ToothlightMark />
            <span />
            <span />
            <span />
          </div>
          <h3>Network lockup</h3>
          <p>Best for explaining family links and global keeper routes.</p>
        </article>
      </section>

      <section className="palette" aria-label="Color palette">
        <div>
          <p className="eyebrow">Core palette</p>
          <h2>Few colors, used with discipline.</h2>
        </div>
        <div className="swatches">
          {palette.map((color) => (
            <article key={color.name}>
              <span style={{ background: color.value }} />
              <strong>{color.name}</strong>
              <p>{color.role}</p>
              <code>{color.value}</code>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .tfn-header,
        .tfn-footer {
          display: none !important;
        }

        .brand-system {
          --pearl: #fffaf1;
          --paper: #f4eadb;
          --ink: #11234a;
          --ink-soft: #374866;
          --gold: #f0c456;
          --gold-deep: #c98f28;
          --teal: #4fd1c5;
          --night: #07101f;
          --night-deep: #020712;
          --line: rgba(17, 35, 74, 0.13);
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 4%, rgba(240, 196, 86, 0.2), transparent 24rem),
            linear-gradient(180deg, #fffaf1 0%, #f4eadb 42%, #08111f 42%, #030712 100%);
          color: var(--ink);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .brand-system * {
          box-sizing: border-box;
        }

        .hero,
        .structure,
        .worlds,
        .bridge,
        .logo-options,
        .palette {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.75fr);
          gap: clamp(1.4rem, 4vw, 4rem);
          align-items: center;
          padding: clamp(5rem, 10vw, 8rem) 0 4rem;
        }

        .eyebrow {
          margin: 0 0 0.85rem;
          color: var(--gold-deep);
          font-size: 0.78rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3 {
          margin: 0;
          font-family: var(--font-display), Georgia, serif;
          letter-spacing: 0;
        }

        h1 {
          max-width: 760px;
          color: var(--ink);
          font-size: clamp(4rem, 8.5vw, 8.4rem);
          line-height: 0.88;
        }

        h2 {
          color: var(--ink);
          font-size: clamp(2rem, 4vw, 4.2rem);
          line-height: 0.98;
        }

        h3 {
          color: var(--ink);
          font-size: 1.6rem;
          line-height: 1;
        }

        p {
          color: var(--ink-soft);
          font-size: 1rem;
          line-height: 1.7;
        }

        .hero-copy > p:not(.eyebrow) {
          max-width: 650px;
          font-size: clamp(1.08rem, 1.8vw, 1.32rem);
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.7rem;
        }

        .actions a {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 1.1rem;
          background: var(--ink);
          color: var(--pearl);
          font-weight: 900;
          text-decoration: none;
        }

        .actions a + a {
          border: 1px solid var(--line);
          background: rgba(255, 250, 241, 0.56);
          color: var(--ink);
        }

        .hero-card,
        .wide-card,
        .world,
        .bridge,
        .logo-options article,
        .palette {
          border: 1px solid rgba(17, 35, 74, 0.12);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.72);
          box-shadow: 0 28px 70px rgba(17, 35, 74, 0.09);
        }

        .hero-card {
          padding: clamp(1.1rem, 3vw, 1.6rem);
        }

        .light-object {
          display: grid;
          place-items: center;
          min-height: 280px;
          margin: 1rem 0;
          border-radius: 8px;
          background:
            radial-gradient(circle, rgba(240, 196, 86, 0.3), transparent 44%),
            linear-gradient(135deg, rgba(255, 250, 241, 0.86), rgba(255, 255, 255, 0.44));
          overflow: hidden;
        }

        .light-object img {
          filter: drop-shadow(0 22px 40px rgba(201, 143, 40, 0.2));
        }

        .wordmark {
          display: inline-grid;
          grid-template-columns: 64px minmax(0, 1fr);
          align-items: center;
          gap: 0.8rem;
        }

        .wordmark strong {
          display: block;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.85rem, 3.5vw, 3.1rem);
          font-weight: 950;
          line-height: 0.9;
        }

        .wordmark span {
          display: block;
          margin-top: 0.25rem;
          color: var(--ink-soft);
          font-size: 0.76rem;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .wordmark.network strong {
          color: var(--pearl);
        }

        .wordmark.network span {
          color: rgba(255, 250, 241, 0.66);
        }

        .mark {
          position: relative;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background:
            radial-gradient(circle, rgba(255, 250, 241, 0.95), rgba(240, 196, 86, 0.26) 52%, rgba(17, 35, 74, 0.08));
          box-shadow: 0 0 0 1px rgba(240, 196, 86, 0.36), 0 0 36px rgba(240, 196, 86, 0.3);
        }

        .mark.dark {
          background:
            radial-gradient(circle, rgba(255, 250, 241, 0.92), rgba(240, 196, 86, 0.24) 52%, rgba(255, 250, 241, 0.08));
        }

        .mark img {
          z-index: 2;
          width: 44px;
          height: 44px;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(240, 196, 86, 0.44));
        }

        .orbit,
        .node {
          position: absolute;
          pointer-events: none;
        }

        .orbit {
          inset: 11px 7px;
          border: 1px solid rgba(240, 196, 86, 0.56);
          border-left-color: transparent;
          border-bottom-color: transparent;
          border-radius: 999px;
          transform: rotate(-18deg);
        }

        .orbit.two {
          inset: 8px 13px;
          border-color: rgba(79, 209, 197, 0.4);
          border-right-color: transparent;
          transform: rotate(32deg);
        }

        .node {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--gold);
          box-shadow: 0 0 14px rgba(240, 196, 86, 0.8);
        }

        .n1 { top: 12px; right: 12px; }
        .n2 { left: 10px; bottom: 17px; background: var(--teal); }
        .n3 { right: 18px; bottom: 9px; }

        .structure {
          padding: 1rem 0 3.5rem;
        }

        .wide-card {
          padding: clamp(1.2rem, 3vw, 2rem);
        }

        .stack {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 1.6rem;
        }

        .stack div {
          min-height: 190px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.46);
          padding: 1rem;
        }

        .stack span {
          color: var(--gold-deep);
          font-size: 0.75rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .stack strong {
          display: block;
          margin-top: 0.7rem;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.5rem;
          line-height: 1;
        }

        .worlds {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          padding: 1rem 0 4rem;
        }

        .world {
          min-height: 680px;
          padding: clamp(1rem, 3vw, 1.5rem);
          overflow: hidden;
        }

        .world .wordmark {
          margin-bottom: 3rem;
        }

        .parent-world {
          background:
            radial-gradient(circle at 84% 8%, rgba(240, 196, 86, 0.22), transparent 16rem),
            linear-gradient(180deg, #fffaf1, #f5eadb);
        }

        .network-world {
          border-color: rgba(255, 250, 241, 0.14);
          background:
            radial-gradient(circle at 82% 10%, rgba(240, 196, 86, 0.24), transparent 18rem),
            radial-gradient(circle at 18% 34%, rgba(79, 209, 197, 0.15), transparent 18rem),
            linear-gradient(180deg, #07101f, #020712);
          color: var(--pearl);
        }

        .network-world .eyebrow,
        .network-world h2 {
          color: #fff7c4;
        }

        .network-world p {
          color: rgba(255, 250, 241, 0.72);
        }

        .route-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }

        .route-list span {
          border: 1px solid rgba(17, 35, 74, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.48);
          padding: 0.45rem 0.7rem;
          color: var(--ink);
          font-size: 0.78rem;
          font-weight: 900;
        }

        .network-world .route-list span {
          border-color: rgba(255, 250, 241, 0.14);
          background: rgba(255, 250, 241, 0.08);
          color: rgba(255, 250, 241, 0.82);
        }

        .sample-product {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
          margin-top: 2rem;
        }

        .sample-product div {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.56);
          padding: 1rem;
        }

        .sample-product span {
          color: var(--gold-deep);
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .sample-product strong {
          display: block;
          margin-top: 0.45rem;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 2.1rem;
          line-height: 1;
        }

        .network-image {
          position: relative;
          min-height: 270px;
          margin-top: 2rem;
          border: 1px solid rgba(240, 196, 86, 0.24);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
        }

        .network-image img {
          object-fit: cover;
        }

        .bridge {
          display: grid;
          grid-template-columns: 0.75fr 1.25fr;
          gap: 1rem;
          padding: clamp(1rem, 3vw, 1.6rem);
          border-color: rgba(17, 35, 74, 0.12);
          background:
            radial-gradient(circle at 12% 18%, rgba(240, 196, 86, 0.16), transparent 18rem),
            linear-gradient(135deg, rgba(255, 250, 241, 0.96), rgba(244, 234, 219, 0.94));
        }

        .rules {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          border-radius: 8px;
          background:
            radial-gradient(circle at 86% 12%, rgba(240, 196, 86, 0.14), transparent 14rem),
            linear-gradient(180deg, #07101f, #020712);
          padding: 0.75rem;
        }

        .rules article {
          border: 1px solid rgba(255, 250, 241, 0.16);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.08);
          padding: 1rem;
        }

        .rules strong {
          color: #fff7c4;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.25rem;
        }

        .rules p {
          color: rgba(255, 250, 241, 0.7);
          font-size: 0.9rem;
        }

        .logo-options {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          padding: 4rem 0;
          color: var(--pearl);
        }

        .logo-options article {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(255, 250, 241, 0.92);
          padding: 1.2rem;
        }

        .seal {
          width: 104px;
          height: 104px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(240, 196, 86, 0.18), rgba(7, 16, 31, 0.96));
          box-shadow: inset 0 0 0 1px rgba(240, 196, 86, 0.4);
        }

        .mini-network {
          position: relative;
          width: 170px;
          height: 110px;
        }

        .mini-network .mark {
          position: absolute;
          left: 48px;
          top: 22px;
        }

        .mini-network > span {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: var(--gold);
          box-shadow: 0 0 0 7px rgba(240, 196, 86, 0.14);
        }

        .mini-network > span:nth-of-type(1) { left: 8px; top: 8px; }
        .mini-network > span:nth-of-type(2) { right: 12px; top: 18px; background: var(--teal); }
        .mini-network > span:nth-of-type(3) { right: 52px; bottom: 8px; }

        .palette {
          margin-bottom: 5rem;
          padding: clamp(1rem, 3vw, 1.6rem);
        }

        .swatches {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 1.4rem;
        }

        .swatches article {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.48);
          padding: 0.75rem;
        }

        .swatches span {
          display: block;
          height: 72px;
          border: 1px solid rgba(17, 35, 74, 0.12);
          border-radius: 7px;
          margin-bottom: 0.75rem;
        }

        .swatches strong {
          color: var(--ink);
        }

        .swatches p {
          min-height: 40px;
          margin: 0.35rem 0 0.65rem;
          font-size: 0.82rem;
          line-height: 1.35;
        }

        .swatches code {
          color: var(--ink-soft);
          font-size: 0.75rem;
        }

        @media (max-width: 900px) {
          .brand-system {
            background:
              radial-gradient(circle at 12% 4%, rgba(240, 196, 86, 0.2), transparent 24rem),
              linear-gradient(180deg, #fffaf1 0%, #f4eadb 46%, #08111f 46%, #030712 100%);
          }

          .hero,
          .worlds,
          .bridge {
            grid-template-columns: 1fr;
          }

          .stack,
          .rules,
          .logo-options,
          .swatches {
            grid-template-columns: 1fr;
          }

          .world {
            min-height: auto;
          }

          .bridge {
            background:
              radial-gradient(circle at 12% 18%, rgba(240, 196, 86, 0.16), transparent 18rem),
              linear-gradient(135deg, rgba(255, 250, 241, 0.96), rgba(244, 234, 219, 0.94));
          }

          .bridge h2 {
            margin-bottom: 1.6rem;
          }

          .sample-product {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  )
}
