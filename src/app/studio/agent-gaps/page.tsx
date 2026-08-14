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
import type { StudioAgentKnowledgeGap } from '@/lib/studio/data'

export default function StudioAgentGapsPage() {
  const [gaps, setGaps] = useState<StudioAgentKnowledgeGap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch('/api/studio/agent-gaps')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setGaps(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  function updateGap(id: string, patch: Partial<StudioAgentKnowledgeGap>) {
    setGaps((current) => current.map((gap) => gap.id === id ? { ...gap, ...patch } : gap))
  }

  async function saveGap(gap: StudioAgentKnowledgeGap) {
    setSaving(gap.id)
    setNotice('')
    const response = await fetch('/api/studio/agent-gaps', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: gap.id,
        status: gap.status,
        operatorNote: gap.operatorNote,
      }),
    })
    setNotice(response.ok ? `Saved ${gap.caseId}.` : 'The gap review could not be saved.')
    setSaving(null)
  }

  return (
    <StudioPage>
      <StudioPageHeader
        eyebrow="Site-agent release gate"
        title="Knowledge gaps, not visitor transcripts."
        description="Triage sanitized evaluation failures by case ID, expected public facts, source, and release severity. No conversation text is stored here."
      />

      {loading && <LoadState>Loading agent gaps…</LoadState>}
      {error && <LoadState>Agent gaps are unavailable. No review state has changed.</LoadState>}
      {!loading && !error && gaps.length === 0 && <LoadState>No open evaluation gaps. The latest synced gate is clean.</LoadState>}
      {notice && <LoadState>{notice}</LoadState>}

      <div className={styles.dataList}>
        {gaps.map((gap) => (
          <article key={gap.id} className={styles.dataRow}>
            <div className={styles.rowTopline}>
              <div>
                <p className={styles.sectionLabel}>{gap.caseId} / {gap.category}</p>
                <h2>{gap.failedChecks.join(', ') || 'Evaluation mismatch'}</h2>
                <div className={styles.meta}>
                  <span>{gap.datasetVersion}</span>
                  <span>Last seen {formatStudioDate(gap.lastSeenAt)}</span>
                  <span>{gap.occurrenceCount} occurrence{gap.occurrenceCount === 1 ? '' : 's'}</span>
                </div>
              </div>
              <div className={styles.meta}>
                <StatusPill value={gap.severity} />
                <StatusPill value={gap.status} />
              </div>
            </div>

            <dl className={styles.factGrid}>
              <div className={styles.fact}>
                <dt>Expected public facts</dt>
                <dd>{gap.expectedFacts.length > 0 ? gap.expectedFacts.join(' · ') : 'None required'}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Expected public sources</dt>
                <dd>{gap.expectedSources.length > 0 ? gap.expectedSources.join(' · ') : 'None required'}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Receipt</dt>
                <dd><code>{gap.sourceReceipt}</code></dd>
              </div>
            </dl>

            <div className={styles.controlGrid}>
              <label className={styles.control}>
                <span className={styles.fieldLabel}>Triage status</span>
                <select
                  value={gap.status}
                  onChange={(event) => updateGap(gap.id, { status: event.target.value as StudioAgentKnowledgeGap['status'] })}
                >
                  <option value="open">Open</option>
                  <option value="in_review">In review</option>
                  <option value="resolved">Resolved</option>
                  <option value="wont_fix">Won&apos;t fix</option>
                </select>
              </label>
              <label className={styles.control}>
                <span className={styles.fieldLabel}>Operator note</span>
                <textarea
                  value={gap.operatorNote ?? ''}
                  maxLength={1000}
                  rows={3}
                  onChange={(event) => updateGap(gap.id, { operatorNote: event.target.value || null })}
                />
              </label>
              <div className={styles.control}>
                <span className={styles.fieldLabel}>Review action</span>
                <button
                  className={styles.primaryButton}
                  type="button"
                  disabled={saving === gap.id}
                  onClick={() => saveGap(gap)}
                >
                  {saving === gap.id ? 'Saving…' : 'Save review'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </StudioPage>
  )
}
