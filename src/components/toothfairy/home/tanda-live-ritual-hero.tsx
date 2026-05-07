"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./tanda-live-ritual-hero.module.css";

const liveAssetRoot = "/toothfairy/animation/live-hero-v1";
const keepsakePreview = "https://gateway.irys.xyz/Z9_aFKhX6xpU1cZvw0h4u3zfJwhfJ1wiBf72KQWGF5k";
const heroCues = ["Parent-controlled", "Live memory", "Smile Fund"];

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

function ToothMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 76" fill="none" aria-hidden>
      <path
        d="M32 5.5c-10.2 0-18.6 7.7-19.5 18.1-.6 6.5 1.3 12.4 3.2 18.5 1.4 4.6 2 10.9 3.2 17.1.9 4.5 3.2 8.8 6.8 8.8 3.3 0 4.4-4.8 5.1-11.1.3-2.9.8-5.4 1.2-6.7.4 1.3.9 3.8 1.2 6.7.8 6.3 1.9 11.1 5.2 11.1 3.6 0 5.9-4.3 6.8-8.8 1.2-6.2 1.8-12.5 3.2-17.1 1.9-6.1 3.8-12 3.2-18.5C50.6 13.2 42.2 5.5 32 5.5Z"
        fill="url(#liveHeroToothFill)"
        stroke="#d8bd93"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path d="M20 26c6 3.1 17.2 3.7 24 0" stroke="#efdec4" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="liveHeroToothFill" x1="18" y1="8" x2="50" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffefa" />
          <stop offset="0.58" stopColor="#fff4df" />
          <stop offset="1" stopColor="#ead1a8" />
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
            <span>their first digital asset.</span>
          </h1>
          <p>
            A saved keepsake, a first wallet, and a family-funded start.
          </p>
        </div>

        <div className={styles.stage} aria-label="Tanda flies across the hero image and starts a Smile Fund.">
          <div className={styles.familyFrame}>
            <Image
              src="/toothfairy/visual-system/hero-family-v1.png"
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
            <p>Live Memory</p>
            <strong>#FDSR</strong>
            <em>First tooth story</em>
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
            <img src="/toothfairy/animation/layered/piggy-cutout-soft-no-coin.png" alt="" draggable={false} />
            <span className={styles.slotGlow} />
          </div>

          <div className={styles.tanda} aria-hidden>
            <span className={styles.wingGlow} />
            <span className={styles.phoneScreenGlint} />
            <span className={styles.heldCoinToken}>
              <span />
            </span>
            {poses.map(([name, file], index) => (
              <img
                key={file}
                className={`${styles.pose} ${styles[name]}`}
                src={`${liveAssetRoot}/${file}`}
                alt=""
                draggable={false}
                decoding="async"
                fetchPriority={index < 2 ? "high" : "auto"}
                loading={index < 2 ? "eager" : "lazy"}
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

        <div className={styles.heroCues} aria-label="Tooth Fairy Network benefits">
          {heroCues.map((cue) => (
            <span key={cue}>{cue}</span>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/toothfairy/app" className={styles.primaryAction}>
            Create their memory
            <span aria-hidden />
          </Link>
          <Link href="/toothfairy#how-it-works" className={styles.secondaryAction}>
            See how it works
          </Link>
        </div>
      </section>
    </main>
  );
}
