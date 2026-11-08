import Link from 'next/link'
import Image from 'next/image'

import { SATH_CALENDAR_HREF, personalSocialLinks } from '@/lib/social-links'
import styles from './FollowSath.module.css'

export function FollowSath({ profiles = false, showMore = true, title = 'Tech Talk with Sath' }: { profiles?: boolean; showMore?: boolean; title?: string }) {
  return (
    <section id="follow" className={`minimal-section ${styles.section}`} aria-labelledby="follow-title">
      <div className={`minimal-section-heading ${styles.heading}`}>
        <h2 id="follow-title">{title}</h2>
      </div>
      <div className={styles.banner}>
        <a href={SATH_CALENDAR_HREF} className={styles.mark} aria-label="Open Tech Talk with Sath on Luma">
          <Image src="/tech-talk/qr-mark.svg" width={600} height={600} alt="Tech left, Talk above, With right and Sath below a QR code for lu.ma/sath" unoptimized />
        </a>
        <div className={styles.copy}>
          <p>Tech, ideas, and good people. These are my event picks around Toronto. Come say hi.</p>
          <a href={SATH_CALENDAR_HREF} className={styles.cta}>Follow on Luma <span aria-hidden="true">↗</span></a>
          <span className={styles.address}>lu.ma/sath</span>
        </div>
      </div>
      {profiles ? (
        <nav className={styles.profiles} aria-label="Find Sathian online">
          {personalSocialLinks.filter((link) => link.label !== 'Luma').map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="me noopener noreferrer">
              {link.label === 'X' ? 'X · @Sathian' : link.label}<span aria-hidden="true"> ↗</span>
            </a>
          ))}
        </nav>
      ) : showMore ? (
        <p className={styles.more}><Link href="/links" prefetch={false}>Find me online <span aria-hidden="true">↗</span></Link></p>
      ) : null}
    </section>
  )
}
