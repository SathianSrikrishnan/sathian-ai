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
  { name: "Vellum", value: "#f6ead6", role: "warm parent surfaces" },
  { name: "Porcelain", value: "#fff8eb", role: "cards and memory objects" },
  { name: "Ink Navy", value: "#101d34", role: "primary text and trust" },
  { name: "Lantern Gold", value: "#d9a84e", role: "Toothlight glow" },
  { name: "Rose Copper", value: "#b97963", role: "human warmth" },
  { name: "Sage Glass", value: "#9fc7b4", role: "network accent" },
  { name: "Keeper Night", value: "#07111f", role: "storybook world" },
]

function ProductMark() {
  return (
    <span className="product-mark" aria-hidden="true">
      <span className="product-mark-orbit" />
      <Image
        src="/toothfairy/brand/toothfairy-glow-mark-512.png"
        alt=""
        width={86}
        height={86}
        priority
      />
    </span>
  )
}

function Wordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className={`wordmark ${tone}`}>
      <ProductMark />
      <div>
        <strong>Toothlight</strong>
        <span>by Tooth Fairy Network</span>
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
      <div className="network-plate">
        <ProductMark />
        <div>
          <span>Tooth Fairy Network</span>
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
          <p className="eyebrow">Brand system pass v2</p>
          <h1>One lost tooth becomes one Toothlight.</h1>
          <p>
            Toothlight is the parent-facing product: a private AI-enhanced memory and
            fundable time capsule. Tooth Fairy Network is the keeper world: collectors
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
            <Image
              src="/toothfairy/brand/toothfairy-glow-mark-512.png"
              alt="Glowing Toothlight mark"
              width={300}
              height={300}
              priority
            />
          </div>
          <p>
            The mark should feel like a collectible memory object: porcelain tooth,
            lantern glow, dark story core, and subtle connection arcs. The wordmark
            stays solid, not rainbow or gradient.
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
            softly beveled capsule. Connection is implied, not cluttered.
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
            Tooth Fairy Network, Keepers of Toothlights.
          </p>
        </article>
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
            This is where Tanda and the Keepers live. They collect Toothlights,
            preserve cultural traditions, and turn the product into a story world.
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
            <p>Lead with Toothlight. Use Tooth Fairy Network as the keeper-world endorsement.</p>
          </article>
          <article>
            <strong>Same product object</strong>
            <p>The glowing tooth capsule appears in parent pages, stories, sharing, and funds.</p>
          </article>
          <article>
            <strong>Story supports product</strong>
            <p>Keepers collect Toothlights. They do not compete with the parent product.</p>
          </article>
        </div>
      </section>

      <section className="palette" aria-label="Color palette">
        <div>
          <p className="eyebrow">Core palette v2</p>
          <h2>Warmer parent surfaces. Deeper keeper night. Less toy color.</h2>
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
          --vellum: #f6ead6;
          --vellum-deep: #ead8bb;
          --porcelain: #fff8eb;
          --ink: #101d34;
          --ink-soft: #3e4d64;
          --lantern: #d9a84e;
          --lantern-hot: #f2cb74;
          --copper: #b97963;
          --sage: #9fc7b4;
          --night: #07111f;
          --night-deep: #020712;
          --line: rgba(16, 29, 52, 0.14);
          min-height: 100vh;
          background:
            radial-gradient(circle at 16% 6%, rgba(217, 168, 78, 0.26), transparent 26rem),
            radial-gradient(circle at 88% 18%, rgba(185, 121, 99, 0.18), transparent 22rem),
            linear-gradient(180deg, #fff8eb 0%, #f6ead6 58%, #ead8bb 100%);
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
          background: rgba(255, 248, 235, 0.58);
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
          background: rgba(255, 248, 235, 0.72);
          box-shadow: 0 30px 82px rgba(44, 28, 8, 0.1);
        }

        .identity-card {
          padding: clamp(1.1rem, 3vw, 1.6rem);
          background:
            radial-gradient(circle at 50% 44%, rgba(217, 168, 78, 0.22), transparent 15rem),
            linear-gradient(180deg, rgba(255, 248, 235, 0.94), rgba(246, 234, 214, 0.82));
        }

        .identity-art {
          display: grid;
          place-items: center;
          min-height: 320px;
          margin: 1rem 0;
          border-radius: 8px;
          background:
            radial-gradient(circle, rgba(242, 203, 116, 0.3), transparent 44%),
            linear-gradient(135deg, rgba(255, 248, 235, 0.9), rgba(255, 255, 255, 0.45));
          overflow: hidden;
        }

        .identity-art img {
          filter: drop-shadow(0 24px 42px rgba(99, 60, 20, 0.22));
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
          color: rgba(255, 248, 235, 0.72);
        }

        .product-mark {
          position: relative;
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          border-radius: 22px;
          background:
            radial-gradient(circle at 44% 38%, rgba(255, 248, 235, 0.92), rgba(242, 203, 116, 0.32) 48%, rgba(16, 29, 52, 0.18)),
            linear-gradient(145deg, rgba(255, 248, 235, 0.94), rgba(234, 216, 187, 0.56));
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.74),
            inset 0 -16px 28px rgba(120, 75, 32, 0.1),
            0 18px 38px rgba(84, 53, 16, 0.15),
            0 0 38px rgba(217, 168, 78, 0.24);
        }

        .product-mark::before {
          content: "";
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(217, 168, 78, 0.36);
          border-radius: 18px;
        }

        .product-mark img {
          z-index: 2;
          width: 58px;
          height: 58px;
          object-fit: cover;
          border-radius: 18px;
          filter: drop-shadow(0 0 14px rgba(217, 168, 78, 0.5));
        }

        .product-mark-orbit {
          position: absolute;
          inset: 14px 8px;
          border: 1.5px solid rgba(159, 199, 180, 0.72);
          border-left-color: transparent;
          border-bottom-color: transparent;
          border-radius: 999px;
          transform: rotate(-18deg);
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
            radial-gradient(circle, rgba(217, 168, 78, 0.22), transparent 52%),
            linear-gradient(145deg, rgba(255, 248, 235, 0.92), rgba(234, 216, 187, 0.7));
          box-shadow: inset 0 0 0 1px rgba(16, 29, 52, 0.08);
        }

        .object-showcase .product-mark {
          width: 152px;
          height: 152px;
          border-radius: 42px;
        }

        .object-showcase .product-mark::before {
          border-radius: 34px;
          inset: 13px;
        }

        .object-showcase .product-mark img {
          width: 126px;
          height: 126px;
          border-radius: 36px;
        }

        .object-showcase .product-mark-orbit {
          inset: 34px 19px;
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
            inset 0 0 0 1px rgba(217, 168, 78, 0.36),
            0 20px 48px rgba(16, 29, 52, 0.15);
        }

        .keeper-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 52% 78%, rgba(242, 203, 116, 0.2), transparent 20rem),
            linear-gradient(180deg, transparent 46%, rgba(7, 17, 31, 0.48));
        }

        .keeper-image img {
          object-fit: cover;
          object-position: 50% 57%;
        }

        .keeper-copy {
          border: 1px solid rgba(217, 168, 78, 0.24);
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
            inset 0 0 0 1px rgba(217, 168, 78, 0.28),
            0 24px 58px rgba(2, 7, 18, 0.24);
        }

        .network-lockup > img {
          object-fit: cover;
        }

        .network-lockup::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 48% 54%, transparent, rgba(2, 7, 18, 0.12) 36%, rgba(2, 7, 18, 0.54)),
            linear-gradient(180deg, rgba(2, 7, 18, 0.08), rgba(2, 7, 18, 0.68));
        }

        .network-plate {
          position: absolute;
          z-index: 2;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          display: grid;
          grid-template-columns: 70px minmax(0, 1fr);
          align-items: center;
          gap: 0.8rem;
          border: 1px solid rgba(255, 248, 235, 0.16);
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
          background: rgba(255, 248, 235, 0.55);
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
            radial-gradient(circle at 86% 8%, rgba(217, 168, 78, 0.2), transparent 16rem),
            linear-gradient(180deg, #fff8eb, #f4e3c8);
        }

        .network-world {
          border-color: rgba(255, 248, 235, 0.14);
          background:
            radial-gradient(circle at 82% 10%, rgba(217, 168, 78, 0.18), transparent 18rem),
            radial-gradient(circle at 16% 36%, rgba(159, 199, 180, 0.12), transparent 18rem),
            linear-gradient(180deg, #07111f, #020712);
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
          color: rgba(255, 248, 235, 0.72);
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
          background: rgba(255, 248, 235, 0.56);
          padding: 0.45rem 0.7rem;
          color: var(--ink);
          font-size: 0.78rem;
          font-weight: 900;
        }

        .network-world .route-list span {
          border-color: rgba(255, 248, 235, 0.14);
          background: rgba(255, 248, 235, 0.08);
          color: rgba(255, 248, 235, 0.82);
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
          background: rgba(255, 248, 235, 0.6);
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
            radial-gradient(circle at 12% 18%, rgba(217, 168, 78, 0.16), transparent 18rem),
            linear-gradient(135deg, rgba(255, 248, 235, 0.96), rgba(246, 234, 214, 0.94));
        }

        .rules {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          border-radius: 8px;
          background:
            radial-gradient(circle at 86% 12%, rgba(217, 168, 78, 0.13), transparent 14rem),
            linear-gradient(180deg, #07111f, #020712);
          padding: 0.75rem;
        }

        .rules article {
          border: 1px solid rgba(255, 248, 235, 0.16);
          border-radius: 8px;
          background: rgba(255, 248, 235, 0.08);
          padding: 1rem;
        }

        .rules strong {
          color: #fff1bd;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.25rem;
        }

        .rules p {
          color: rgba(255, 248, 235, 0.72);
          font-size: 0.9rem;
        }

        .palette {
          margin-bottom: 5rem;
          padding: clamp(1rem, 3vw, 1.6rem);
        }

        .swatches {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 1.4rem;
        }

        .swatches article {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 248, 235, 0.5);
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
              radial-gradient(circle at 16% 6%, rgba(217, 168, 78, 0.24), transparent 24rem),
              linear-gradient(180deg, #fff8eb 0%, #f6ead6 62%, #ead8bb 100%);
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
            border-radius: 19px;
          }

          .product-mark img {
            width: 51px;
            height: 51px;
            border-radius: 16px;
          }
        }
      `}</style>
    </main>
  )
}
