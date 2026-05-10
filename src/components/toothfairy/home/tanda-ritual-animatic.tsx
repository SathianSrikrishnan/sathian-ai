'use client';

import Image from 'next/image';
import styles from './tanda-ritual-animatic.module.css';

const scenes = [
  {
    src: '/toothfairy/animation/keepsake-studio-frames/frame-clean-1.png',
    alt: 'Tanda flies in holding a glowing lost tooth.',
  },
  {
    src: '/toothfairy/animation/keepsake-studio-frames/frame-clean-2.png',
    alt: 'Tanda presents the tooth above a glowing keepsake pedestal.',
  },
  {
    src: '/toothfairy/animation/keepsake-studio-frames/frame-clean-3.png',
    alt: 'A Tooth Story card forms around the saved tooth.',
  },
  {
    src: '/toothfairy/animation/keepsake-studio-frames/frame-clean-4.png',
    alt: 'The Tooth Story card is protected inside a glowing memory vault.',
  },
  {
    src: '/toothfairy/animation/keepsake-studio-frames/frame-clean-5.png',
    alt: 'A dollar coin arcs from the protected story toward a smiling piggy bank.',
  },
  {
    src: '/toothfairy/animation/keepsake-studio-frames/frame-clean-6-v2.png',
    alt: 'Tanda, the memory vault, and the glowing piggy bank shine together after the gift lands inside.',
  },
];

type TandaRitualAnimaticProps = {
  className?: string;
};

export default function TandaRitualAnimatic({
  className = '',
}: TandaRitualAnimaticProps) {
  return (
    <section
      className={`${styles.animatic} ${className}`}
      aria-label="Tanda Keepsake Studio motion preview"
    >
      <div className={styles.stage}>
        <div className={styles.ambient} aria-hidden="true" />
        <div className={styles.orbitOne} aria-hidden="true" />
        <div className={styles.orbitTwo} aria-hidden="true" />
        <div className={styles.coinGlint} aria-hidden="true" />

        {scenes.map((scene, index) => (
          <figure
            className={`${styles.scene} ${styles[`scene${index + 1}`]}`}
            key={scene.src}
          >
            <Image
              src={scene.src}
              alt=""
              fill
              sizes="(min-width: 1200px) 1120px, 96vw"
              className={styles.backdrop}
              aria-hidden="true"
            />
            <Image
              src={scene.src}
              alt={scene.alt}
              fill
              priority={index < 2}
              sizes="(min-width: 1200px) 1040px, 92vw"
              className={styles.frame}
            />
          </figure>
        ))}

        <div className={styles.sparkles} aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>

      <p className="sr-only">
        Tanda flies in with a glowing tooth, saves it as a protected Tooth Story,
        and starts a tiny gift in the Smile Fund piggy bank.
      </p>
    </section>
  );
}
