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
import type { StudioMemoryCard } from '@/lib/studio/data'

function toDateTimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export default function StudioMemoryPage() {
  const [cards, setCards] = useState<StudioMemoryCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch('/api/studio/memory')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setCards(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  function updateCard(id: string, patch: Partial<StudioMemoryCard>) {
    setCards((current) => current.map((card) => card.id === id ? { ...card, ...patch } : card))
  }

  async function saveCard(card: StudioMemoryCard) {
    setSaving(card.id)
    setNotice('')
    const response = await fetch('/api/studio/memory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: card.id,
        status: card.status,
        visibility: card.visibility,
        validUntil: card.validUntil,
      }),
    })
    setNotice(response.ok ? `Saved ${card.title}.` : 'The memory review could not be saved.')
    setSaving(null)
  }

  return (
    <StudioPage>
      <StudioPageHeader
        eyebrow="Reviewed public context"
        title="Public memory, with provenance."
        description="Approve only the facts the public site agent may use. Every card keeps its source, visibility, approval state, and expiry."
      />

      {loading && <LoadState>Loading reviewed public memory…</LoadState>}
      {error && <LoadState>Public memory is unavailable. Nothing has been approved or retired.</LoadState>}
      {!loading && !error && cards.length === 0 && <LoadState>No public-memory cards have been created yet.</LoadState>}
      {notice && <LoadState>{notice}</LoadState>}

      <div className={styles.dataList}>
        {cards.map((card) => (
          <article key={card.id} className={styles.dataRow}>
            <div className={styles.rowTopline}>
              <div>
                <p className={styles.sectionLabel}>{card.slug}</p>
                <h2>{card.title}</h2>
                <div className={styles.meta}>
                  <span>{card.sourceKind}</span>
                  <span>Updated {formatStudioDate(card.updatedAt)}</span>
                </div>
              </div>
              <StatusPill value={card.status} />
            </div>

            {card.summary && <p className={styles.bodyCopy}>{card.summary}</p>}

            <dl className={styles.factGrid}>
              <div className={styles.fact}>
                <dt>Source</dt>
                <dd><code>{card.sourceRef}</code></dd>
              </div>
              <div className={styles.fact}>
                <dt>Approval</dt>
                <dd>{card.approvedAt ? formatStudioDate(card.approvedAt) : 'Not approved'}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Expiry</dt>
                <dd>{formatStudioDate(card.validUntil)}</dd>
              </div>
            </dl>

            <div className={styles.controlGrid}>
              <label className={styles.control}>
                <span className={styles.fieldLabel}>Review status</span>
                <select value={card.status} onChange={(event) => updateCard(card.id, { status: event.target.value as StudioMemoryCard['status'] })}>
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="retired">Retired</option>
                </select>
              </label>
              <label className={styles.control}>
                <span className={styles.fieldLabel}>Visibility</span>
                <select value={card.visibility} onChange={(event) => updateCard(card.id, { visibility: event.target.value as StudioMemoryCard['visibility'] })}>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </label>
              <label className={styles.control}>
                <span className={styles.fieldLabel}>Valid until</span>
                <input
                  type="datetime-local"
                  value={toDateTimeLocal(card.validUntil)}
                  onChange={(event) => updateCard(card.id, { validUntil: event.target.value ? new Date(event.target.value).toISOString() : null })}
                />
              </label>
              <div className={styles.control}>
                <span className={styles.fieldLabel}>Review action</span>
                <button className={styles.primaryButton} type="button" onClick={() => saveCard(card)} disabled={saving === card.id}>
                  {saving === card.id ? 'Saving…' : 'Save review'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </StudioPage>
  )
}
