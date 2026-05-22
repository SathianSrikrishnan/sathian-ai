import clsx from 'clsx'

import { ToothlightCard } from './ToothlightCard'
import styles from './ProductEntryRead.module.css'

const assetRoot = '/toothfairy/animation/live-hero-v1/'

type ProductEntryReadProps = {
  className?: string
}

export function ProductEntryRead({ className }: ProductEntryReadProps) {
  return (
    <section
      className={clsx(styles.read, className)}
      aria-label="Product Entry Read: a tooth memory becomes a Toothlight"
      data-product-entry-read
    >
      {/* Product Entry Read: tooth-to-coin ritual, shared glow transfer, then phone/photo/drawing to Toothlight. */}
      <div className={styles.stage}>
        <div className={styles.network} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className={styles.ritualSurface} aria-hidden="true">
          <ToothGlyph className={styles.tooth} />
          <div className={styles.wandPath} />
          <div className={styles.sharedGlow} />
          <div className={styles.coin}>SOL</div>
          <div className={styles.piggyBank}>
            <span>Smile Fund</span>
          </div>
        </div>

        <div className={styles.phone} aria-hidden="true">
          <div className={styles.phonePhoto}>
            <ToothGlyph className={styles.phoneTooth} />
            <span className={styles.childMarkOne} />
            <span className={styles.childMarkTwo} />
            <span className={styles.childMarkThree} />
          </div>
          <div className={styles.storyLine}>First tooth. Big smile.</div>
        </div>

        <div className={styles.finishedCard}>
          <ToothlightCard
            title="Kai's Toothlight"
            caption="First tooth. Big smile."
            createdLabel="Saved for later"
            visualState="spark"
            smileFundActive
          />
        </div>

        <img
          src={`${assetRoot}tanda-entry-up.webp`}
          alt=""
          className={clsx(styles.tanda, styles.tandaEntry)}
          aria-hidden="true"
        />
        <img
          src={`${assetRoot}tanda-reach.webp`}
          alt=""
          className={clsx(styles.tanda, styles.tandaReach)}
          aria-hidden="true"
        />
        <img
          src={`${assetRoot}tanda-phone.webp`}
          alt=""
          className={clsx(styles.tanda, styles.tandaPhone)}
          aria-hidden="true"
        />
        <img
          src={`${assetRoot}tanda-carry-coin.webp`}
          alt=""
          className={clsx(styles.tanda, styles.tandaCarry)}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

function ToothGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <path
        d="M32.2 6.7c-9.4 0-17 7.2-17.6 16.6-.4 5.8 1.2 11 3.2 16.4 1.5 4.2 2.1 9.7 2.8 15.4.6 5.3 2.5 10 6 10 3 0 4.1-4.1 4.8-10 .3-2.7.8-5.1 1.1-6.2.4 1.1.9 3.5 1.2 6.2.7 5.9 1.8 10 4.8 10 3.5 0 5.4-4.7 6-10 .7-5.7 1.3-11.2 2.8-15.4 2-5.4 3.6-10.6 3.2-16.4-.7-9.4-8.8-16.6-18.3-16.6Z"
        fill="url(#toothlightEntryToothFill)"
        stroke="url(#toothlightEntryToothStroke)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M21 24.8c5.4 3 16.5 3.4 23.3.1" stroke="#fff9d7" strokeWidth="2.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="toothlightEntryToothFill" x1="18" y1="9" x2="48" y2="67" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.48" stopColor="#fff7df" />
          <stop offset="0.78" stopColor="#f6c95f" />
          <stop offset="1" stopColor="#c98724" />
        </linearGradient>
        <linearGradient id="toothlightEntryToothStroke" x1="19" y1="8" x2="49" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff1af" />
          <stop offset="0.52" stopColor="#d8a43c" />
          <stop offset="1" stopColor="#9c6419" />
        </linearGradient>
      </defs>
    </svg>
  )
}
