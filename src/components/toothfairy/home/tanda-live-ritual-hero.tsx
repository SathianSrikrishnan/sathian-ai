import Image from "next/image";
import styles from "./tanda-live-ritual-hero.module.css";

const liveAssetRoot = "/toothfairy/animation/live-hero-v1";
const liveAssetVersion = "asset-fix-2";
const keepsakePreview = "/toothfairy/visual-system/toothlight-keepsake-current.jpg";
const keepsakePreviewFallback = "/toothfairy/visual-system/nft-keepsake-v1.png";

const liveMemories = [
  {
    label: "Network memory",
    title: "Robot-dog wish",
    story: "I want the Tooth Fairy to get me a robot dog.",
    image: "https://gateway.irys.xyz/5MqKjoYrB96GubwaIZ48NqUGvvstgyVGsNHgsnRDe1s",
    alt: "A real lost tooth resting in a hand with colorful child-drawn marks and a heart",
    href: "/toothfairy/keepsake/D2KhUfrDSs6ejGcfNEXfaYQMxPz4SH5Rd87h9ZUsGMSa",
    date: "May 5",
  },
  {
    label: "Network memory",
    title: "Winged tooth",
    story: "A tiny tooth turned into a bright memory.",
    image: "https://gateway.irys.xyz/4dqch-6Vbsir96QiADF8HMX1oAbE5l9carQbsInPRdU",
    alt: "A glowing lost tooth with golden wings against a dark starry background",
    href: "/toothfairy/keepsake/3cdg3LwvSnvWdDcpJTMvQuGdeZuhBNwzCvs5kR6wqjUK",
    date: "May 15",
  },
  {
    label: "Network memory",
    title: "Wiggly for two weeks",
    story: "It was wiggling for two weeks.",
    image: "https://gateway.irys.xyz/_asoyYnN6mYDzOpC_tJ3taAONF_zkM7lFEgQdx7pbnk",
    alt: "A child holding a baby tooth with blue, green, and orange drawings added over the photo",
    href: "/toothfairy/keepsake/F8pf5qkNMkSL5pBdrfk88piukq65MLTjsnYyXYBix62E",
    date: "May 5",
  },
  {
    label: "Network memory",
    title: "Dad helped draw it",
    story: "My tooth fell out today and I made a drawing with my dad to remember it.",
    image: "https://gateway.irys.xyz/sL-S3rxY5B6a88ACRwGxDxep-Pc-aBsyuYpXifa5HTg",
    alt: "A child's drawing of a tooth, sun, green hills, and a small house on paper",
    href: "/toothfairy/keepsake/5DffDLpt4B4Gwm61P6msyHWHgC5RzD8RToYY5nQovVhw",
    date: "May 11",
  },
  {
    label: "Network memory",
    title: "Dinner became the story",
    story: "The spicy dinner became part of the memory.",
    image: "https://gateway.irys.xyz/JBOR9kEFDukXKcy88c3ABC48__Y0OqBemvExPl0jKuo",
    alt: "A storybook portrait of a parent and two children with gold wings and a moonlit frame",
    href: "/toothfairy/keepsake/AjLMXmNP9A6hfzQuTYLG1drU5JppViraCf8NwGmngK1r",
    date: "May 13",
  },
  {
    label: "Network memory",
    title: "First handoff",
    story: "A small tooth, held in the palm, ready to become a keepsake.",
    image: "https://gateway.irys.xyz/YVyiBp-3gPSG8PeUoCpdyKp1c91Vmqt40-UDBf-x8f0",
    alt: "A small baby tooth resting in the palm of a hand with a soft illustrated finish",
    href: "/toothfairy/keepsake/5hsP9CctgecT2bYqdhuLM3Kn2s3JzoVp8iZUWNLFvvfi",
    date: "May 11",
  },
  {
    label: "Network memory",
    title: "First drawing",
    story: "I hope this drawing stays with us.",
    image: "https://gateway.irys.xyz/U3ZfRDlna4_hx1wWXKcSLTaTNNkr8R4y8PKDJvQpUNU",
    alt: "A childlike drawing with gold and silver shapes on warm paper",
    href: "/toothfairy/keepsake/7SuoSiQMBuB8dLC5kswfQoVCcq2ArSdRTMG6ErJDqVzN",
    date: "May 8",
  },
  {
    label: "Network memory",
    title: "Tooth and note",
    story: "The marks stay part of the memory.",
    image: "https://gateway.irys.xyz/zYkvv_5tbHmSkAByJu0zJYoPP-ZfQW3qhwVyC8uWCSU",
    alt: "A storybook-style image of a tooth beside childlike handwriting and a gold shape",
    href: "/toothfairy/keepsake/9MFFKi4jdzZ1wcFGAbifEKx57okbhCJ1pSrQwDjuSGYk",
    date: "Apr 24",
  },
] as const;

const featuredMemory = liveMemories[0];

const steps = [
  {
    eyebrow: "01",
    title: "Start with the real thing",
    body: "Photo, drawing, or note.",
    accent: "gold",
    image: liveMemories[5].image,
    alt: liveMemories[5].alt,
    fit: "cover",
    position: "center",
    variant: "source",
  },
  {
    eyebrow: "02",
    title: "Make a Toothlight",
    body: "Custom AI frames polish their creativity.",
    accent: "coral",
    image: featuredMemory.image,
    alt: featuredMemory.alt,
    fit: "cover",
    position: "center",
    variant: "toothlight",
  },
  {
    eyebrow: "03",
    title: "Add the story details",
    body: "Connect the Smile Fund and share with family.",
    accent: "teal",
    image: liveMemories[2].image,
    alt: liveMemories[2].alt,
    fit: "cover",
    position: "center",
    variant: "saved",
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
    title: "Tanda Fae and the Tooth Fee",
    body: "A father by the sea turns a small tooth into proof of growing up.",
    image: "/story-assets/viking-origin/v2/s2-frame-01-cover-v3.png",
    alt: "Young Tanda holding a glowing tooth beside her father in a Norse shipyard",
    href: "/toothfairy/story/viking-origin",
    position: "center",
  },
  {
    chapter: "Chapter 3",
    title: "Ratoncito Perez and the Toothlight Treaty",
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
        d="M32.4 6.8c-9.2 0-16.8 7-17.5 16.4-.4 5.9 1.2 11.1 3.1 16.5 1.5 4.1 2.1 9.8 2.8 15.5.6 5.2 2.5 10 6 10 3 0 4.1-4.2 4.8-10 .3-2.8.8-5.2 1.1-6.3.4 1.1.9 3.5 1.2 6.3.7 5.8 1.8 10 4.8 10 3.6 0 5.4-4.8 6-10 .7-5.7 1.3-11.4 2.8-15.5 1.9-5.4 3.5-10.6 3.1-16.5-.7-9.4-8.7-16.4-18.2-16.4Z"
        fill="url(#liveHeroToothFill)"
        stroke="url(#liveHeroToothStroke)"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path d="M20.6 24.7c5.5 3 16.6 3.5 23.7.1" stroke="#fff9d7" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M23.5 18.8c3.2-3.8 9.1-5.5 14.6-3.9" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" opacity=".9" />
      <path d="M45.3 36.9c-1 3-1.7 6.4-2.1 10.1" stroke="#f3c762" strokeWidth="1.8" strokeLinecap="round" opacity=".72" />
      <defs>
        <linearGradient id="liveHeroToothFill" x1="18" y1="9" x2="48" y2="67" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.46" stopColor="#fff8dd" />
          <stop offset="0.76" stopColor="#f3c762" />
          <stop offset="1" stopColor="#c98924" />
        </linearGradient>
        <linearGradient id="liveHeroToothStroke" x1="19" y1="8" x2="49" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff1af" />
          <stop offset="0.52" stopColor="#d8a43c" />
          <stop offset="1" stopColor="#9c6419" />
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
            Now turn a lost tooth{" "}
            <span>into your child's first digital wallet.</span>
          </h1>
          <p>
            Start with a Toothlight memory. Parents control the wallet, the timing, and the family link.
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
            <svg
              className={styles.networkBackdrop}
              viewBox="0 0 640 640"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path d="M306 72 C 412 18, 512 62, 616 38" />
              <path d="M336 534 C 426 438, 478 382, 610 332" />
              <path d="M520 92 C 456 184, 466 272, 522 376 S 492 524, 376 604" />
              <circle cx="306" cy="72" r="4.4" />
              <circle cx="430" cy="40" r="3.8" />
              <circle cx="520" cy="74" r="5" />
              <circle cx="616" cy="38" r="5.2" />
              <circle cx="336" cy="534" r="4.2" />
              <circle cx="466" cy="408" r="5.4" />
              <circle cx="610" cy="332" r="4.5" />
              <circle cx="522" cy="376" r="3.8" />
              <circle cx="376" cy="604" r="4.4" />
            </svg>
            <span className={styles.photoWash} aria-hidden />
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
              <img
                src={keepsakePreview}
                alt=""
                draggable={false}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = keepsakePreviewFallback;
                }}
              />
            </div>
            <p>Toothlight</p>
            <strong>#FDSR</strong>
            <em>First forever memory</em>
          </article>

          <article className={styles.smileCard}>
            <div>
              <p>Little Smile Fund</p>
              <strong>$360</strong>
              <em>6 family gifts saved</em>
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
            Make a time capsule
            <span className={styles.howTitleLine}>for a lost tooth.</span>
          </h2>
          <span>
            Start with the real moment. Add a little magic. Share the finished Toothlight with family.
          </span>
        </div>

        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.title} className={`${styles.stepCard} ${styles[step.accent]}`}>
              <div className={styles.stepMedia}>
                {step.variant === "source" ? (
                  <div className={styles.sourceStep}>
                    <img src={step.image} alt={step.alt} draggable={false} />
                    <span>Photo or drawing</span>
                  </div>
                ) : step.variant === "toothlight" ? (
                  <div className={styles.toothlightStep}>
                    <img className="real-tooth" src={step.image} alt={step.alt} draggable={false} />
                    <span>AI-polished Toothlight</span>
                  </div>
                ) : (
                  <div className={styles.savedStep}>
                    <img src={step.image} alt={step.alt} draggable={false} />
                    <div className={styles.savedStory}>
                      <span>In their words</span>
                      <p>&ldquo;{liveMemories[2].story}&rdquo;</p>
                    </div>
                  </div>
                )}
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

      <section className={styles.liveProof} aria-label="Recent Toothlight memories">
        <div className={styles.liveProofIntro}>
          <p>Toothlight time capsules</p>
          <h2>A few already made.</h2>
          <span>Public examples from the live product.</span>
        </div>
        <div className={styles.liveRailViewport}>
          <div className={styles.liveRail}>
            {[...liveMemories, ...liveMemories].map((memory, index) => (
              <a
                key={`${memory.href}-${index}`}
                href={memory.href}
                className={styles.liveMemoryCard}
                aria-label={`Open ${memory.title} Toothlight memory`}
              >
                <img src={memory.image} alt={memory.alt} draggable={false} />
                <span>Saved {memory.date}</span>
                <h3>{memory.title}</h3>
                <em>&ldquo;{memory.story}&rdquo;</em>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.storyWorld} aria-label="Tooth Fairy Network stories">
        <div className={styles.storyIntro}>
          <p>Stories from around the world</p>
          <h2>Tanda is building the Tooth Fairy Network.</h2>
          <span>
            Start with Tanda, then follow the old promises behind lost-tooth traditions from every corner of the world.
          </span>
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
          Explore global tooth traditions
        </a>
      </section>
    </main>
  );
}
