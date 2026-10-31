import styles from './GiftPresentation.module.css'
export function TrustpilotReviewStrip() {
  return <aside className={styles.reviewStrip} aria-label="Share your experience" data-trustpilot-strip><a href="https://www.trustpilot.com/review/toothfairy.network" target="_blank" rel="noopener noreferrer">Share your experience on Trustpilot <span aria-hidden="true">&#8599;</span></a><p>Reviews are optional. If your gift was free, please say so.</p></aside>
}
