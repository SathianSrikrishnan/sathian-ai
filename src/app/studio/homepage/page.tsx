'use client'

import { useEffect, useState } from 'react'

import {
  LoadState,
  StatusPill,
  StudioPage,
  StudioPageHeader,
} from '@/components/studio/ControlRoom'
import styles from '@/components/studio/control-room.module.css'
import type { StudioHomepageSection } from '@/lib/studio/data'

export default function StudioHomepagePage() {
  const [sections, setSections] = useState<StudioHomepageSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch('/api/studio/homepage')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  function updateSection(id: string, patch: Partial<StudioHomepageSection>) {
    setSections((current) => current.map((section) => section.id === id ? { ...section, ...patch } : section))
  }

  async function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const previous = sections
    const next = [...sections]
    ;[next[index], next[target]] = [next[target], next[index]]
    setSections(next)
    setNotice('')

    const response = await fetch('/api/studio/homepage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'order', ids: next.map((section) => section.id) }),
    })
    if (!response.ok) {
      setSections(previous)
      setNotice('The new section order could not be saved.')
    } else {
      setNotice('Homepage order saved.')
    }
  }

  async function saveSection(section: StudioHomepageSection) {
    setSaving(section.id)
    setNotice('')
    const response = await fetch('/api/studio/homepage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'section',
        id: section.id,
        fields: {
          label: section.label,
          heading: section.heading,
          description: section.description,
          ctaLabel: section.ctaLabel,
          ctaHref: section.ctaHref,
          enabled: section.enabled,
        },
      }),
    })
    setNotice(response.ok ? `Saved ${section.key}.` : 'The homepage section could not be saved.')
    setSaving(null)
  }

  return (
    <StudioPage>
      <StudioPageHeader
        eyebrow="Typed homepage structure"
        title="Move sections, not mystery widgets."
        description="The homepage is a small ordered set of known sections. Copy, visibility, and order are editable; arbitrary HTML and plug-in insertion are not."
      />

      {loading && <LoadState>Loading homepage records…</LoadState>}
      {error && <LoadState>Homepage records are unavailable. The public homepage has not changed.</LoadState>}
      {!loading && !error && sections.length === 0 && <LoadState>No typed homepage sections exist yet.</LoadState>}
      {notice && <LoadState>{notice}</LoadState>}

      <div className={styles.dataList}>
        {sections.map((section, index) => {
          const accessibleName = section.heading || section.key
          return (
            <article key={section.id} className={styles.dataRow}>
              <div className={styles.rowTopline}>
                <div>
                  <p className={styles.sectionLabel}>{String(index + 1).padStart(2, '0')} / {section.type}</p>
                  <h2>{section.key}</h2>
                </div>
                <div className={styles.orderControls}>
                  <StatusPill value={section.enabled ? 'enabled' : 'hidden'} />
                  <button
                    className={styles.smallButton}
                    type="button"
                    aria-label={`Move ${accessibleName} up`}
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                  >
                    ↑ Up
                  </button>
                  <button
                    className={styles.smallButton}
                    type="button"
                    aria-label={`Move ${accessibleName} down`}
                    onClick={() => moveSection(index, 1)}
                    disabled={index === sections.length - 1}
                  >
                    ↓ Down
                  </button>
                </div>
              </div>

              <div className={styles.controlGrid}>
                <label className={styles.control}>
                  <span className={styles.fieldLabel}>Label</span>
                  <input value={section.label ?? ''} onChange={(event) => updateSection(section.id, { label: event.target.value || null })} />
                </label>
                <label className={styles.control}>
                  <span className={styles.fieldLabel}>Heading</span>
                  <input value={section.heading ?? ''} onChange={(event) => updateSection(section.id, { heading: event.target.value || null })} />
                </label>
                <label className={`${styles.control} ${styles.controlWide}`}>
                  <span className={styles.fieldLabel}>Description</span>
                  <textarea value={section.description ?? ''} onChange={(event) => updateSection(section.id, { description: event.target.value || null })} />
                </label>
                <label className={styles.control}>
                  <span className={styles.fieldLabel}>Call-to-action label</span>
                  <input value={section.ctaLabel ?? ''} onChange={(event) => updateSection(section.id, { ctaLabel: event.target.value || null })} />
                </label>
                <label className={styles.control}>
                  <span className={styles.fieldLabel}>Call-to-action link</span>
                  <input value={section.ctaHref ?? ''} onChange={(event) => updateSection(section.id, { ctaHref: event.target.value || null })} />
                </label>
                <label className={styles.control}>
                  <span className={styles.fieldLabel}>Public visibility</span>
                  <select value={section.enabled ? 'enabled' : 'hidden'} onChange={(event) => updateSection(section.id, { enabled: event.target.value === 'enabled' })}>
                    <option value="enabled">Enabled</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </label>
                <div className={styles.control}>
                  <span className={styles.fieldLabel}>Record action</span>
                  <button className={styles.primaryButton} type="button" onClick={() => saveSection(section)} disabled={saving === section.id}>
                    {saving === section.id ? 'Saving…' : 'Save section'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </StudioPage>
  )
}
