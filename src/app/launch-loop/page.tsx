import Link from 'next/link'

import styles from './page.module.css'

export const metadata = {
  title: 'TFN Launch Loop',
  description: 'A capture-ready Tooth Fairy Network launch loop for the certificate to keepsake bank story.',
}

export default function LaunchLoopPage() {
  return (
    <main className={styles.page}>
      <section className={styles.loopShell} aria-labelledby="launch-loop-title">
        <div className={styles.copyPanel}>
          <p className={styles.eyebrow}>Tooth Fairy Network</p>
          <h1 id="launch-loop-title">Tooth fell out tonight?</h1>
          <p>
            Make the proof, save the magic, and let the first tooth story become a Magical Keepsake Bank.
          </p>
          <div className={styles.promiseRow} aria-label="Product promise">
            <span>Free certificate</span>
            <span>Toothlight memory</span>
            <span>Starter coin</span>
          </div>
          <Link className={styles.primaryCta} href="/certificate" data-tfn-event="landing_cta_click">
            Make the free certificate
          </Link>
        </div>

        <div className={styles.stage} aria-label="Animated launch loop">
          <div className={styles.worldLayer} aria-hidden="true" />
          <svg className={styles.lightTrail} viewBox="0 0 900 900" aria-hidden="true">
            <path d="M142 352 C 260 174, 424 228, 486 360 S 612 564, 746 458" />
            <path d="M245 616 C 346 688, 530 697, 706 596" />
          </svg>

          <article className={styles.paperProof}>
            <span>Official Tooth Light Certificate</span>
            <strong>Maya</strong>
            <small>First tooth - Moon glow</small>
          </article>

          <div className={styles.toothlight}>
            <img src="/toothfairy/visual-system/toothlight-keepsake-current.jpg" alt="" />
            <span className={styles.toothlightHalo} aria-hidden="true" />
          </div>

          <div className={styles.tandaCourier} aria-hidden="true">
            <img src="/toothfairy/animation/live-hero-v1/tanda-carry-coin.webp" alt="" />
          </div>

          <span className={styles.coinToken} aria-hidden="true">
            <span />
          </span>

          <div className={styles.piggyBank} aria-hidden="true">
            <span className={styles.bankHalo} />
            <img src="/toothfairy/animation/layered/piggy-cutout-soft-no-coin.png" alt="" />
            <span className={styles.slotGlow} />
            <span className={styles.solMark}>SOL</span>
          </div>

          <div className={styles.loopLabels} aria-hidden="true">
            <span>Paper proof</span>
            <span>Toothlight</span>
            <span>Starter coin</span>
            <span>Family bank</span>
          </div>

          <div className={styles.finalCard}>
            <span>Tonight's keepsake</span>
            <strong>1 tooth story saved</strong>
            <small>Parent-led. Private first. No wallet at bedtime.</small>
          </div>

          <div className={styles.sparkField} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    </main>
  )
}
