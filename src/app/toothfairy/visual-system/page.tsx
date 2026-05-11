import Image from "next/image"
import Link from "next/link"

type SlotStatus = "replace" | "redesign" | "keep-for-now"

const slots: Array<{
  id: string
  priority: "P0" | "P1" | "P2"
  status: SlotStatus
  title: string
  pageRole: string
  currentAsset: string
  currentUse: string
  gap: string
  target: string
  prompt: string
  acceptance: string[]
}> = [
  {
    id: "hero-family",
    priority: "P0",
    status: "replace",
    title: "Hero Parent-Child Moment",
    pageRole: "Five-second product comprehension above the fold.",
    currentAsset: "/toothfairy/concept-b/hero.png",
    currentUse: "Single smiling child photo.",
    gap: "The missing-tooth signal is clear, but it does not show the parent-child activity, the tooth object, or the emotional ritual.",
    target: "Warm parent-child lifestyle scene with the child holding a tooth and a little drawing. Tanda stays secondary.",
    prompt:
      "Warm premium consumer website hero image for Tooth Fairy Network. A parent and a 6-8 year old child sit together in soft home light. The child proudly shows a newly lost tooth and a small crayon drawing. The parent smiles gently, close and supportive. Realistic lifestyle photography with subtle magical golden dust near the tooth. No text, no UI, no logos. Composition leaves clean negative space on the left for website headline. Warm cream, deep navy, soft gold, restrained purple accents.",
    acceptance: [
      "Parent-child ritual is readable in under two seconds.",
      "No fake UI or text appears inside the photo.",
      "Safe crop at desktop hero and mobile square crops.",
    ],
  },
  {
    id: "tanda-guide",
    priority: "P0",
    status: "replace",
    title: "Tanda Guide Character",
    pageRole: "Brand/story guide who connects product to folklore.",
    currentAsset: "/toothfairy/tanda-v2-reference.jpg",
    currentUse: "Cropped portrait reference in a small floating frame.",
    gap: "Good direction, but the crop is from a portrait, not a purpose-built web asset. It also competes with the child photo.",
    target: "Clean full-body Tanda pose with transparent-style background, designed as a guide element, not a scene.",
    prompt:
      "Full-body character reference for Tanda, the Tooth Fairy Network guide. Brown wavy hair, warm expressive face, white layered dress, pastel translucent butterfly wings with pink, gold, and blue shimmer, small brown crossbody pouch, tooth pendant necklace. Friendly, intelligent, slightly mischievous, premium 3D storybook style. Pose: hovering and gesturing toward a glowing tooth. Clean pale cream background, no text, generous padding, crisp character silhouette.",
    acceptance: [
      "Tanda is recognizable at small nav/card scale.",
      "Pose points toward product flow without dominating the hero.",
      "No awkward crop, extra character, or malformed wings.",
    ],
  },
  {
    id: "nft-keepsake",
    priority: "P0",
    status: "replace",
    title: "NFT Keepsake Object",
    pageRole: "Make the first forever memory feel tangible and emotionally valuable.",
    currentAsset: "/toothfairy/concept-b/keepsake-mockup.png",
    currentUse: "Displayed in product demo and used as a generic keepsake visual.",
    gap: "It explains the idea, but feels too template-like and not premium enough for the hero conversion layer.",
    target: "A custom magical keepsake card: glowing tooth, child drawing, note, smile photo, subtle Solana proof.",
    prompt:
      "Premium product mockup of a Tooth Memory NFT keepsake card. It includes a glowing tooth artifact, a small child smile photo, a crayon tooth drawing, and a handwritten family note. Magical, warm, trustworthy, like a collectible memory object rather than a crypto trading card. Cream paper texture, deep navy labels, fairy gold glow, subtle Solana-inspired accent details. No fake unreadable text except Tooth Memory and #1024.",
    acceptance: [
      "Feels custom to TFN, not generic crypto art.",
      "The child keepsake components are visible.",
      "No noisy fake text or trading-card energy.",
    ],
  },
  {
    id: "smile-dashboard",
    priority: "P0",
    status: "redesign",
    title: "Smile Fund Dashboard",
    pageRole: "Show the financial product without making it feel intimidating.",
    currentAsset: "CSS/UI mock in homepage",
    currentUse: "Balance card with bars and dashboard panel.",
    gap: "The concept is correct, but the visual language needs a more product-grade dashboard composition.",
    target: "Simple parent-facing dashboard with balance, contributions, growth line, and age-10 unlock marker.",
    prompt:
      "Clean parent-facing dashboard mockup for a child's Smile Fund. Show Little Smile Fund, 12.45 SOL, a calm upward growth line, family contribution count, and an age 10 unlock milestone. Warm cream UI, deep navy text, soft green growth accents, subtle purple and gold details. Safe, simple, premium. No noisy data tables, no unrelated crypto jargon, no tiny unreadable labels.",
    acceptance: [
      "Looks like a trustworthy family finance product.",
      "Age 10 and family contributions are visible.",
      "Works as both hero overlay and larger section mockup.",
    ],
  },
  {
    id: "how-snap",
    priority: "P0",
    status: "redesign",
    title: "How It Works 01: Save The Moment",
    pageRole: "Explain the first action with zero cognitive load.",
    currentAsset: "CSS mini illustration",
    currentUse: "Camera/photo/tooth drawing concept.",
    gap: "Correct direction, but it should be visually finished and consistent with the next two steps.",
    target: "Simple icon-like illustration, not a scene: camera, tooth photo, child drawing, small sparkle.",
    prompt:
      "Simple premium mini illustration for a website step card. A camera, a tiny tooth photo, and a child crayon drawing arranged neatly on warm cream paper. Fairy gold sparkle accent, restrained purple outline, soft shadow. Icon-like product illustration, not a full scene. No text.",
    acceptance: [
      "Readable at small card size.",
      "Matches the other two step images.",
      "No people or busy background.",
    ],
  },
  {
    id: "how-gift",
    priority: "P0",
    status: "redesign",
    title: "How It Works 02: Invite The Family",
    pageRole: "Make family contribution feel warm and simple.",
    currentAsset: "CSS mini illustration",
    currentUse: "Heart and family initials.",
    gap: "The current initials read as accidental text instead of intentional visual language.",
    target: "Family nodes sending small gifts into one central Smile Fund heart.",
    prompt:
      "Simple premium mini illustration for a website step card. Three small family avatar circles send tiny golden gift tokens into one central heart-shaped Smile Fund. Warm cream background, deep navy, restrained purple outline, fairy gold accents, soft green success detail. Icon-like product illustration, no readable text.",
    acceptance: [
      "Family gifting is obvious without labels.",
      "No random letters or fake UI.",
      "Feels warm, not technical.",
    ],
  },
  {
    id: "how-grow",
    priority: "P0",
    status: "redesign",
    title: "How It Works 03: Watch It Grow",
    pageRole: "Tie savings growth to the age-10 milestone.",
    currentAsset: "CSS mini illustration",
    currentUse: "Bars and SOL coin.",
    gap: "The shape is okay, but it needs the child-learning milestone, not just a chart.",
    target: "Growing bars/line with small age-10 marker and child-friendly coin/fund cue.",
    prompt:
      "Simple premium mini illustration for a website step card. A gentle upward savings chart grows from small golden tooth tokens into a soft green progress line, ending at a small age 10 milestone marker. Warm cream background, deep navy, restrained purple, fairy gold, soft green. Icon-like product illustration, no dense UI and no fake text except a tiny 10 marker if needed.",
    acceptance: [
      "Growth and age-10 lesson are visible.",
      "Does not look like stock investment software.",
      "Matches the first two step illustrations.",
    ],
  },
  {
    id: "network-banner",
    priority: "P1",
    status: "replace",
    title: "Celestial Network Banner",
    pageRole: "Make the ledger-backed folklore idea visually real.",
    currentAsset: "/fairy-assets/fairy-network-sky.jpg",
    currentUse: "Story universe band.",
    gap: "Interesting, but still too literal and detached from parent-child product flow.",
    target: "Celestial memory network above homes: fairies and folklore collectors moving through glowing nodes.",
    prompt:
      "Wide cinematic banner showing the Tooth Fairy Network as a celestial memory network. At night, small fairies and folklore collectors fly between glowing nodes above family homes around the world. A glowing tooth sits at the center like a memory being recorded. Magical, organized, modern, not chaotic. Deep navy sky, fairy gold nodes, subtle Solana teal and restrained purple accents. Leave clean text-safe space on the left.",
    acceptance: [
      "Reads as networked ledger without looking like a technical diagram.",
      "Contains motion and magic without clutter.",
      "Wide crop supports homepage banner.",
    ],
  },
  {
    id: "tales-system",
    priority: "P1",
    status: "replace",
    title: "Cultural Tales Thumbnail System",
    pageRole: "Turn stories into a content product parents want to share.",
    currentAsset: "/story-assets/shared/shared-multiple-collectors.jpg",
    currentUse: "Banner plus mixed story thumbnails.",
    gap: "The story assets are useful, but inconsistent in crop, character design, and visual hierarchy.",
    target: "A repeatable story thumbnail system for first 10-15 stories.",
    prompt:
      "Consistent storybook thumbnail for Tooth Fairy Network cultural tales. Use the same premium 3D storybook style as Tanda. Show one child-safe folklore collector or ritual in a culturally specific setting, with a glowing tooth or tiny gold network node as the recurring motif. Warm cinematic lighting, clear subject, no text, no flags unless requested, respectful and not caricatured.",
    acceptance: [
      "Each thumbnail reads as a story, not an icon.",
      "Recurring glowing-tooth/network motif appears subtly.",
      "Cultural specificity is respectful and clear.",
    ],
  },
]

const phases = [
  "Generate 2-3 options for each P0 slot first.",
  "Pick one consistent Tanda and one consistent product UI language.",
  "Replace homepage assets only after selected images pass the acceptance checks.",
  "Then run the final homepage polish and Vercel preview.",
]

export default function VisualSystemPage() {
  return (
    <main className="visual-system">
      <section className="hero">
        <p className="eyebrow">TFN V2 visual production</p>
        <h1>Image slots before image generation.</h1>
        <p>
          This board is the asset game plan. It prevents us from decorating the
          homepage with random images and gives every generated visual a job,
          a prompt, and a quality bar.
        </p>
        <div className="actions">
          <Link href="/toothfairy">Back to homepage</Link>
          <a href="#p0">Review P0 slots</a>
        </div>
      </section>

      <section className="phase-band" aria-label="Production sequence">
        {phases.map((phase, index) => (
          <article key={phase}>
            <span>{index + 1}</span>
            <p>{phase}</p>
          </article>
        ))}
      </section>

      <section className="selected-assets" aria-label="Selected V1 assets">
        <div className="selected-copy">
          <p className="eyebrow">Selected for V1</p>
          <h2>P0 contact sheet is now split into homepage assets.</h2>
          <p>
            These images are not the final brand canon, but they are coherent
            enough for the next deployable review: hero family moment, Tanda,
            keepsake, Smile Fund dashboard, and the three how-it-works visuals.
          </p>
          <Link href="/toothfairy">Review homepage with assets</Link>
        </div>
        <div className="selected-sheet">
          <Image
            src="/toothfairy/visual-system/p0-contact-sheet-v1.png"
            alt="Selected Tooth Fairy Network V1 image contact sheet"
            fill
            sizes="(min-width: 900px) 55vw, 92vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="p0" className="slots">
        {slots.map((slot) => (
          <article key={slot.id} className="slot-card">
            <div className="preview">
              {slot.currentAsset.startsWith("/") ? (
                <Image
                  src={slot.currentAsset}
                  alt=""
                  fill
                  sizes="(min-width: 1100px) 34vw, 92vw"
                  className="object-cover"
                />
              ) : (
                <div className="placeholder">
                  <span>{slot.currentAsset}</span>
                </div>
              )}
              <div className="badges">
                <span>{slot.priority}</span>
                <span className={slot.status}>{slot.status.replace("-", " ")}</span>
              </div>
            </div>

            <div className="copy">
              <p className="slot-id">{slot.id}</p>
              <h2>{slot.title}</h2>
              <dl>
                <div>
                  <dt>Role</dt>
                  <dd>{slot.pageRole}</dd>
                </div>
                <div>
                  <dt>Current gap</dt>
                  <dd>{slot.gap}</dd>
                </div>
                <div>
                  <dt>Target</dt>
                  <dd>{slot.target}</dd>
                </div>
              </dl>
              <div className="prompt">
                <strong>Generation prompt</strong>
                <p>{slot.prompt}</p>
              </div>
              <ul>
                {slot.acceptance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .visual-system {
          --navy: #11234a;
          --ink: #23365f;
          --muted: #687186;
          --purple: #6d45a8;
          --gold: #d8a43c;
          --cream: #fbf7ee;
          --paper: rgba(255, 252, 247, 0.82);
          --border: rgba(178, 151, 107, 0.30);
          min-height: 100vh;
          background:
            radial-gradient(circle at 86% 0%, rgba(216, 164, 60, 0.16), transparent 26rem),
            radial-gradient(circle at 10% 10%, rgba(109, 69, 168, 0.10), transparent 22rem),
            var(--cream);
          color: var(--navy);
          font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
        }

        .hero,
        .phase-band,
        .slots {
          width: min(100% - 40px, 1240px);
          margin: 0 auto;
        }

        .hero {
          padding: 72px 0 36px;
        }

        .eyebrow,
        .slot-id {
          margin: 0;
          color: #b77a11;
          font-size: 0.78rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 820px;
          margin: 0.55rem 0 0;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(3rem, 7vw, 5.4rem);
          line-height: 0.94;
          letter-spacing: 0;
        }

        .hero p:not(.eyebrow) {
          max-width: 760px;
          margin: 1.25rem 0 0;
          color: var(--ink);
          font-size: 1.14rem;
          line-height: 1.62;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.6rem;
        }

        .actions a {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.62);
          color: var(--navy);
          padding: 0 1rem;
          font-weight: 900;
          text-decoration: none;
        }

        .actions a:first-child {
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
        }

        .phase-band {
          display: grid;
          gap: 0.85rem;
          padding: 18px 0 44px;
        }

        .selected-assets {
          display: grid;
          width: min(100% - 40px, 1240px);
          gap: 1rem;
          align-items: center;
          margin: 0 auto 2rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.64);
          padding: 1rem;
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.08);
        }

        .selected-copy h2 {
          margin: 0.35rem 0 0;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: 2.2rem;
          line-height: 1;
          letter-spacing: 0;
        }

        .selected-copy p:not(.eyebrow) {
          margin: 1rem 0 0;
          color: var(--ink);
          line-height: 1.55;
        }

        .selected-copy a {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          margin-top: 1.1rem;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--purple), #8b5cc8);
          color: #fffaf1;
          padding: 0 1rem;
          font-weight: 900;
          text-decoration: none;
        }

        .selected-sheet {
          position: relative;
          min-height: 360px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: #fffaf1;
        }

        .phase-band article {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.64);
          padding: 1rem;
        }

        .phase-band span {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 999px;
          background: var(--gold);
          color: var(--navy);
          font-weight: 950;
        }

        .phase-band p {
          margin: 0;
          color: var(--ink);
          line-height: 1.45;
        }

        .slots {
          display: grid;
          gap: 1.1rem;
          padding-bottom: 72px;
        }

        .slot-card {
          display: grid;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 18px 44px rgba(48, 38, 24, 0.08);
        }

        .preview {
          position: relative;
          min-height: 320px;
          overflow: hidden;
          background: #efe6d5;
        }

        .preview:after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(17, 35, 74, 0.02), rgba(17, 35, 74, 0.22));
          pointer-events: none;
        }

        .placeholder {
          display: grid;
          height: 100%;
          min-height: 320px;
          place-items: center;
          padding: 2rem;
          background:
            linear-gradient(135deg, rgba(109, 69, 168, 0.10), rgba(216, 164, 60, 0.12)),
            #fffaf1;
          color: var(--muted);
          text-align: center;
          font-weight: 900;
        }

        .badges {
          position: absolute;
          left: 1rem;
          top: 1rem;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .badges span {
          border-radius: 999px;
          background: rgba(255, 250, 241, 0.88);
          color: var(--navy);
          padding: 0.35rem 0.6rem;
          font-size: 0.72rem;
          font-weight: 950;
          text-transform: uppercase;
        }

        .badges .replace {
          background: rgba(216, 92, 115, 0.92);
          color: #fffaf1;
        }

        .badges .redesign {
          background: rgba(216, 164, 60, 0.92);
        }

        .copy {
          padding: 1.25rem;
        }

        .copy h2 {
          margin: 0.25rem 0 1rem;
          color: var(--navy);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.65rem);
          line-height: 1;
          letter-spacing: 0;
        }

        dl {
          display: grid;
          gap: 0.75rem;
          margin: 0;
        }

        dt {
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 950;
          text-transform: uppercase;
        }

        dd {
          margin: 0.18rem 0 0;
          color: var(--ink);
          line-height: 1.52;
        }

        .prompt {
          margin-top: 1rem;
          border: 1px solid rgba(109, 69, 168, 0.16);
          border-radius: 8px;
          background: rgba(109, 69, 168, 0.06);
          padding: 1rem;
        }

        .prompt strong {
          display: block;
          color: var(--purple);
          font-size: 0.82rem;
          font-weight: 950;
          text-transform: uppercase;
        }

        .prompt p {
          margin: 0.5rem 0 0;
          color: var(--ink);
          line-height: 1.55;
        }

        ul {
          display: grid;
          gap: 0.5rem;
          margin: 1rem 0 0;
          padding: 0;
          list-style: none;
        }

        li {
          position: relative;
          padding-left: 1.1rem;
          color: var(--ink);
          line-height: 1.42;
        }

        li:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.55rem;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--gold);
        }

        @media (min-width: 760px) {
          .phase-band {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .selected-assets {
            grid-template-columns: 0.8fr 1.2fr;
          }
        }

        @media (min-width: 1040px) {
          .slot-card {
            grid-template-columns: 0.92fr 1.08fr;
          }
        }

        @media (max-width: 680px) {
          .hero,
          .phase-band,
          .selected-assets,
          .slots {
            width: min(100% - 28px, 1240px);
          }

          .hero {
            padding-top: 48px;
          }

          .preview {
            min-height: 250px;
          }

          .selected-sheet {
            min-height: 260px;
          }
        }
      `,
        }}
      />
    </main>
  )
}
