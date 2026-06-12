import type { CSSProperties } from "react";
import Image from "next/image";
import { contributionDoor, futureKeeperDoors, openKeeperDoors, toothlightGalleryMemories } from "@/data/toothfairy";
import styles from "./tanda-live-ritual-hero.module.css";

const liveAssetRoot = "/toothfairy/animation/live-hero-v1";
const liveAssetVersion = "asset-fix-2";
const keepsakePreview = "/toothfairy/visual-system/toothlight-keepsake-current.jpg";
const keepsakePreviewFallback = "/toothfairy/visual-system/nft-keepsake-v1.png";

const liveMemories = toothlightGalleryMemories;

const steps = [
  {
    eyebrow: "01",
    title: "Capture the moment",
    body: "Save the tooth photo, drawing, and child's short story while it is fresh.",
    accent: "gold",
    image: liveMemories[3].image,
    alt: liveMemories[3].alt,
    badge: "Photo + child story",
    fit: "cover",
    position: "center",
    variant: "capture",
  },
  {
    eyebrow: "02",
    title: "Time-lock your note and gift",
    body: "Write the future message and connect the Smile Fund for their 10th birthday.",
    accent: "coral",
    image: "/toothfairy/visual-system/smile-dashboard-v1.png",
    alt: "Smile Fund dashboard with an age 10 unlock milestone",
    badge: "Opens at age 10",
    note: "For your 10th birthday...",
    gift: "Smile Fund gift",
    fit: "contain",
    position: "center",
    variant: "age10",
  },
  {
    eyebrow: "03",
    title: "Invite their circle",
    body: "Let grandparents, family, and trusted people add notes, love, or gifts under parent control.",
    accent: "teal",
    image: "/toothfairy/visual-system/invite-family-v1.png",
    alt: "Family members adding gifts around a glowing Toothlight keepsake",
    badge: "Family can add",
    handoff: "Parent controlled",
    fit: "cover",
    position: "center",
    variant: "handoff",
  },
  {
    eyebrow: "04",
    title: "Help them grow into it",
    body: "Start a simple learning track so they understand the story, the gift, and the basics before handoff.",
    accent: "green",
    image: "/toothfairy/visual-system/watch-grow-v1.png",
    alt: "A simple growth chart leading to an age 10 milestone",
    badge: "Learning track",
    lesson: "Ready when they are",
    fit: "cover",
    position: "center",
    variant: "learn",
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

const gatewayDoorPositions = [
  { x: 28, y: 70, scale: 1.06 },
  { x: 38, y: 67, scale: 0.98 },
  { x: 48, y: 70, scale: 1.08 },
  { x: 58, y: 66, scale: 0.98 },
  { x: 68, y: 70, scale: 1.06 },
  { x: 42, y: 81, scale: 0.98 },
  { x: 58, y: 81, scale: 0.98 },
] as const;

const futureGatewayPositions = [
  { x: 20, y: 54, scale: 0.78 },
  { x: 79, y: 54, scale: 0.78 },
  { x: 30, y: 43, scale: 0.7 },
  { x: 69, y: 42, scale: 0.7 },
  { x: 49, y: 35, scale: 0.64 },
  { x: 15, y: 65, scale: 0.68 },
  { x: 84, y: 66, scale: 0.68 },
  { x: 39, y: 30, scale: 0.58 },
  { x: 61, y: 30, scale: 0.58 },
] as const;

const heroArtifactPositions = [
  { x: 52, y: 7, scale: 0.58, rotate: 5 },
  { x: 91, y: 21, scale: 0.56, rotate: 8 },
  { x: 81, y: 84, scale: 0.64, rotate: -7 },
  { x: 50, y: 88, scale: 0.52, rotate: 7 },
  { x: 95, y: 54, scale: 0.5, rotate: -8 },
] as const;

const heroArtifactMemories = [
  liveMemories[6],
  liveMemories[15],
  liveMemories[20],
  liveMemories[24],
  liveMemories[27],
] as const;

const storyToothlightPositions = [
  { x: 13, y: 35, scale: 0.58 },
  { x: 18, y: 51, scale: 0.64 },
  { x: 22, y: 66, scale: 0.58 },
  { x: 29, y: 78, scale: 0.66 },
  { x: 33, y: 30, scale: 0.54 },
  { x: 39, y: 47, scale: 0.58 },
  { x: 45, y: 84, scale: 0.62 },
  { x: 49, y: 34, scale: 0.56 },
  { x: 54, y: 57, scale: 0.64 },
  { x: 59, y: 76, scale: 0.54 },
  { x: 64, y: 29, scale: 0.58 },
  { x: 68, y: 48, scale: 0.64 },
  { x: 73, y: 67, scale: 0.56 },
  { x: 79, y: 38, scale: 0.62 },
  { x: 83, y: 80, scale: 0.58 },
  { x: 88, y: 54, scale: 0.54 },
  { x: 15, y: 78, scale: 0.5 },
  { x: 91, y: 28, scale: 0.48 },
] as const;

const storyToothlightMemories = [
  liveMemories[0],
  liveMemories[1],
  liveMemories[3],
  liveMemories[4],
  liveMemories[6],
  liveMemories[7],
  liveMemories[12],
  liveMemories[14],
  liveMemories[15],
  liveMemories[17],
  liveMemories[18],
  liveMemories[19],
  liveMemories[20],
  liveMemories[21],
  liveMemories[22],
  liveMemories[23],
  liveMemories[26],
  liveMemories[27],
] as const;

const gatewayCameos = [
  {
    id: "kkachi",
    label: "Kkachi listens",
    image: "/story-assets/korea/v2/kkachi-story-card.png",
    x: 76,
    y: 17,
    scale: 0.9,
    rotate: 3,
  },
  {
    id: "perez",
    label: "Perez hurries",
    image: "/story-assets/ratoncito-perez/v2/rp3-frame-15-race-to-room.png",
    x: 21,
    y: 18,
    scale: 0.82,
    rotate: -4,
  },
] as const;

const contributionDoorPosition = { x: 50, y: 88, scale: 1.02 } as const;

const gatewayDoorThemes = [
  "gatewayDoorTanda",
  "gatewayDoorViking",
  "gatewayDoorPerez",
  "gatewayDoorKkachi",
  "gatewayDoorWaraba",
  "gatewayDoorDaga",
  "gatewayDoorAnna",
] as const;

const gatewayDoorStyle = (
  accent: string,
  index: number,
  position: { x: number; y: number; scale: number },
) => ({
  "--door-accent": accent,
  "--door-index": String(index),
  "--door-x": `${position.x}%`,
  "--door-y": `${position.y}%`,
  "--door-scale": String(position.scale),
}) as CSSProperties;

const gatewayMemoryStyle = (
  index: number,
  position: { x: number; y: number; scale: number },
) => ({
  "--memory-index": String(index),
  "--memory-x": `${position.x}%`,
  "--memory-y": `${position.y}%`,
  "--memory-scale": String(position.scale),
}) as CSSProperties;

const heroArtifactStyle = (
  index: number,
  position: { x: number; y: number; scale: number; rotate: number },
) => ({
  "--artifact-index": String(index),
  "--artifact-x": `${position.x}%`,
  "--artifact-y": `${position.y}%`,
  "--artifact-scale": String(position.scale),
  "--artifact-rotate": `${position.rotate}deg`,
}) as CSSProperties;

const gatewayCameoStyle = (
  index: number,
  cameo: { x: number; y: number; scale: number; rotate: number },
) => ({
  "--cameo-index": String(index),
  "--cameo-x": `${cameo.x}%`,
  "--cameo-y": `${cameo.y}%`,
  "--cameo-scale": String(cameo.scale),
  "--cameo-rotate": `${cameo.rotate}deg`,
}) as CSSProperties;

const gatewayDoorClassName = (index: number) => {
  const theme = gatewayDoorThemes[index] ?? gatewayDoorThemes[0];
  return `${styles.gatewayDoor} ${styles[theme]}`;
};

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
        <div className={styles.heroArtifacts} aria-hidden>
          {heroArtifactMemories.map((memory, index) => (
            <span
              key={memory.id}
              className={styles.heroArtifact}
              style={heroArtifactStyle(index, heroArtifactPositions[index])}
            >
              <img src={memory.image} alt="" draggable={false} />
              <small>TL-{String(memory.reportNumber).padStart(3, "0")}</small>
            </span>
          ))}
        </div>

        <div className={styles.copy}>
          <h1>
            Turn a lost tooth{" "}
            <span>into a future asset.</span>
          </h1>
          <p>
            A Toothlight keeps the photo, story, note, and gift together so your child can grow into it by their 10th birthday.
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
          <a href="/toothlight/start?from=home" className={styles.primaryAction}>
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
            Four small steps{" "}
            <span className={styles.howTitleLine}>toward their 10th birthday.</span>
          </h2>
          <span>
            Capture the moment now. Time-lock your note and gift. Let family add to it. Then help your child learn what they are receiving before you hand it over.
          </span>
        </div>

        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.title} className={`${styles.stepCard} ${styles[step.accent]}`}>
              <div className={styles.stepMedia}>
                {step.variant === "capture" ? (
                  <div className={styles.sourceStep}>
                    <img src={step.image} alt={step.alt} draggable={false} />
                    <span className={styles.stepBadge}>{step.badge}</span>
                  </div>
                ) : step.variant === "age10" ? (
                  <div className={styles.ageTenStep}>
                    <img src={step.image} alt={step.alt} draggable={false} />
                    <span className={styles.stepBadge}>{step.badge}</span>
                    <div className={styles.ageTenNote}>
                      <span>Future note</span>
                      <p>{step.note}</p>
                    </div>
                    <div className={styles.ageTenGift}>
                      <span aria-hidden />
                      <strong>{step.gift}</strong>
                    </div>
                  </div>
                ) : step.variant === "handoff" ? (
                  <div className={styles.handoffStep}>
                    <img src={step.image} alt={step.alt} draggable={false} />
                    <span className={styles.stepBadge}>{step.badge}</span>
                    <div className={styles.handoffNote}>
                      <span>{step.handoff}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.learnStep}>
                    <img src={step.image} alt={step.alt} draggable={false} />
                    <span className={styles.stepBadge}>{step.badge}</span>
                    <div className={styles.learnNote}>
                      <span>{step.lesson}</span>
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

      <section id="toothlight-gallery" className={styles.liveProof} aria-label="Toothlight gallery">
        <div className={styles.liveProofIntro}>
          <p>Toothlight time capsules</p>
          <h2>Toothlight gallery</h2>
          <span>Tooth Fairy Moments saved for the Future</span>
        </div>
        <div className={styles.liveRailViewport}>
          <div className={styles.liveRail}>
            {liveMemories.map((memory) => (
              <article
                key={memory.id}
                className={styles.liveMemoryCard}
                aria-label={`${memory.title} Toothlight memory preview`}
              >
                <img src={memory.image} alt={memory.alt} draggable={false} />
                <span>Saved {memory.date}</span>
                <h3>{memory.title}</h3>
                <em>&ldquo;{memory.story}&rdquo;</em>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.storyWorld} aria-label="Children's Tooth Fairy Network story gateway">
        <div className={styles.networkShell}>
          <div className={styles.networkIntro}>
            <p>Tanda's Network</p>
            <h2>Every Toothlight has a place in Tanda's world.</h2>
            <span>
              The story world turns a real tooth photo, drawing, and family note into a path your child can follow as the Tooth Fairy Network grows around them.
            </span>
          </div>

          <div className={styles.gatewayScene} aria-label="A vast story world with open and future tooth tradition doors">
            <Image
              src="/story-assets/network/story-world-gateway-v1.png"
              alt="Tanda floating above a vast night sky network of glowing tooth story doors"
              fill
              sizes="(min-width: 1180px) 1180px, 100vw"
              className={styles.gatewayImage}
            />
            <span className={styles.gatewayShade} aria-hidden />
            <svg className={styles.gatewayThreads} viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden>
              <path d="M244 396 C 352 330, 440 360, 514 426 S 678 488, 818 386" />
              <path d="M310 504 C 428 452, 530 534, 614 468 S 760 370, 942 418" />
              <path d="M382 276 C 456 218, 560 240, 620 302 S 758 330, 876 244" />
              <path d="M172 484 C 290 600, 420 616, 602 570 S 854 562, 1038 472" />
              <path
                className={styles.gatewayValuePulse}
                d="M982 650 C 850 594, 760 556, 624 492 S 382 424, 236 318"
              />
              <circle className={styles.gatewayNodeA} cx="244" cy="396" r="5" />
              <circle className={styles.gatewayNodeB} cx="514" cy="426" r="6" />
              <circle className={styles.gatewayNodeC} cx="818" cy="386" r="5" />
              <circle className={styles.gatewayNodeD} cx="624" cy="492" r="5.5" />
            </svg>

            <div className={styles.gatewayDoorLayer} aria-label="Open story doors">
              {openKeeperDoors.map((door, index) => {
                const position = gatewayDoorPositions[index] ?? gatewayDoorPositions[0];

                return (
                  <a
                    key={door.id}
                    href={door.href}
                    className={gatewayDoorClassName(index)}
                    style={gatewayDoorStyle(door.accent, index, position)}
                    aria-label={`Read ${door.title}`}
                    title={`${door.title}: ${door.objectName}`}
                  >
                    <span className={styles.gatewayDoorGlow} />
                    <span className={styles.gatewayDoorCharm} />
                    <span className={styles.gatewayDoorNumber}>{index + 1}</span>
                    <span className={styles.gatewayDoorPreview}>
                      <Image
                        src={door.image}
                        alt=""
                        fill
                        sizes="148px"
                      />
                    </span>
                    <span className={styles.gatewayDoorText}>
                      <small>{door.region}</small>
                      <strong>{door.title}</strong>
                    </span>
                  </a>
                );
              })}
            </div>

            <div className={styles.futureGatewayLayer} aria-label="Future story doors">
              {futureKeeperDoors.slice(0, futureGatewayPositions.length).map((door, index) => {
                const position = futureGatewayPositions[index];

                return (
                  <span
                    key={door.id}
                    className={styles.futureGatewayDoor}
                    style={gatewayDoorStyle(door.accent, index, position)}
                    aria-label={`${door.title} is listening`}
                  >
                    <span>{door.region}</span>
                  </span>
                );
              })}
            </div>

            <div className={styles.gatewayCameoLayer} aria-label="Story keepers moving through Tanda's world">
              {gatewayCameos.map((cameo, index) => (
                <span
                  key={cameo.id}
                  className={styles.gatewayCameo}
                  style={gatewayCameoStyle(index, cameo)}
                  aria-label={cameo.label}
                >
                  <img src={cameo.image} alt="" draggable={false} />
                  <small>{cameo.label}</small>
                </span>
              ))}
            </div>

            <div className={styles.gatewayToothlightLayer} aria-label="Real Toothlights inside Tanda's Network">
              {storyToothlightMemories.map((memory, index) => {
                const position = storyToothlightPositions[index];

                return (
                  <span
                    key={memory.id}
                    className={styles.gatewayToothlightNode}
                    style={gatewayMemoryStyle(index, position)}
                    aria-label={`${memory.title} in Tanda's Network`}
                  >
                    <img src={memory.image} alt="" draggable={false} />
                    <small>TL-{String(memory.reportNumber).padStart(3, "0")}</small>
                  </span>
                );
              })}
            </div>

            <a
              href={contributionDoor.href}
              className={styles.gatewayContributionDoor}
              style={gatewayDoorStyle(contributionDoor.accent, 10, contributionDoorPosition)}
              aria-label={contributionDoor.title}
            >
              <span>?</span>
              <strong>Your family's door</strong>
            </a>

            <div className={styles.gatewayLegend}>
              <p>The first paths are open.</p>
              <span>Follow the thread from story to Toothlight.</span>
              <a href="/toothfairy/stories">Open the story map</a>
            </div>

          </div>

          <div className={styles.gatewayStoryRail} aria-label="The first open story doors">
            {openKeeperDoors.map((door, index) => (
              <a
                key={door.id}
                href={door.href}
                className={styles.gatewayStoryChip}
                style={gatewayDoorStyle(door.accent, index, gatewayDoorPositions[index] ?? gatewayDoorPositions[0])}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{door.keeper}</strong>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
