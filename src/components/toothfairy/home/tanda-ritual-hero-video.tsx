import styles from './tanda-ritual-hero-video.module.css';
import { tandaRitualAssets } from './tanda-ritual-assets';

type TandaRitualHeroVideoProps = {
  className?: string;
  controls?: boolean;
};

export default function TandaRitualHeroVideo({
  className = '',
  controls = false,
}: TandaRitualHeroVideoProps) {
  return (
    <figure
      className={`${styles.heroVideo} ${className}`}
      aria-label="Tanda saves a tooth story and starts a tiny gift in the Smile Fund piggy bank."
    >
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        controls={controls}
        preload="metadata"
        poster={tandaRitualAssets.poster}
      >
        <source src={tandaRitualAssets.webm} type="video/webm" />
        <source src={tandaRitualAssets.mp4} type="video/mp4" />
      </video>

      <img
        className={styles.reducedMotionPoster}
        src={tandaRitualAssets.poster}
        alt=""
      />
    </figure>
  );
}
