'use client'

import { useEffect, useState, type FormEvent } from 'react'

import {
  LoadState,
  StatusPill,
  StudioPage,
  StudioPageHeader,
  formatStudioDate,
} from '@/components/studio/ControlRoom'
import styles from '@/components/studio/control-room.module.css'
import type { StudioBuildNote } from '@/lib/studio/data'
import type { BuildNoteInput } from '@/lib/studio/records'

const EMPTY_NOTE: BuildNoteInput = {
  title: '',
  slug: '',
  project: '',
  date: new Date().toISOString().slice(0, 10),
  whatChanged: '',
  whatLearned: '',
  nextStep: '',
  status: 'draft',
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function StudioBuildNotesPage() {
  const [notes, setNotes] = useState<StudioBuildNote[]>([])
  const [draft, setDraft] = useState<BuildNoteInput>(EMPTY_NOTE)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  async function loadNotes() {
    const response = await fetch('/api/studio/build-notes')
    if (!response.ok) throw new Error('Build notes unavailable')
    const data = await response.json()
    setNotes(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    loadNotes()
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  function updateDraft<Key extends keyof BuildNoteInput>(key: Key, value: BuildNoteInput[Key]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function editNote(note: StudioBuildNote) {
    setEditingId(note.id)
    setDraft({
      title: note.title,
      slug: note.slug,
      project: note.project,
      date: note.date,
      whatChanged: note.whatChanged,
      whatLearned: note.whatLearned,
      nextStep: note.nextStep,
      status: note.status,
    })
    setNotice('')
  }

  function resetEditor() {
    setEditingId(null)
    setDraft({ ...EMPTY_NOTE, date: new Date().toISOString().slice(0, 10) })
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setNotice('')
    const response = await fetch('/api/studio/build-notes', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...draft } : draft),
    })

    if (response.ok) {
      await loadNotes()
      setNotice(editingId ? 'Build note updated.' : 'Build note created.')
      resetEditor()
    } else {
      const body = await response.json().catch(() => null)
      setNotice(body?.error || 'The build note could not be saved.')
    }
    setSaving(false)
  }

  return (
    <StudioPage>
      <StudioPageHeader
        eyebrow="Building in public"
        title="A dated record of the work."
        description="Every note keeps the same useful structure: what changed, what the work taught you, and the next concrete move."
      />

      {loading && <LoadState>Loading build notes…</LoadState>}
      {error && <LoadState>Build notes are unavailable. Nothing has been published.</LoadState>}
      {notice && <LoadState>{notice}</LoadState>}

      <div className={styles.splitLayout}>
        <section aria-labelledby="build-note-list-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>Archive</p>
              <h2 id="build-note-list-heading">Build notes</h2>
            </div>
            <p>{notes.length} records</p>
          </div>

          {!loading && !error && notes.length === 0 && <LoadState>No build notes yet.</LoadState>}
          <div className={styles.dataList}>
            {notes.map((note) => (
              <article key={note.id} className={styles.dataRow}>
                <div className={styles.rowTopline}>
                  <div>
                    <p className={styles.sectionLabel}>{note.project}</p>
                    <h3>{note.title}</h3>
                    <div className={styles.meta}><span>{formatStudioDate(note.date)}</span></div>
                  </div>
                  <StatusPill value={note.status} />
                </div>
                <dl className={styles.noteStructure}>
                  <div><dt>What changed</dt><dd>{note.whatChanged}</dd></div>
                  <div><dt>What I learned</dt><dd>{note.whatLearned}</dd></div>
                  <div><dt>Next</dt><dd>{note.nextStep}</dd></div>
                </dl>
                <button className={styles.secondaryButton} type="button" onClick={() => editNote(note)}>Edit note</button>
              </article>
            ))}
          </div>
        </section>

        <form className={styles.editorPanel} onSubmit={submit}>
          <p className={styles.sectionLabel}>{editingId ? 'Editing record' : 'New record'}</p>
          <h2>{editingId ? 'Update build note' : 'Add build note'}</h2>
          <div className={styles.controlGrid}>
            <label className={`${styles.control} ${styles.controlWide}`}>
              <span className={styles.fieldLabel}>Title</span>
              <input
                required
                value={draft.title}
                onChange={(event) => {
                  const title = event.target.value
                  setDraft((current) => ({
                    ...current,
                    title,
                    slug: editingId || current.slug ? current.slug : slugify(title),
                  }))
                }}
              />
            </label>
            <label className={styles.control}>
              <span className={styles.fieldLabel}>Project</span>
              <input required value={draft.project} onChange={(event) => updateDraft('project', event.target.value)} />
            </label>
            <label className={styles.control}>
              <span className={styles.fieldLabel}>Date</span>
              <input required type="date" value={draft.date} onChange={(event) => updateDraft('date', event.target.value)} />
            </label>
            <label className={`${styles.control} ${styles.controlWide}`}>
              <span className={styles.fieldLabel}>Slug</span>
              <input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} onChange={(event) => updateDraft('slug', slugify(event.target.value))} />
            </label>
            <label className={`${styles.control} ${styles.controlWide}`}>
              <span className={styles.fieldLabel}>What changed</span>
              <textarea required value={draft.whatChanged} onChange={(event) => updateDraft('whatChanged', event.target.value)} />
            </label>
            <label className={`${styles.control} ${styles.controlWide}`}>
              <span className={styles.fieldLabel}>What I learned</span>
              <textarea required value={draft.whatLearned} onChange={(event) => updateDraft('whatLearned', event.target.value)} />
            </label>
            <label className={`${styles.control} ${styles.controlWide}`}>
              <span className={styles.fieldLabel}>Next</span>
              <textarea required value={draft.nextStep} onChange={(event) => updateDraft('nextStep', event.target.value)} />
            </label>
            <label className={styles.control}>
              <span className={styles.fieldLabel}>Status</span>
              <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value as BuildNoteInput['status'])}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>
          <div className={styles.buttonRow}>
            <button className={styles.primaryButton} type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save build note'}</button>
            {editingId && <button className={styles.secondaryButton} type="button" onClick={resetEditor}>Cancel edit</button>}
          </div>
        </form>
      </div>
    </StudioPage>
  )
}
