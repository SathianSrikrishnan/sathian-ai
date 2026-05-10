import Image from 'next/image';
import styles from './tanda-hero-ritual-stage.module.css';

const assets = {
  heroFamily: '/toothfairy/visual-system/hero-family-v1.png',
  tandaFly: '/toothfairy/animation/hero-pose-pack/tanda-hero-01-rainbow-entry.png',
  tandaHover: '/toothfairy/animation/hero-pose-pack/tanda-hero-02-brake-hover.png',
  tandaReach: '/toothfairy/animation/pose-pack/tanda-02b-reach-down-empty.png',
  tandaCarry: '/toothfairy/animation/hero-pose-pack/tanda-hero-03-carry-down.png',
  tandaPlace: '/toothfairy/animation/hero-pose-pack/tanda-hero-04-place-save.png',
  tandaRetract: '/toothfairy/animation/pose-pack/tanda-03b-hand-retract-empty.png',
  tandaFollow: '/toothfairy/animation/pose-pack/tanda-04-follow-through.png',
  tandaGuideCoin: '/toothfairy/animation/pose-pack/tanda-05-guide-coin.png',
  tandaGuide: '/toothfairy/animation/pose-pack/tanda-05b-guide-down-to-pig.png',
  tandaCelebrate: '/toothfairy/animation/pose-pack/tanda-05c-celebrate-pig-glow.png',
  tandaExit: '/toothfairy/animation/pose-pack/tanda-06-celebrate-exit.png',
  piggyBank: '/toothfairy/animation/layered/piggy-cutout-soft-no-coin.png',
  captureBase: '/toothfairy/animation/base-options/capture-base-a-platform-cropped.png',
};

function ToothMark({ className = '', gradientId }: { className?: string; gradientId: string }) {
  return (
    <svg className={className} viewBox="0 0 64 76" fill="none" aria-hidden>
      <path
        d="M32 5.5c-10.2 0-18.6 7.7-19.5 18.1-.6 6.5 1.3 12.4 3.2 18.5 1.4 4.6 2 10.9 3.2 17.1.9 4.5 3.2 8.8 6.8 8.8 3.3 0 4.4-4.8 5.1-11.1.3-2.9.8-5.4 1.2-6.7.4 1.3.9 3.8 1.2 6.7.8 6.3 1.9 11.1 5.2 11.1 3.6 0 5.9-4.3 6.8-8.8 1.2-6.2 1.8-12.5 3.2-17.1 1.9-6.1 3.8-12 3.2-18.5C50.6 13.2 42.2 5.5 32 5.5Z"
        fill={`url(#${gradientId})`}
        stroke="#d8bd93"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path d="M20 26c6 3.1 17.2 3.7 24 0" stroke="#efdec4" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id={gradientId} x1="18" y1="8" x2="50" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffefa" />
          <stop offset="0.58" stopColor="#fff4df" />
          <stop offset="1" stopColor="#ead1a8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TandaPose({ className, src, alt }: { className: string; src: string; alt: string }) {
  return <img className={`${styles.tandaPose} ${className}`} src={src} alt={alt} draggable={false} />;
}

export default function TandaHeroRitualStage({ forceMotion = false }: { forceMotion?: boolean }) {
  return (
    <section
      className={`${styles.stageShell} ${forceMotion ? styles.forceMotion : ''}`}
      aria-label="Tooth Fairy Network hero ritual animation preview"
    >
      <div className={styles.heroBg} aria-hidden>
        <svg viewBox="0 0 1200 680" preserveAspectRatio="none">
          <path d="M-60 548 C 205 430, 410 445, 612 320 S 1015 106, 1270 214" />
          <path d="M120 612 C 334 486, 536 542, 730 414 S 1014 273, 1210 314" />
        </svg>
      </div>

      <div className={styles.heroGrid}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Hero ritual preview</p>
          <h1>
            A lost tooth becomes
            <span>their first forever memory.</span>
          </h1>
          <p className={styles.lede}>
            Capture the story, invite family to contribute, and start a parent-controlled Smile Fund they can grow into.
          </p>
          <div className={styles.actions}>
            <a href="/toothfairy/app/draw?from=home" className={styles.primaryAction}>
              Create their memory
              <span aria-hidden />
            </a>
            <a href="#hero-ritual-stage" className={styles.secondaryAction}>
              See how it works
            </a>
          </div>
        </div>

        <div id="hero-ritual-stage" className={styles.productStage} aria-label="Animated product preview">
          <div className={styles.familyFrame}>
            <Image
              src={assets.heroFamily}
              alt="A parent and child celebrating a lost tooth"
              fill
              priority
              sizes="(min-width: 1040px) 580px, 92vw"
              className={styles.familyImage}
            />
            <span className={styles.photoWash} aria-hidden />
            <span className={styles.sourceTooth} aria-hidden>
              <ToothMark gradientId="heroRitualSourceToothFill" />
            </span>
          </div>

          <div className={styles.saveNode} aria-hidden>
            <span className={styles.saveHalo} />
            <img className={styles.captureBase} src={assets.captureBase} alt="" draggable={false} />
            <ToothMark className={styles.saveTooth} gradientId="heroRitualSaveToothFill" />
          </div>

          <svg className={styles.outputTrails} viewBox="0 0 1000 680" preserveAspectRatio="none" aria-hidden>
            <path className={styles.pickupTrail} d="M-80 238 C 72 100, 178 154, 250 214 S 234 430, 250 564" />
            <path className={styles.memoryTrail} d="M252 562 C 398 338, 588 220, 742 248" />
            <path className={styles.fundTrail} d="M252 562 C 430 604, 560 598, 696 574" />
            <path className={styles.coinTrail} d="M262 554 C 464 352, 710 326, 842 404" />
          </svg>

          <article className={styles.memoryCard}>
            <div className={styles.memoryPreview} aria-hidden>
              <div className={styles.memoryIllustration}>
                <ToothMark gradientId="heroRitualMemoryCardToothFill" />
                <span className={styles.memoryLock} />
              </div>
            </div>
            <p>Live Memory</p>
            <strong>Saved</strong>
            <span>Live keepsake</span>
          </article>

          <article className={styles.smileCard}>
            <div className={styles.smileCopy}>
              <p>Little Smile Fund</p>
              <strong>$360</strong>
              <span>6 family gifts saved</span>
            </div>
            <div className={styles.smilePreview}>
              <span className={styles.fundSlot} aria-hidden />
              <div className={styles.smileBars} aria-hidden>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>

          <div className={styles.piggyBank} aria-hidden>
            <img src={assets.piggyBank} alt="" draggable={false} />
            <span className={styles.piggyGlow} />
          </div>

          <span className={styles.coin} aria-hidden>
            <span>$</span>
          </span>

          <div className={styles.tandaLayer} aria-hidden>
            <div className={styles.tandaFlight}>
              <TandaPose className={styles.poseFly} src={assets.tandaFly} alt="" />
              <TandaPose className={styles.poseHover} src={assets.tandaHover} alt="" />
              <TandaPose className={styles.poseReach} src={assets.tandaReach} alt="" />
              <TandaPose className={styles.poseCarry} src={assets.tandaCarry} alt="" />
              <TandaPose className={styles.posePlace} src={assets.tandaPlace} alt="" />
              <TandaPose className={styles.poseRetract} src={assets.tandaRetract} alt="" />
              <TandaPose className={styles.poseFollow} src={assets.tandaFollow} alt="" />
              <TandaPose className={styles.poseGuideCoin} src={assets.tandaGuideCoin} alt="" />
              <TandaPose className={styles.poseGuide} src={assets.tandaGuide} alt="" />
              <TandaPose className={styles.poseCelebrate} src={assets.tandaCelebrate} alt="" />
              <TandaPose className={styles.poseExit} src={assets.tandaExit} alt="" />
              <span className={styles.capturePhone} aria-hidden>
                <span />
              </span>
              <span className={styles.heldCoin} aria-hidden>
                <span>$</span>
              </span>
            </div>
          </div>

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
      </div>
    </section>
  );
}
