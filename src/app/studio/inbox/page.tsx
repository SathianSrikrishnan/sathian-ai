'use client'

import { useEffect, useState } from 'react'

import {
  LoadState,
  StatusPill,
  StudioPage,
  StudioPageHeader,
  formatStudioDate,
} from '@/components/studio/ControlRoom'
import styles from '@/components/studio/control-room.module.css'
import type { StudioInboxItem } from '@/lib/studio/data'

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

export default function StudioInboxPage() {
  const [items, setItems] = useState<StudioInboxItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/studio/inbox')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <StudioPage>
      <StudioPageHeader
        eyebrow="Visitor intake"
        title="Inbox with receipts."
        description="Read-only operational visibility for messages that visitors explicitly asked the site agent to pass along."
      />

      {loading && <LoadState>Loading receipts and delivery state…</LoadState>}
      {error && <LoadState>The inbox is unavailable. No delivery state has been changed.</LoadState>}
      {!loading && !error && items.length === 0 && <LoadState>No visitor intake is waiting here.</LoadState>}

      <div className={styles.dataList}>
        {items.map((item) => (
          <article key={item.id} className={styles.dataRow}>
            <div className={styles.rowTopline}>
              <div>
                <p className={styles.sectionLabel}>Receipt {item.receipt}</p>
                <h2>{item.displayName || 'Anonymous visitor'}</h2>
                <div className={styles.meta}>
                  <span>{formatStudioDate(item.createdAt)}</span>
                  <span>{item.kind}</span>
                  {item.replyEmail && <span>{item.replyEmail}</span>}
                </div>
              </div>
              <StatusPill value={item.status} />
            </div>

            <p className={styles.bodyCopy}>{item.message}</p>

            <dl className={styles.factGrid}>
              <div className={styles.fact}>
                <dt>Delivery state</dt>
                <dd>{item.delivery ? <StatusPill value={item.delivery.status} /> : 'No outbox event'}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Delivery attempts</dt>
                <dd>{item.delivery?.attempts ?? 0}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Retention until</dt>
                <dd>{formatStudioDate(item.retentionUntil)}</dd>
              </div>
            </dl>

            <div className={styles.attachmentList} aria-label="Attachment quarantine state">
              <span className={styles.fieldLabel}>Attachment quarantine</span>
              {item.attachments.length === 0 && <span className={styles.meta}>No attachments</span>}
              {item.attachments.map((attachment) => (
                <div key={attachment.id} className={styles.attachmentRow}>
                  <span>{attachment.filename}</span>
                  <span>{attachment.contentType} · {formatBytes(attachment.byteSize)}</span>
                  <StatusPill value={attachment.status} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </StudioPage>
  )
}
