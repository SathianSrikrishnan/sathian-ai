import Image from 'next/image'
import Link from 'next/link'
import { HOME_MOMENTS } from '@/content/home-moments'
import styles from './HomeMoments.module.css'

/** Server-rendered, no timers or carousel dependency. Every image stays reachable. */
export function HomeMoments() {
  return (
    <section className={`minimal-section minimal-container ${styles.section}`} aria-labelledby="home-moments-title">
      <div className={styles.heading}>
        <div>
          <h2 id="home-moments-title">Life, work &amp; small beginnings</h2>
          <p>Conversations, music, everyday questions, and things I&apos;m making.</p>
        </div>
        <Link href="/about" prefetch={false} className="minimal-text-link">More about me <span aria-hidden="true">↗</span></Link>
      </div>
      <div className={styles.grid}>
        {HOME_MOMENTS.map((moment, index) => (
          <Link key={moment.src} href={moment.href} prefetch={false} className={styles.card}>
            <span className={styles.media}>
              <Image
                src={moment.src}
                alt={moment.alt}
                fill
                sizes="(max-width: 600px) 44vw, (max-width: 1000px) 29vw, 230px"
                quality={70}
                loading="lazy"
                style={{ objectPosition: moment.position, objectFit: moment.src.includes('/village/') || moment.src.includes('/inside-monkedao/') || moment.src.includes('/proof-assets/') ? 'contain' : 'cover' }}
              />
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </span>
            <span className={styles.caption}>
              <span><strong>{moment.title}</strong><span className={styles.detail}>{moment.detail}</span></span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </span>
          </Link>
        ))}
      </div>
      <p className={styles.note}>Photos, film stills and artwork. Choose a picture to explore the story.</p>
    </section>
  )
}
