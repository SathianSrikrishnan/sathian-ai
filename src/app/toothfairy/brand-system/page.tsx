import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Toothlight Brand System | ToothFairy Network",
  description:
    "A working brand board for Toothlight, the Smile Fund, and the ToothFairy Network keeper world.",
}

const parentRoutes = ["Homepage", "Preview", "Smile Fund", "FAQ", "Draw flow"]
const storyRoutes = ["Tanda", "Keepers", "Story map", "Cultural doors", "Animation"]

const palette = [
  { name: "Vellum", value: "#f4e4c8", role: "warm parent surfaces" },
  { name: "Tooth Ivory", value: "#fff7e6", role: "memory object and light" },
  { name: "Ink Navy", value: "#101d34", role: "primary trust text" },
  { name: "Story Blue", value: "#102542", role: "bridge between product and story" },
  { name: "Keeper Black", value: "#020712", role: "storybook night world" },
  { name: "Thread Gold", value: "#d6a046", role: "network mesh and Toothlight glow" },
]

function ProductMark() {
  return (
    <span className="product-mark" aria-hidden="true">
      <svg viewBox="0 0 128 128" role="img" focusable="false">
        <defs>
          <radialGradient id="toothlightShell" cx="44%" cy="35%" r="74%">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="48%" stopColor="#f4e4c8" />
            <stop offset="100%" stopColor="#d9bd82" />
          </radialGradient>
          <radialGradient id="toothlightCore" cx="50%" cy="45%" r="62%">
            <stop offset="0%" stopColor="#24385c" />
            <stop offset="52%" stopColor="#102542" />
            <stop offset="100%" stopColor="#020712" />
          </radialGradient>
          <linearGradient id="toothlightTooth" x1="41" y1="29" x2="84" y2="94" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="48%" stopColor="#fff3d5" />
            <stop offset="100%" stopColor="#d6a046" />
          </linearGradient>
          <filter id="toothlightGlow" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.82  0 1 0 0 0.55  0 0 1 0 0.18  0 0 0 0.82 0"
              result="goldGlow"
            />
            <feMerge>
              <feMergeNode in="goldGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect className="mark-shell" x="7" y="7" width="114" height="114" rx="30" />
        <rect className="mark-inner-line" x="17" y="17" width="94" height="94" rx="25" />
        <circle className="mark-core" cx="64" cy="64" r="41" />
        <circle className="mark-orbit mark-orbit-wide" cx="64" cy="64" r="47" />
        <circle className="mark-orbit mark-orbit-tight" cx="64" cy="64" r="33" />
        <path className="mark-thread" d="M32 73 C45 48 84 42 97 64" />
        <path className="mark-thread" d="M30 60 C47 84 84 88 100 57" />
        <circle className="mark-node" cx="34" cy="72" r="2.3" />
        <circle className="mark-node" cx="51" cy="50" r="1.9" />
        <circle className="mark-node" cx="84" cy="47" r="2.1" />
        <circle className="mark-node" cx="99" cy="64" r="2.5" />
        <circle className="mark-star" cx="44" cy="40" r="1.2" />
        <circle className="mark-star" cx="89" cy="81" r="1.4" />
        <circle className="mark-star" cx="72" cy="36" r="1" />
        <path
          className="mark-tooth"
          d="M64.1 32.5c-6.7-5.7-20.6-6.5-26 3.4-5.5 10.2-1.1 22.1 3.1 31.1 3.3 7 2.1 20.9 9.1 22.8 5.8 1.6 7.7-12.9 13.8-12.9 6 0 7.8 14.5 13.6 12.9 7-1.9 5.9-15.8 9.1-22.8 4.2-9 8.5-20.9 3.1-31.1-5.3-9.9-19.2-9.1-25.8-3.4z"
        />
        <path className="mark-tooth-shine" d="M50.5 37.5c5.7 7.3 17.3 7.2 25.8 1.8" />
      </svg>
    </span>
  )
}

function MemoryMesh() {
  return (
    <svg className="memory-mesh" viewBox="0 0 900 460" preserveAspectRatio="none" aria-hidden="true">
      <g className="mesh-cube">
        <polygon points="234,112 429,64 617,122 419,184" />
        <polygon points="234,112 419,184 419,366 232,302" />
        <polygon points="617,122 419,184 419,366 618,284" />
        <polygon points="419,184 617,122 618,284 419,366" />
      </g>
      <g className="mesh-threads">
        <path d="M234 112 L429 64 L617 122 L419 184 Z" />
        <path d="M232 302 L419 366 L618 284" />
        <path d="M234 112 L232 302" />
        <path d="M429 64 L419 366" />
        <path d="M617 122 L618 284" />
        <path d="M300 96 L492 344" />
        <path d="M534 96 L302 324" />
        <path d="M234 220 C333 171 488 185 618 204" />
        <path d="M122 304 C245 222 355 190 475 202 C577 211 676 166 790 93" />
        <path d="M139 147 C266 208 387 232 506 221 C612 211 714 248 804 326" />
      </g>
      <g className="mesh-nodes">
        {[
          [234, 112],
          [429, 64],
          [617, 122],
          [419, 184],
          [232, 302],
          [419, 366],
          [618, 284],
          [300, 96],
          [492, 344],
          [534, 96],
          [302, 324],
          [122, 304],
          [790, 93],
          [139, 147],
          [804, 326],
          [475, 202],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
        ))}
      </g>
      <g className="mesh-lights">
        <circle cx="419" cy="184" r="38" />
        <circle cx="617" cy="122" r="25" />
        <circle cx="232" cy="302" r="23" />
      </g>
    </svg>
  )
}

function Wordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className={`wordmark ${tone}`}>
      <ProductMark />
      <div>
        <strong>Toothlight</strong>
        <span>preserved by ToothFairy Network</span>
      </div>
    </div>
  )
}

function KeeperSeal() {
  return (
    <div className="keeper-seal" aria-label="Keeper seal concept">
      <div className="keeper-image">
        <Image
          src="/story-assets/tanda/v2/s1-frame-25-first-toothlight.png"
          alt="Tanda holding the first Toothlight memory"
          fill
          sizes="320px"
        />
      </div>
      <div className="keeper-copy">
        <span>The Keepers</span>
        <strong>Collect and preserve Toothlights.</strong>
      </div>
    </div>
  )
}

function NetworkLockup() {
  return (
    <div className="network-lockup" aria-label="Network lockup concept">
      <Image
        src="/story-assets/tanda/v2/s1-frame-32-network-begins-cta.png"
        alt="Tanda connecting Toothlights across the network"
        fill
        sizes="(min-width: 900px) 44vw, 92vw"
      />
      <MemoryMesh />
      <div className="network-plate">
        <ProductMark />
        <div>
          <span>ToothFairy Network</span>
          <strong>Keepers of Toothlights</strong>
        </div>
      </div>
    </div>
  )
}

export default function ToothlightBrandSystemPage() {
  return (
    <main className="brand-system">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Brand system pass v3</p>
          <h1>One lost tooth becomes one Toothlight.</h1>
          <p>
            Toothlight is the parent-facing product: a private AI-enhanced memory and
            fundable time capsule. ToothFairy Network is the keeper world: collectors
            preserving Toothlights across families, cultures, stories, and learning.
          </p>
          <div className="actions">
            <Link href="/toothfairy">Current homepage</Link>
            <Link href="/toothfairy/stories">Story world</Link>
          </div>
        </div>

        <div className="identity-card" aria-label="Recommended identity direction">
          <Wordmark />
          <div className="identity-art">
            <ProductMark />
          </div>
          <p>
            The mark now starts as a designed object: complete rounded shell, dark
            memory core, full rings, tooth light, and gold connection threads. The
            wordmark stays solid; the glow belongs inside the mark.
          </p>
        </div>
      </section>

      <section className="brand-objects" aria-label="Identity object system">
        <article className="object-card product-object">
          <p className="eyebrow">Product mark</p>
          <div className="object-showcase">
            <ProductMark />
          </div>
          <h2>Simple enough for an app icon. Rich enough for the story world.</h2>
          <p>
            The parent product gets the cleanest form: a luminous tooth inside a
            precise memory capsule. The network is present, but not noisy.
          </p>
        </article>

        <article className="object-card keeper-object">
          <p className="eyebrow">Keeper seal</p>
          <KeeperSeal />
          <h2>A story seal, not a generic badge.</h2>
          <p>
            The keeper identity should use Tanda and the Toothlight object together,
            framed like a storybook collector seal.
          </p>
        </article>

        <article className="object-card network-object">
          <p className="eyebrow">Network lockup</p>
          <NetworkLockup />
          <h2>The network is a world, not a diagram.</h2>
          <p>
            Use cinematic story imagery for the umbrella brand. The line is simple:
            ToothFairy Network, Keepers of Toothlights.
          </p>
        </article>
      </section>

      <section className="structure" aria-label="Brand hierarchy">
        <article className="wide-card">
          <p className="eyebrow">Naming hierarchy</p>
          <h2>Toothlight sells the product. ToothFairy Network explains the world.</h2>
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
              <strong>ToothFairy Network</strong>
              <p>The cultural story world and education umbrella.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="worlds" aria-label="Two connected visual worlds">
        <article className="world parent-world">
          <Wordmark />
          <div className="world-media parent-media">
            <Image
              src="/toothfairy/visual-system/hero-family-v1.png"
              alt="Parent and child saving a lost tooth memory"
              fill
              sizes="(min-width: 900px) 42vw, 92vw"
            />
          </div>
          <p className="eyebrow">Parent product world</p>
          <h2>Warm, precise, fundable.</h2>
          <p>
            This is where parents understand the product quickly: save the tooth
            moment, enhance the story, share the link, and keep control of the
            Smile Fund.
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
          <Wordmark tone="dark" />
          <NetworkLockup />
          <p className="eyebrow">Storybook network world</p>
          <h2>Night, lanterns, keepers.</h2>
          <p>
            This is where Tanda and the Keepers live. They collect Toothlights inside
            a gold-thread memory network and turn the product into a story world.
          </p>
          <div className="route-list">
            {storyRoutes.map((route) => (
              <span key={route}>{route}</span>
            ))}
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
            <p>The wordmark should be solid ink or porcelain. The glow lives in the mark.</p>
          </article>
          <article>
            <strong>One product name first</strong>
            <p>Lead with Toothlight. Use ToothFairy Network as the keeper-world endorsement.</p>
          </article>
          <article>
            <strong>Same product object</strong>
            <p>The glowing tooth capsule appears in parent pages, stories, sharing, and funds.</p>
          </article>
          <article>
            <strong>Gold mesh means network</strong>
            <p>Threads, nodes, and memory cubes show why Toothlights belong together.</p>
          </article>
        </div>
      </section>

      <section className="palette" aria-label="Color palette">
        <div>
          <p className="eyebrow">Core palette v3</p>
          <h2>Cream parent surfaces, blue story depth, gold memory threads.</h2>
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
          --vellum: #f4e4c8;
          --vellum-deep: #e7d2ad;
          --porcelain: #fff7e6;
          --ink: #101d34;
          --ink-soft: #3e4d64;
          --story-blue: #102542;
          --lantern: #d6a046;
          --lantern-hot: #f5d17d;
          --night: #102542;
          --night-deep: #020712;
          --line: rgba(16, 29, 52, 0.14);
          min-height: 100vh;
          background:
            radial-gradient(circle at 16% 6%, rgba(214, 160, 70, 0.25), transparent 26rem),
            radial-gradient(circle at 88% 18%, rgba(16, 37, 66, 0.14), transparent 24rem),
            linear-gradient(180deg, #fff7e6 0%, #f4e4c8 58%, #e7d2ad 100%);
          color: var(--ink);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .brand-system * {
          box-sizing: border-box;
        }

        .hero,
        .brand-objects,
        .structure,
        .worlds,
        .bridge,
        .palette {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.82fr);
          gap: clamp(1.4rem, 5vw, 5rem);
          align-items: center;
          padding: clamp(5rem, 10vw, 8rem) 0 4rem;
        }

        .eyebrow {
          margin: 0 0 0.85rem;
          color: #a77327;
          font-size: 0.78rem;
          font-weight: 950;
          letter-spacing: 0.16em;
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
          font-size: clamp(4.2rem, 8.3vw, 8.2rem);
          line-height: 0.88;
        }

        h2 {
          color: var(--ink);
          font-size: clamp(2rem, 3.8vw, 4rem);
          line-height: 0.98;
        }

        p {
          color: var(--ink-soft);
          font-size: 1rem;
          line-height: 1.7;
        }

        .hero-copy > p:not(.eyebrow) {
          max-width: 660px;
          font-size: clamp(1.08rem, 1.75vw, 1.28rem);
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
          color: var(--porcelain);
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 16px 34px rgba(16, 29, 52, 0.14);
        }

        .actions a + a {
          border: 1px solid var(--line);
          background: rgba(255, 247, 230, 0.58);
          color: var(--ink);
          box-shadow: none;
        }

        .identity-card,
        .wide-card,
        .object-card,
        .world,
        .bridge,
        .palette {
          border: 1px solid rgba(16, 29, 52, 0.13);
          border-radius: 8px;
          background: rgba(255, 247, 230, 0.72);
          box-shadow: 0 30px 82px rgba(44, 28, 8, 0.1);
        }

        .identity-card {
          padding: clamp(1.1rem, 3vw, 1.6rem);
          background:
            radial-gradient(circle at 50% 44%, rgba(214, 160, 70, 0.22), transparent 15rem),
            linear-gradient(180deg, rgba(255, 247, 230, 0.94), rgba(244, 228, 200, 0.82));
        }

        .identity-art {
          display: grid;
          place-items: center;
          min-height: 320px;
          margin: 1rem 0;
          border-radius: 8px;
          background:
            radial-gradient(circle, rgba(245, 209, 125, 0.3), transparent 44%),
            linear-gradient(135deg, rgba(255, 247, 230, 0.9), rgba(255, 255, 255, 0.45));
          overflow: hidden;
        }

        .identity-art .product-mark {
          width: min(290px, 72vw);
          height: min(290px, 72vw);
        }

        .wordmark {
          display: inline-grid;
          grid-template-columns: 70px minmax(0, 1fr);
          align-items: center;
          gap: 0.9rem;
        }

        .wordmark strong {
          display: block;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.9rem, 3.5vw, 3.15rem);
          font-weight: 950;
          line-height: 0.9;
        }

        .wordmark span {
          display: block;
          margin-top: 0.32rem;
          color: var(--ink-soft);
          font-size: 0.73rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .wordmark.dark strong {
          color: var(--porcelain);
        }

        .wordmark.dark span {
          color: rgba(255, 247, 230, 0.72);
        }

        .product-mark {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          filter:
            drop-shadow(0 18px 24px rgba(84, 53, 16, 0.16))
            drop-shadow(0 0 22px rgba(214, 160, 70, 0.28));
        }

        .product-mark svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .mark-shell {
          fill: url(#toothlightShell);
          stroke: rgba(255, 255, 255, 0.78);
          stroke-width: 1.5;
        }

        .mark-inner-line {
          fill: none;
          stroke: rgba(16, 29, 52, 0.13);
          stroke-width: 1.2;
        }

        .mark-core {
          fill: url(#toothlightCore);
          stroke: rgba(214, 160, 70, 0.72);
          stroke-width: 1.4;
        }

        .mark-orbit {
          fill: none;
          stroke: rgba(214, 160, 70, 0.46);
          stroke-width: 1.15;
        }

        .mark-orbit-tight {
          stroke: rgba(255, 247, 230, 0.18);
        }

        .mark-thread {
          fill: none;
          stroke: rgba(245, 209, 125, 0.82);
          stroke-width: 1.4;
          stroke-linecap: round;
        }

        .mark-node {
          fill: #f5d17d;
          stroke: rgba(2, 7, 18, 0.45);
          stroke-width: 0.8;
        }

        .mark-star {
          fill: rgba(255, 247, 230, 0.9);
        }

        .mark-tooth {
          fill: url(#toothlightTooth);
          stroke: rgba(255, 247, 230, 0.88);
          stroke-width: 1.2;
          filter: url(#toothlightGlow);
        }

        .mark-tooth-shine {
          fill: none;
          stroke: rgba(255, 255, 255, 0.78);
          stroke-width: 2.2;
          stroke-linecap: round;
        }

        .brand-objects {
          display: grid;
          grid-template-columns: 0.84fr 1fr 1.18fr;
          gap: 1rem;
          padding: 1rem 0 3.5rem;
        }

        .object-card {
          min-height: 520px;
          display: flex;
          flex-direction: column;
          padding: clamp(1rem, 2.5vw, 1.4rem);
          overflow: hidden;
        }

        .object-card h2 {
          margin-top: 1rem;
          font-size: clamp(1.7rem, 2.6vw, 2.7rem);
        }

        .object-showcase {
          display: grid;
          place-items: center;
          min-height: 230px;
          border-radius: 8px;
          background:
            radial-gradient(circle, rgba(214, 160, 70, 0.22), transparent 52%),
            linear-gradient(145deg, rgba(255, 247, 230, 0.92), rgba(231, 210, 173, 0.7));
          box-shadow: inset 0 0 0 1px rgba(16, 29, 52, 0.08);
        }

        .object-showcase .product-mark {
          width: 152px;
          height: 152px;
        }

        .keeper-seal {
          display: grid;
          gap: 0.9rem;
        }

        .keeper-image {
          position: relative;
          min-height: 270px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--night);
          box-shadow:
            inset 0 0 0 1px rgba(214, 160, 70, 0.36),
            0 20px 48px rgba(16, 29, 52, 0.15);
        }

        .keeper-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 52% 78%, rgba(245, 209, 125, 0.2), transparent 20rem),
            linear-gradient(180deg, transparent 46%, rgba(7, 17, 31, 0.48));
        }

        .keeper-image img {
          object-fit: cover;
          object-position: 50% 57%;
        }

        .keeper-copy {
          border: 1px solid rgba(214, 160, 70, 0.24);
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(16, 29, 52, 0.96), rgba(7, 17, 31, 0.96));
          padding: 0.9rem;
        }

        .keeper-copy span,
        .network-plate span {
          display: block;
          color: var(--lantern-hot);
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .keeper-copy strong,
        .network-plate strong {
          display: block;
          margin-top: 0.3rem;
          color: var(--porcelain);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.55rem;
          line-height: 1;
        }

        .network-lockup {
          position: relative;
          min-height: 310px;
          border-radius: 8px;
          overflow: hidden;
          background: var(--night);
          box-shadow:
            inset 0 0 0 1px rgba(214, 160, 70, 0.28),
            0 24px 58px rgba(2, 7, 18, 0.24);
        }

        .network-lockup > img {
          object-fit: cover;
          z-index: 0;
        }

        .network-lockup::after {
          content: "";
          position: absolute;
          z-index: 1;
          inset: 0;
          background:
            radial-gradient(circle at 48% 54%, transparent, rgba(2, 7, 18, 0.12) 36%, rgba(2, 7, 18, 0.54)),
            linear-gradient(180deg, rgba(2, 7, 18, 0.08), rgba(2, 7, 18, 0.68));
          pointer-events: none;
        }

        .memory-mesh {
          position: absolute;
          z-index: 2;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.9;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .mesh-cube polygon {
          fill: rgba(214, 160, 70, 0.07);
          stroke: rgba(245, 209, 125, 0.34);
          stroke-width: 1.2;
          vector-effect: non-scaling-stroke;
        }

        .mesh-threads path {
          fill: none;
          stroke: rgba(245, 209, 125, 0.72);
          stroke-width: 1.35;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
        }

        .mesh-nodes circle {
          fill: #f5d17d;
          stroke: rgba(255, 247, 230, 0.66);
          stroke-width: 1;
          vector-effect: non-scaling-stroke;
          filter: drop-shadow(0 0 10px rgba(245, 209, 125, 0.8));
        }

        .mesh-lights circle {
          fill: rgba(214, 160, 70, 0.22);
          filter: drop-shadow(0 0 22px rgba(245, 209, 125, 0.55));
        }

        .network-plate {
          position: absolute;
          z-index: 3;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          display: grid;
          grid-template-columns: 70px minmax(0, 1fr);
          align-items: center;
          gap: 0.8rem;
          border: 1px solid rgba(255, 247, 230, 0.16);
          border-radius: 8px;
          background: rgba(7, 17, 31, 0.72);
          padding: 0.8rem;
          backdrop-filter: blur(14px);
        }

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
          background: rgba(255, 247, 230, 0.55);
          padding: 1rem;
        }

        .stack span {
          color: #a77327;
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
          min-height: 760px;
          padding: clamp(1rem, 3vw, 1.5rem);
          overflow: hidden;
        }

        .world .wordmark {
          margin-bottom: 1.1rem;
        }

        .parent-world {
          background:
            radial-gradient(circle at 86% 8%, rgba(214, 160, 70, 0.2), transparent 16rem),
            linear-gradient(180deg, #fff7e6, #f4e4c8);
        }

        .network-world {
          border-color: rgba(255, 247, 230, 0.14);
          background:
            radial-gradient(circle at 82% 10%, rgba(214, 160, 70, 0.2), transparent 18rem),
            radial-gradient(circle at 16% 36%, rgba(16, 37, 66, 0.84), transparent 18rem),
            linear-gradient(180deg, #102542, #020712);
          color: var(--porcelain);
        }

        .network-world .network-lockup {
          min-height: 275px;
          margin-bottom: 1.6rem;
        }

        .world-media {
          position: relative;
          min-height: 275px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(16, 29, 52, 0.1);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 24px 58px rgba(44, 28, 8, 0.12);
        }

        .world-media img {
          object-fit: cover;
        }

        .network-world .eyebrow,
        .network-world h2 {
          color: #fff1bd;
        }

        .network-world p {
          color: rgba(255, 247, 230, 0.72);
        }

        .route-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }

        .route-list span {
          border: 1px solid rgba(16, 29, 52, 0.12);
          border-radius: 999px;
          background: rgba(255, 247, 230, 0.56);
          padding: 0.45rem 0.7rem;
          color: var(--ink);
          font-size: 0.78rem;
          font-weight: 900;
        }

        .network-world .route-list span {
          border-color: rgba(255, 247, 230, 0.14);
          background: rgba(255, 247, 230, 0.08);
          color: rgba(255, 247, 230, 0.82);
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
          background: rgba(255, 247, 230, 0.6);
          padding: 1rem;
        }

        .sample-product span {
          color: #a77327;
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

        .bridge {
          display: grid;
          grid-template-columns: 0.75fr 1.25fr;
          gap: 1rem;
          padding: clamp(1rem, 3vw, 1.6rem);
          border-color: rgba(16, 29, 52, 0.12);
          background:
            radial-gradient(circle at 12% 18%, rgba(214, 160, 70, 0.16), transparent 18rem),
            linear-gradient(135deg, rgba(255, 247, 230, 0.96), rgba(244, 228, 200, 0.94));
        }

        .rules {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          border-radius: 8px;
          background:
            radial-gradient(circle at 86% 12%, rgba(214, 160, 70, 0.13), transparent 14rem),
            linear-gradient(180deg, #102542, #020712);
          padding: 0.75rem;
        }

        .rules article {
          border: 1px solid rgba(255, 247, 230, 0.16);
          border-radius: 8px;
          background: rgba(255, 247, 230, 0.08);
          padding: 1rem;
        }

        .rules strong {
          color: #fff1bd;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.25rem;
        }

        .rules p {
          color: rgba(255, 247, 230, 0.72);
          font-size: 0.9rem;
        }

        .palette {
          margin-bottom: 5rem;
          padding: clamp(1rem, 3vw, 1.6rem);
        }

        .swatches {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 1.4rem;
        }

        .swatches article {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 247, 230, 0.5);
          padding: 0.75rem;
        }

        .swatches span {
          display: block;
          height: 72px;
          border: 1px solid rgba(16, 29, 52, 0.12);
          border-radius: 7px;
          margin-bottom: 0.75rem;
        }

        .swatches strong {
          color: var(--ink);
          font-size: 0.92rem;
        }

        .swatches p {
          min-height: 42px;
          margin: 0.35rem 0 0.65rem;
          font-size: 0.78rem;
          line-height: 1.35;
        }

        .swatches code {
          color: var(--ink-soft);
          font-size: 0.72rem;
        }

        @media (max-width: 1040px) {
          .brand-objects {
            grid-template-columns: 1fr;
          }

          .object-card {
            min-height: auto;
          }

          .swatches {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .brand-system {
            background:
              radial-gradient(circle at 16% 6%, rgba(214, 160, 70, 0.24), transparent 24rem),
              linear-gradient(180deg, #fff7e6 0%, #f4e4c8 62%, #e7d2ad 100%);
          }

          .hero,
          .worlds,
          .bridge {
            grid-template-columns: 1fr;
          }

          .stack,
          .rules,
          .swatches {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: clamp(4rem, 18vw, 5.8rem);
          }

          .identity-card {
            padding: 1rem;
          }

          .world {
            min-height: auto;
          }

          .sample-product {
            grid-template-columns: 1fr;
          }

          .wordmark {
            grid-template-columns: 62px minmax(0, 1fr);
          }

          .wordmark strong {
            font-size: 2rem;
          }

          .product-mark {
            width: 62px;
            height: 62px;
          }
        }
      `}</style>
    </main>
  )
}
