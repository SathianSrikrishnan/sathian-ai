'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  LoadState,
  StatusPill,
  StudioPage,
  StudioPageHeader,
  formatStudioDate,
} from '@/components/studio/ControlRoom'
import styles from '@/components/studio/control-room.module.css'
import type { StudioSubscriber } from '@/lib/studio/data'

export default function StudioSubscribersPage() {
  const [items, setItems] = useState<StudioSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetch('/api/studio/subscribers')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(
    () => items.filter((item) => item.email.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query],
  )
  const subscribed = items.filter((item) => item.status === 'subscribed').length
  const confirmed = items.filter((item) => item.confirmationSentAt).length

  async function changeStatus(item: StudioSubscriber, status: StudioSubscriber['status']) {
    setSavingId(item.id)
    const response = await fetch('/api/studio/subscribers', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: item.id, status }),
    })
    if (response.ok) {
      setItems((current) => current.map((row) => row.id === item.id
        ? { ...row, status, unsubscribedAt: status === 'unsubscribed' ? new Date().toISOString() : null }
        : row))
    }
    setSavingId(null)
  }

  return (
    <StudioPage>
      <StudioPageHeader
        eyebrow="Audience"
        title="Subscribers, with consent."
        description="A private operating view of signups, confirmation delivery, consent source, and list status. Every manual change is written to the Studio audit trail."
      />

      <dl className={styles.factGrid} style={{ marginTop: 28 }}>
        <div className={styles.fact}><dt>Total records</dt><dd>{items.length}</dd></div>
        <div className={styles.fact}><dt>Subscribed</dt><dd>{subscribed}</dd></div>
        <div className={styles.fact}><dt>Confirmation delivered</dt><dd>{confirmed}</dd></div>
      </dl>

      <div className={styles.control} style={{ marginTop: 24 }}>
        <label className={styles.fieldLabel} htmlFor="subscriber-search">Find an email</label>
        <input
          id="subscriber-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search subscribers"
        />
      </div>

      {loading && <LoadState>Loading subscriber records…</LoadState>}
      {error && <LoadState>Subscribers are unavailable. No list state has been changed.</LoadState>}
      {!loading && !error && filtered.length === 0 && <LoadState>No matching subscribers.</LoadState>}

      <div className={styles.dataList}>
        {filtered.map((item) => (
          <article key={item.id} className={styles.dataRow}>
            <div className={styles.rowTopline}>
              <div>
                <p className={styles.sectionLabel}>{item.firstSource}</p>
                <h2>{item.email}</h2>
                <div className={styles.meta}>
                  <span>Joined {formatStudioDate(item.createdAt)}</span>
                  <span>Last seen {formatStudioDate(item.lastSeenAt)}</span>
                </div>
              </div>
              <StatusPill value={item.status} />
            </div>

            <dl className={styles.factGrid}>
              <div className={styles.fact}>
                <dt>Consent</dt>
                <dd>{item.consentNoticeVersion}<br />{formatStudioDate(item.consentedAt)}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Confirmation</dt>
                <dd>
                  {item.confirmationSentAt
                    ? `Delivered ${formatStudioDate(item.confirmationSentAt)}`
                    : item.confirmationErrorCode
                      ? `Failed: ${item.confirmationErrorCode}`
                      : 'Not delivered'}
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Last source</dt>
                <dd>{item.lastSource}</dd>
              </div>
            </dl>

            <div className={styles.buttonRow}>
              {item.status !== 'subscribed' && (
                <button className={styles.smallButton} disabled={savingId === item.id} onClick={() => changeStatus(item, 'subscribed')}>
                  Restore subscription
                </button>
              )}
              {item.status !== 'unsubscribed' && (
                <button className={styles.smallButton} disabled={savingId === item.id} onClick={() => changeStatus(item, 'unsubscribed')}>
                  Unsubscribe
                </button>
              )}
              {item.status !== 'bounced' && (
                <button className={styles.smallButton} disabled={savingId === item.id} onClick={() => changeStatus(item, 'bounced')}>
                  Mark bounced
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </StudioPage>
  )
}
