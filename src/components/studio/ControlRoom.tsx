import type { ReactNode } from 'react'

import styles from './control-room.module.css'

export function StudioPage({ children }: { children: ReactNode }) {
  return <main className={styles.page}>{children}</main>
}

export function StudioPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.pageDescription}>{description}</p>
      </div>
      {action && <div className={styles.headerAction}>{action}</div>}
    </header>
  )
}

export function LoadState({ children }: { children: ReactNode }) {
  return <div className={styles.loadState}>{children}</div>
}

export function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase()
  const tone =
    normalized === 'approved' || normalized === 'published' || normalized === 'delivered'
      ? styles.statusGood
      : normalized === 'failed' || normalized === 'rejected' || normalized === 'dead_letter'
        ? styles.statusBad
        : normalized === 'quarantined' || normalized === 'pending' || normalized === 'draft'
          ? styles.statusCaution
          : ''

  return <span className={`${styles.statusPill} ${tone}`}>{value.replaceAll('_', ' ')}</span>
}

export function formatStudioDate(value: string | null | undefined) {
  if (!value) return 'Not set'
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value
  return new Date(normalized).toLocaleString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
