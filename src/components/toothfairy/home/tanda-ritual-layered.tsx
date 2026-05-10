'use client';

import Image from 'next/image';
import styles from './tanda-ritual-layered.module.css';

function StoryToothIcon({
  className = '',
  gradientId,
}: {
  className?: string;
  gradientId: string;
}) {
  return (
    <svg className={className} viewBox="0 0 74 84" aria-hidden="true" role="presentation">
      <path
        d="M36.7 6.4c9.8-5.5 24.6 1 27.7 13.6 2.8 11.3-3.5 24.9-7.2 35.2-2.5 7-3.5 20.2-11.1 20.7-5.4.4-4.2-13.5-9.6-13.5-5.2 0-4.8 13.5-10.5 13.1-7.9-.5-8.6-13.1-11.2-20.2C10.8 44.7 4.6 31.1 7.5 19.9 10.8 7.2 26.8 1 36.7 6.4Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M21.7 15.3c5.9-4.2 13.8 1.2 15 1.9 5.4-4.7 13.3-5.4 18.4-.2"
        fill="none"
        stroke="rgba(255,255,255,.78)"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <defs>
        <radialGradient id={gradientId} cx="32%" cy="22%" r="82%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#fff4ce" />
          <stop offset="100%" stopColor="#d9a94f" />
        </radialGradient>
      </defs>
    </svg>
  );
}

type TandaRitualLayeredProps = {
  className?: string;
};

export default function TandaRitualLayered({
  className = '',
}: TandaRitualLayeredProps) {
  return (
    <section
      className={`${styles.ritual} ${className}`}
      aria-label="Layered animation of Tanda saving a tooth story and starting a tiny gift."
    >
      <div className={styles.sky} aria-hidden="true">
        <span className={styles.cloudOne} />
        <span className={styles.cloudTwo} />
        <span className={styles.cloudThree} />
      </div>

      <div className={styles.sparkField} aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className={styles.trail} aria-hidden="true" />
      <div className={styles.pedestal} aria-hidden="true">
        <span />
      </div>

      <div className={styles.tooth} aria-hidden="true">
        <svg viewBox="0 0 74 84" role="presentation">
          <path
            d="M36.7 6.4c9.8-5.5 24.6 1 27.7 13.6 2.8 11.3-3.5 24.9-7.2 35.2-2.5 7-3.5 20.2-11.1 20.7-5.4.4-4.2-13.5-9.6-13.5-5.2 0-4.8 13.5-10.5 13.1-7.9-.5-8.6-13.1-11.2-20.2C10.8 44.7 4.6 31.1 7.5 19.9 10.8 7.2 26.8 1 36.7 6.4Z"
            fill="url(#toothFill)"
          />
          <path
            d="M22.4 14.3c5.9-4.5 13.8 1.6 14.3 2.1 5.3-4.7 13.3-5.6 18.4-.4"
            fill="none"
            stroke="rgba(255,255,255,.72)"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <defs>
            <radialGradient id="toothFill" cx="32%" cy="22%" r="82%">
              <stop offset="0%" stopColor="#fffef8" />
              <stop offset="48%" stopColor="#fff4ce" />
              <stop offset="100%" stopColor="#e6b95f" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className={styles.memoryCard} aria-hidden="true">
        <StoryToothIcon className={styles.cardToothIcon} gradientId="cardToothFill" />
        <p>TOOTH STORY</p>
        <span />
        <span />
        <span />
        <i />
      </div>

      <div className={styles.vault} aria-hidden="true">
        <div className={styles.vaultGlass} />
        <div className={styles.vaultDoor}>
          <StoryToothIcon className={styles.vaultToothIcon} gradientId="vaultToothFill" />
          <p>TOOTH STORY</p>
          <span />
          <span />
          <span />
          <i />
        </div>
        <div className={styles.vaultLock} />
      </div>

      <div className={styles.coin} aria-hidden="true">$</div>

      <figure className={styles.piggy}>
        <Image
          src="/toothfairy/animation/layered/piggy-cutout-soft-no-coin.png"
          alt=""
          fill
          sizes="(min-width: 1000px) 360px, 40vw"
          className={styles.sprite}
        />
      </figure>

      <div className={styles.piggyGlow} aria-hidden="true" />

      <figure className={`${styles.tanda} ${styles.tandaWithTooth}`}>
        <Image
          src="/toothfairy/animation/layered/tanda-cutout-soft.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1000px) 300px, 42vw"
          className={styles.sprite}
        />
      </figure>

      <figure className={`${styles.tanda} ${styles.tandaAfterDrop}`}>
        <Image
          src="/toothfairy/animation/layered/tanda-cutout-soft-no-tooth.png"
          alt=""
          fill
          sizes="(min-width: 1000px) 300px, 42vw"
          className={styles.sprite}
        />
      </figure>

      <p className="sr-only">
        Tanda carries a glowing tooth, turns it into a protected Tooth Story,
        and sends a tiny gift into a glowing piggy bank.
      </p>
    </section>
  );
}
