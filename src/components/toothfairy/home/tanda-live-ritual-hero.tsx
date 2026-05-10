import Image from "next/image";
import styles from "./tanda-live-ritual-hero.module.css";

const liveAssetRoot = "/toothfairy/animation/live-hero-v1";
const liveAssetVersion = "asset-fix-2";
const keepsakePreview = "https://gateway.irys.xyz/Z9_aFKhX6xpU1cZvw0h4u3zfJwhfJ1wiBf72KQWGF5k";

const steps = [
  {
    eyebrow: "01",
    title: "Capture",
    body: "Tooth, smile, or tiny note.",
    accent: "gold",
    image: "/toothfairy/visual-system/save-moment-v1.png",
    alt: "A tooth, camera, and child drawing arranged as a keepsake activity",
    fit: "cover",
    position: "center",
  },
  {
    eyebrow: "02",
    title: "Create the Toothlight",
    body: "Turn the moment into a keepsake.",
    accent: "coral",
    image: "/toothfairy/visual-system/tanda-guide-v1.png",
    alt: "Tanda guiding a magical Toothlight moment",
    fit: "contain",
    position: "center",
  },
  {
    eyebrow: "03",
    title: "Save for later",
    body: "Parents keep control until the child is ready.",
    accent: "teal",
    image: "/toothfairy/visual-system/watch-grow-v1.png",
    alt: "A gentle savings chart growing from tooth tokens",
    fit: "cover",
    position: "center",
  },
] as const;

const storyCards = [
  {
    chapter: "Chapter 1",
    title: "Tanda and the Night the Network Woke",
    body: "A skipped bedtime note wakes the Toothlight and sends Tanda looking for the other keepers.",
    image: "/story-assets/tanda/v2/s1-frame-01-cover.png",
    alt: "Tanda flying above a moonlit town as glowing teeth connect the first Tooth Fairy Network routes",
    href: "/toothfairy/story/tanda",
    position: "center",
  },
  {
    chapter: "Chapter 2",
    title: "Tanda Fae and the First Tooth Fee",
    body: "A father by the sea turns the first tooth fee into a promise to notice what a child outgrows.",
    image: "/story-assets/viking-origin/v2/s2-frame-01-cover-v3.png",
    alt: "Young Tanda holding a glowing tooth beside her father in a Norse shipyard",
    href: "/toothfairy/story/viking-origin",
    position: "center",
  },
  {
    chapter: "Chapter 3",
    title: "The Toothlight Treaty",
    body: "A child with two true family traditions asks Perez and Tanda not to make her choose.",
    image: "/story-assets/ratoncito-perez/v2/rp3-frame-01-two-doors.png",
    alt: "Tanda and Ratoncito Perez meeting on a Madrid rooftop under moonlight",
    href: "/toothfairy/story/ratoncito-perez",
    position: "center 38%",
  },
] as const;

const poses = [
  ["entryUp", "tanda-entry-up.webp"],
  ["entryDown", "tanda-entry-down.webp"],
  ["reach", "tanda-reach.webp"],
  ["grab", "tanda-grab.webp"],
  ["lift", "tanda-lift-tooth.webp"],
  ["phone", "tanda-phone.webp"],
  ["type", "tanda-type.webp"],
  ["carryCoin", "tanda-carry-coin.webp"],
  ["releaseCoin", "tanda-release-coin.webp"],
  ["wave", "tanda-wave.webp"],
  ["exit", "tanda-exit.webp"],
] as const;

const priorityPoses = new Set(["entryUp", "entryDown", "reach", "grab", "lift"]);

function ToothMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 76" fill="none" aria-hidden>
      <path
        d="M32 5.5c-10.2 0-18.6 7.7-19.5 18.1-.6 6.5 1.3 12.4 3.2 18.5 1.4 4.6 2 10.9 3.2 17.1.9 4.5 3.2 8.8 6.8 8.8 3.3 0 4.4-4.8 5.1-11.1.3-2.9.8-5.4 1.2-6.7.4 1.3.9 3.8 1.2 6.7.8 6.3 1.9 11.1 5.2 11.1 3.6 0 5.9-4.3 6.8-8.8 1.2-6.2 1.8-12.5 3.2-17.1 1.9-6.1 3.8-12 3.2-18.5C50.6 13.2 42.2 5.5 32 5.5Z"
        fill="url(#liveHeroToothFill)"
        stroke="#c7963e"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path d="M20 26c6 3.1 17.2 3.7 24 0" stroke="#fff3bd" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="liveHeroToothFill" x1="18" y1="8" x2="50" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffefa" />
          <stop offset="0.42" stopColor="#fff2c6" />
          <stop offset="0.72" stopColor="#eec25b" />
          <stop offset="1" stopColor="#b9781b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TandaLiveRitualHero() {
  return (
    <main className={styles.page}>
      <section
        className={styles.hero}
        aria-label="Tooth Fairy Network homepage ritual preview"
        data-tanda-live-ritual-hero
      >
        <div className={styles.copy}>
          <h1>
            Turn a lost tooth into
            <span>a Toothlight they can grow into.</span>
          </h1>
          <p>
            Save the tooth story, drawing, and family note in one parent-controlled keepsake. The Smile Fund can come later, when the gift path is ready.
          </p>
        </div>

        <div className={styles.stage} aria-label="Tanda flies across the hero image and starts a Smile Fund.">
          <div className={styles.familyFrame}>
            <Image
              src="/toothfairy/visual-system/hero-family-v1-no-spark.png"
              alt="A parent and child celebrating a lost tooth"
              fill
              priority
              sizes="(min-width: 1024px) 680px, 94vw"
              className={styles.familyImage}
            />
            <span className={styles.photoWash} aria-hidden />
            <span className={styles.emptyPinchPatch} aria-hidden />
            <span className={styles.sourceTooth} aria-hidden>
              <ToothMark />
            </span>
          </div>

          <svg className={styles.flightTrails} viewBox="0 0 1000 625" preserveAspectRatio="none" aria-hidden>
            <path className={styles.entryTrail} d="M-120 178 C 18 92, 122 106, 198 176 S 250 214, 296 214" />
            <path className={styles.depositTrail} d="M288 218 C 410 180, 586 226, 790 418" />
          </svg>

          <article className={styles.memoryCard}>
            <div className={styles.memoryArt}>
              <img src={keepsakePreview} alt="" draggable={false} />
            </div>
            <p>Toothlight</p>
            <strong>#FDSR</strong>
            <em>First forever memory</em>
          </article>

          <article className={styles.smileCard}>
            <div>
              <p>Little Smile Fund</p>
              <strong>$360</strong>
              <em>Example family gift preview</em>
            </div>
            <div className={styles.fundBars} aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>

          <div className={styles.piggyBank} aria-hidden>
            <span className={styles.pigGlow} />
            <img
              src={`/toothfairy/animation/layered/piggy-cutout-soft-no-coin.png?v=${liveAssetVersion}`}
              alt=""
              draggable={false}
            />
            <span className={styles.slotGlow} />
          </div>

          <div className={styles.tanda} aria-hidden>
            <span className={styles.wingGlow} />
            <span className={styles.phoneScreenGlint} />
            <span className={styles.heldCoinToken}>
              <span />
            </span>
            {poses.map(([name, file]) => (
              <img
                key={file}
                className={`${styles.pose} ${styles[name]}`}
                src={`${liveAssetRoot}/${file}?v=${liveAssetVersion}`}
                alt=""
                draggable={false}
                decoding="async"
                fetchPriority={priorityPoses.has(name) ? "high" : "auto"}
                loading="eager"
              />
            ))}
          </div>

          <span className={styles.phoneGlow} aria-hidden />
          <span className={styles.coinAura} aria-hidden />
          <span className={styles.coinToken} aria-hidden>
            <span />
          </span>
          <div className={styles.sparkles} aria-hidden>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={styles.actions}>
          <a href="/toothfairy/app/draw?from=home" className={styles.primaryAction}>
            Create a Toothlight
            <span aria-hidden />
          </a>
          <a href="#how-it-works" className={styles.secondaryAction}>
            See how it works
          </a>
        </div>
      </section>

      <section id="how-it-works" className={styles.howItWorks} aria-label="How Tooth Fairy Network works">
        <div className={styles.howIntro}>
          <p>How it works</p>
          <h2>
            A tiny ritual.
            <span className={styles.howTitleLine}>Then a memory parents control.</span>
          </h2>
          <span>
            Capture it. Add the magic. Save it until they are ready.
          </span>
        </div>

        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.title} className={`${styles.stepCard} ${styles[step.accent]}`}>
              <div className={styles.stepMedia}>
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 900px) 31vw, 92vw"
                  style={{ objectFit: step.fit, objectPosition: step.position }}
                />
              </div>
              <div className={styles.stepCopy}>
                <p>{step.eyebrow}</p>
                <h3>{step.title}</h3>
                <span>{step.body}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storyWorld} aria-label="Tooth Fairy Network stories">
        <div className={styles.storyIntro}>
          <p>The first shelf</p>
          <h2>Start with Tanda, then meet the keepers around the world.</h2>
        </div>

        <div className={styles.storyStrip}>
          {storyCards.map((story) => (
            <a key={story.title} href={story.href} className={styles.storyCard}>
              <div className={styles.storyImage}>
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 900px) 360px, 92vw"
                  style={{ objectPosition: story.position }}
                />
              </div>
              <span>{story.chapter}</span>
              <h3>{story.title}</h3>
              <p>{story.body}</p>
            </a>
          ))}
        </div>

        <a href="/toothfairy/stories" className={styles.storyAction}>
          Read the first shelf
        </a>
      </section>
    </main>
  );
}
