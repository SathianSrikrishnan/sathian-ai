'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'

import { trackToothlightEvent } from '@/lib/toothlight/client/product-analytics'
import styles from './TfnCapsuleMvp.module.css'

type TfnCapsuleMvpVariant =
  | 'landing'
  | 'certificate'
  | 'create'
  | 'pricing'
  | 'privacy'
  | 'terms'
  | 'capsule'
  | 'unlock'
  | 'family-note'

type CreateStep = 'parent' | 'moment' | 'child' | 'reveal'
type CapsuleLoadState = 'idle' | 'loading' | 'ready' | 'missing'
type MissionChoice = 'tonight' | 'future' | 'family'

type CapsuleDraft = {
  parentEmail: string
  consentAccepted: boolean
  childNickname: string
  toothDate: string
  toothType: string
  parentNote: string
  childPromptAnswer: string
  capsuleStyle: string
  fairyStamp: string
  unlockDate: string
  photoPreviewUrl: string | null
  capsuleId: string | null
}

const toothTypes = ['First tooth', 'Front tooth', 'Wiggly tooth', 'Mystery tooth', 'Other']

const capsuleStyles = [
  { id: 'moon-glow', label: 'Moon glow' },
  { id: 'paper-seal', label: 'Paper seal' },
  { id: 'star-window', label: 'Star window' },
]

const fairyStamps = [
  { id: 'north-star', label: 'North Star' },
  { id: 'silver-wing', label: 'Silver Wing' },
  { id: 'bedtime-route', label: 'Bedtime Route' },
]

const childPrompts = [
  'How did your tooth fall out?',
  'What should future-you open later?',
  'What wish should the fairy carry?',
]

const childAnswerChips = [
  'I was brave tonight.',
  'I want to remember this smile.',
  'Open this when I am bigger.',
  'Tell my family I did it.',
]

const promptCards = [
  'A tiny tooth, a big brave smile.',
  'Tonight the Tooth Fairy made it official.',
  'Future-you should remember this brave moment.',
]

const trustBadges = ['1 minute', 'No account to start', 'Private by default']
const certificateDraftStorageKey = 'tfn-certificate-draft'

const capsuleFlowCards = [
  { step: 'Parent', title: 'Grown-up starts it', body: 'Email anchors the private keepsake.' },
  { step: 'Moment', title: 'Tiny memory', body: 'Date, tooth type, and one parent sentence.' },
  { step: 'Child', title: 'Kid message', body: 'Pick the glow and choose what future-you opens.' },
  { step: 'Reveal', title: 'Sealed capsule', body: 'Share it with family or save it for later.' },
]

const missionChoices = [
  {
    id: 'tonight',
    title: 'Make tonight capsule',
    body: 'Turn the tooth moment into a tiny memory your child can open later.',
    note: 'Tonight became a tiny time capsule for future-you.',
  },
  {
    id: 'future',
    title: 'Message to future-you',
    body: 'Let your child leave one short message for their older self.',
    note: 'Future-you should remember this brave little moment.',
  },
  {
    id: 'family',
    title: 'Share with family',
    body: 'Make a capsule grandparents or important people can react to later.',
    note: 'This tiny time capsule belongs to the whole family.',
  },
] as const satisfies readonly {
  id: MissionChoice
  title: string
  body: string
  note: string
}[]

const landingAngles = [
  {
    title: 'Tooth fell out tonight?',
    body: 'Make the magic quickly, then save the story behind it.',
    href: '/certificate?angle=emergency',
  },
  {
    title: 'Free Tooth Fairy certificate',
    body: 'Create the printable artifact first, then decide whether to save the capsule.',
    href: '/certificate?angle=free-certificate',
  },
  {
    title: 'Future memory',
    body: 'Seal the story now and give the family a path back to it later.',
    href: '/create?angle=time-capsule',
  },
]

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function createInitialDraft(): CapsuleDraft {
  return {
    parentEmail: '',
    consentAccepted: false,
    childNickname: '',
    toothDate: todayIso(),
    toothType: toothTypes[0],
    parentNote: '',
    childPromptAnswer: '',
    capsuleStyle: capsuleStyles[0].id,
    fairyStamp: fairyStamps[0].id,
    unlockDate: '',
    photoPreviewUrl: null,
    capsuleId: null,
  }
}

export function TfnCapsuleMvpClient({
  variant,
  capsuleId,
}: {
  variant: TfnCapsuleMvpVariant
  capsuleId?: string
}) {
  const [draft, setDraft] = useState<CapsuleDraft>(() => createInitialDraft())
  const [certificateGenerated, setCertificateGenerated] = useState(false)
  const [createStep, setCreateStep] = useState<CreateStep>('parent')
  const [familyNote, setFamilyNote] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [familySaved, setFamilySaved] = useState(false)
  const [savedCapsule, setSavedCapsule] = useState<CapsuleDraft | null>(null)
  const [capsuleLoadState, setCapsuleLoadState] = useState<CapsuleLoadState>('idle')
  const [shareStatus, setShareStatus] = useState('')
  const [saveStatus, setSaveStatus] = useState('')
  const [missionChoice, setMissionChoice] = useState<MissionChoice>('tonight')
  const [certificateDraftImported, setCertificateDraftImported] = useState(false)

  const childLabel = draft.childNickname.trim() || 'Your child'
  const sealNumber = useMemo(
    () => buildSealNumber(childLabel, draft.toothDate, draft.fairyStamp),
    [childLabel, draft.toothDate, draft.fairyStamp],
  )
  const selectedStyle = capsuleStyles.find((style) => style.id === draft.capsuleStyle) ?? capsuleStyles[0]
  const selectedStamp = fairyStamps.find((stamp) => stamp.id === draft.fairyStamp) ?? fairyStamps[0]

  useEffect(() => {
    if (variant === 'certificate') {
      trackToothlightEvent('certificate_started', { source: 'route_view' })
    }
    if (variant === 'create') {
      trackToothlightEvent('capsule_started', { source: 'route_view' })
    }
    if (variant === 'family-note') {
      trackToothlightEvent('family_note_started', { inviteId: capsuleId ?? 'demo', source: 'route_view' })
    }
  }, [variant, capsuleId])

  useEffect(() => {
    if (variant !== 'create' || typeof window === 'undefined') return

    try {
      const stored = window.sessionStorage.getItem(certificateDraftStorageKey)
      if (!stored) return
      const certificateDraft = JSON.parse(stored) as Partial<CapsuleDraft>
      setDraft((current) => ({
        ...current,
        ...certificateDraft,
        consentAccepted: current.consentAccepted,
        capsuleId: null,
      }))
      setMissionChoice('tonight')
      setCertificateDraftImported(true)
      window.sessionStorage.removeItem(certificateDraftStorageKey)
    } catch {
      setCertificateDraftImported(false)
    }
  }, [variant])

  useEffect(() => {
    if (variant !== 'capsule' || !capsuleId || typeof window === 'undefined') return
    const activeCapsuleId = capsuleId
    let cancelled = false

    async function loadCapsule() {
      setCapsuleLoadState('loading')

      try {
        const stored = window.localStorage.getItem(`tfn-capsule:${activeCapsuleId}`)
        if (stored) {
          const parsed = JSON.parse(stored) as CapsuleDraft
          if (cancelled) return
          setSavedCapsule(parsed)
          setCapsuleLoadState('ready')
          return
        }
      } catch {
        setSavedCapsule(null)
      }

      try {
        const response = await fetch(`/api/tfn-capsules/${encodeURIComponent(activeCapsuleId)}`, { cache: 'no-store' })
        if (!response.ok) throw new Error('Capsule not found')
        const payload = (await response.json()) as { capsule?: CapsuleDraft }
        if (!payload.capsule || cancelled) return
        setSavedCapsule(payload.capsule)
        setCapsuleLoadState('ready')
        window.localStorage.setItem(`tfn-capsule:${activeCapsuleId}`, JSON.stringify(payload.capsule))
      } catch {
        if (!cancelled) {
          setSavedCapsule(null)
          setCapsuleLoadState('missing')
        }
      }
    }

    void loadCapsule()
    return () => {
      cancelled = true
    }
  }, [variant, capsuleId])

  function updateDraft(patch: Partial<CapsuleDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function generateCertificate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCertificateGenerated(true)
    setShareStatus('')
    trackToothlightEvent('certificate_generated', {
      toothType: draft.toothType,
      hasNickname: Boolean(draft.childNickname.trim()),
      style: selectedStyle.id,
    })
    if (draft.parentEmail.includes('@')) {
      trackToothlightEvent('email_submitted', { source: 'certificate' })
    }
  }

  function rememberCertificateDraftForCapsule() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(certificateDraftStorageKey, JSON.stringify(draft))
    }
    trackToothlightEvent('save_clicked', {
      source: 'certificate_to_capsule',
      hasNickname: Boolean(draft.childNickname.trim()),
      hasMessage: Boolean(draft.parentNote.trim()),
    })
  }

  function chooseMission(choice: (typeof missionChoices)[number]) {
    setMissionChoice(choice.id)
    updateDraft({ parentNote: draft.parentNote || choice.note })
    trackToothlightEvent('capsule_mission_selected', { mission: choice.id })
  }

  function downloadCertificate(source: 'certificate' | 'capsule_reveal' | 'capsule_view' = 'certificate', capsule = draft) {
    const artifactSealNumber = buildSealNumber(
      capsule.childNickname.trim() || 'Your child',
      capsule.toothDate,
      capsule.fairyStamp,
    )
    const artifactStyle = styleLabelFor(capsule.capsuleStyle)
    const artifactStamp = stampLabelFor(capsule.fairyStamp)
    const svg = buildCertificateSvg({
      childLabel: capsule.childNickname.trim() || 'Your child',
      toothDate: capsule.toothDate,
      toothType: capsule.toothType,
      message: capsule.parentNote || capsule.childPromptAnswer,
      sealNumber: artifactSealNumber,
      stamp: artifactStamp,
      styleName: artifactStyle,
    })
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const objectUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `${slugifyFileName(capsule.childNickname || 'tooth-light')}-certificate.svg`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(objectUrl)
    setShareStatus('Certificate downloaded.')
    trackToothlightEvent('certificate_downloaded', { sealNumber: artifactSealNumber, source })
    trackToothlightEvent('save_clicked', { sealNumber: artifactSealNumber, source })
  }

  async function shareCertificate(source: 'certificate' | 'capsule_reveal' | 'capsule_view', capsule = draft) {
    const artifactSealNumber = buildSealNumber(
      capsule.childNickname.trim() || 'Your child',
      capsule.toothDate,
      capsule.fairyStamp,
    )
    const sharePath = capsule.capsuleId ? `/capsule/${capsule.capsuleId}` : '/certificate'
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${sharePath}` : sharePath
    const shareTitle = `${capsule.childNickname.trim() || 'A child'}'s Tooth Light Capsule`
    const shareText = `${capsule.childNickname.trim() || 'A child'} has a Tooth Light Capsule ready. Seal ${artifactSealNumber}.`
    let method = 'manual'

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
        method = 'native'
        setShareStatus('Share sheet opened.')
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        method = 'clipboard'
        setShareStatus('Share link copied.')
      } else {
        setShareStatus('Share link ready.')
      }
    } catch {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          method = 'clipboard'
          setShareStatus('Share link copied.')
        } catch {
          setShareStatus('Share link ready.')
        }
      } else {
        setShareStatus('Share link ready.')
      }
    }

    trackToothlightEvent('share_clicked', { source, capsuleId: capsule.capsuleId, sealNumber: artifactSealNumber, method })
  }

  function continueParentGate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.parentEmail.includes('@') || !draft.consentAccepted) return
    trackToothlightEvent('email_submitted', { source: 'capsule_parent_gate' })
    trackToothlightEvent('parent_gate_completed', {
      hasNickname: Boolean(draft.childNickname.trim()),
      mission: missionChoice,
    })
    setCreateStep('moment')
  }

  function continueToChildMode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    trackToothlightEvent('tooth_story_added', {
      toothType: draft.toothType,
      hasParentNote: Boolean(draft.parentNote.trim()),
      hasPhoto: Boolean(draft.photoPreviewUrl),
    })
    trackToothlightEvent('child_mode_started', { toothType: draft.toothType })
    setCreateStep('child')
  }

  async function sealCapsule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextCapsuleId = createCapsuleId()
    const sealedDraft = { ...draft, capsuleId: nextCapsuleId }
    let saveMode = 'local_browser'
    setDraft(sealedDraft)
    setSaveStatus('Saving capsule link...')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`tfn-capsule:${nextCapsuleId}`, JSON.stringify(sealedDraft))
    }
    try {
      const response = await fetch('/api/tfn-capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sealedDraft),
      })
      if (!response.ok) throw new Error('Unable to save capsule link')
      saveMode = 'local_file_mvp'
      setSaveStatus('Saved. Capsule link is ready.')
    } catch {
      setSaveStatus('Saved on this browser. Local link save needs the dev server.')
    }
    trackToothlightEvent('child_prompt_answered', {
      answerLength: draft.childPromptAnswer.trim().length,
    })
    trackToothlightEvent('capsule_style_selected', {
      capsuleStyle: selectedStyle.id,
      fairyStamp: selectedStamp.id,
    })
    trackToothlightEvent('capsule_created', { capsuleId: nextCapsuleId })
    trackToothlightEvent('save_clicked', { capsuleId: nextCapsuleId, source: 'capsule_seal' })
    trackToothlightEvent('capsule_sealed', { capsuleId: nextCapsuleId })
    trackToothlightEvent('capsule_saved', { capsuleId: nextCapsuleId, mode: saveMode })
    if (draft.unlockDate) {
      trackToothlightEvent('unlock_date_set', { capsuleId: nextCapsuleId })
    }
    setCreateStep('reveal')
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const photoPreviewUrl = typeof reader.result === 'string' ? reader.result : null
      updateDraft({ photoPreviewUrl })
      trackToothlightEvent('tooth_photo_added', { source: 'upload' })
    }
    reader.readAsDataURL(file)
  }

  function submitFamilyNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!familyNote.trim()) return
    setFamilySaved(true)
    trackToothlightEvent('family_invite_clicked', { inviteId: capsuleId ?? 'demo' })
  }

  if (variant === 'certificate') {
    return (
      <MvpShell active="certificate">
        <section className={styles.certificateHero}>
          <div className={styles.storybookIntro}>
            <p className={styles.eyebrow}>Free tooth fairy certificate</p>
            <h1>Make tonight feel official in under a minute.</h1>
            <p>
              A quick parent-led keepsake for ages 6-8. Add the tooth moment, make the certificate,
              then decide whether to save it as a Tooth Light Capsule.
            </p>
            <div className={styles.trustBadges} aria-label="Trust and speed">
              {trustBadges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
            <div className={styles.guideCard}>
              <img src="/toothfairy/visual-system/tanda-guide-v1.png" alt="Tanda holding a glowing tooth" />
              <div>
                <span>Tanda says</span>
                <p>Start with the proof. The bigger memory can wait until bedtime calms down.</p>
              </div>
            </div>
          </div>

          <div className={styles.certificateWidget}>
            <form className={styles.toolForm} onSubmit={generateCertificate}>
              <div className={styles.formHeader}>
                <span>30-second proof</span>
                <strong>Make the printable first.</strong>
                <p>Enter a nickname and parent email. The certificate uses tonight's defaults unless you change them.</p>
              </div>
              <div className={styles.quickFields}>
                <Field label="Child nickname">
                  <input
                    value={draft.childNickname}
                    onChange={(event) => updateDraft({ childNickname: event.target.value })}
                    placeholder="Kai"
                    required
                  />
                </Field>
                <Field label="Parent email">
                  <input
                    type="email"
                    value={draft.parentEmail}
                    onChange={(event) => updateDraft({ parentEmail: event.target.value })}
                    placeholder="parent@example.com"
                    required
                  />
                </Field>
              </div>
              <div className={styles.fastDefaults}>
                <span>Uses today's date</span>
                <span>First tooth</span>
                <span>Moon glow</span>
              </div>
              <details className={styles.optionalDetails}>
                <summary>Add tooth details or leave defaults</summary>
                <div className={styles.inlineFields}>
                  <Field label="Tooth date">
                    <input
                      type="date"
                      value={draft.toothDate}
                      onChange={(event) => updateDraft({ toothDate: event.target.value })}
                    />
                  </Field>
                  <Field label="Short message">
                    <textarea
                      value={draft.parentNote}
                      onChange={(event) => updateDraft({ parentNote: event.target.value })}
                      placeholder="A tiny tooth, a big brave smile."
                      rows={3}
                    />
                  </Field>
                </div>
                <SegmentedControl
                  label="Tooth type"
                  options={toothTypes}
                  selected={draft.toothType}
                  onSelect={(toothType) => updateDraft({ toothType })}
                />
                <SegmentedControl
                  label="Certificate style"
                  options={capsuleStyles.map((style) => style.label)}
                  selected={selectedStyle.label}
                  onSelect={(label) => {
                    const next = capsuleStyles.find((style) => style.label === label) ?? capsuleStyles[0]
                    updateDraft({ capsuleStyle: next.id })
                  }}
                />
                <div className={styles.promptShelf} aria-label="Memory prompts">
                  <span>Tap a ready-made line</span>
                  {promptCards.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => updateDraft({ parentNote: prompt })}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </details>
              <button className={styles.primaryButton} type="submit">
                Make free certificate
              </button>
              <p className={styles.microcopy}>No account needed to preview. Email is for the private parent save path.</p>
            </form>
          </div>

          <div className={styles.certificateStage}>
            <div className={styles.artifactHeader}>
              <span>Live preview</span>
              <strong>{certificateGenerated ? 'Ready to download' : 'Waiting for the tooth moment'}</strong>
            </div>
            <img
              className={styles.perezScene}
              src="/story-assets/ratoncito-perez/v2/rp3-frame-10-tanda-arrives.png"
              alt="Tanda meeting Perez in a moonlit storybook street"
            />
            <CertificateArtifact
              childLabel={childLabel}
              toothDate={draft.toothDate}
              toothType={draft.toothType}
              message={draft.parentNote}
              sealNumber={sealNumber}
              stamp={selectedStamp.label}
              styleName={selectedStyle.label}
              generated={certificateGenerated}
            />
          <div className={styles.actionStrip} data-ready={certificateGenerated}>
            {certificateGenerated ? (
              <Link
                className={styles.primaryLink}
                href="/create?from=certificate"
                data-tfn-event="landing_cta_click"
                onClick={rememberCertificateDraftForCapsule}
              >
                Save the story as a capsule
              </Link>
            ) : (
              <span className={styles.disabledPrimaryAction} aria-disabled="true">
                Save the story as a capsule
              </span>
            )}
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => downloadCertificate('certificate')}
              disabled={!certificateGenerated}
              >
                Download certificate
              </button>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => shareCertificate('certificate')}
                disabled={!certificateGenerated}
            >
              Share certificate
            </button>
            {shareStatus && <span className={styles.statusText} aria-live="polite">{shareStatus}</span>}
        </div>
          {certificateGenerated && (
            <div className={styles.rewardBridge}>
              <img src="/toothfairy/visual-system/save-moment-v1.png" alt="" />
              <div>
                <span>Next best step</span>
                <strong>Keep the certificate. Save the story.</strong>
                <p>
                  The printable is ready. Saving the story turns this child, date, tooth, and message into
                  a private bedtime capsule with a family link and future unlock path.
                </p>
                <ul>
                  <li>Remembers nickname, tooth date, and message.</li>
                  <li>Adds one private capsule link for parent review.</li>
                  <li>Keeps payment and advanced wallet ideas out of bedtime.</li>
                </ul>
              </div>
            </div>
          )}
          </div>
        </section>
      </MvpShell>
    )
  }

  if (variant === 'create') {
    return (
      <MvpShell active="create">
        <section className={styles.creatorBand}>
          <div className={styles.flowHeader}>
          <p className={styles.eyebrow}>Tooth Light Time Capsule</p>
          <h1>Make a tiny time capsule your child can open later.</h1>
          <p>Parent starts it, child adds one future message, then the capsule is sealed and ready to share in under two minutes.</p>
            <div className={styles.stepRail} aria-label="Capsule progress">
              {(['parent', 'moment', 'child', 'reveal'] as CreateStep[]).map((step, index) => (
                <span key={step} data-active={createStep === step} data-complete={stepIndex(createStep) > index}>
                  {index + 1}
                </span>
              ))}
            </div>
          </div>

          {createStep === 'parent' && (
            <form className={styles.flowPanel} onSubmit={continueParentGate}>
              <div className={styles.missionPicker} aria-label="Choose a capsule mission">
                {missionChoices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    data-active={missionChoice === choice.id}
                    onClick={() => chooseMission(choice)}
                  >
                    <strong>{choice.title}</strong>
                    <span>{choice.body}</span>
                  </button>
                ))}
              </div>
              <GuideNote title="Tanda starts with the grown-up" body="A parent opens the safe envelope. The child only has to add one tiny future message." />
              {certificateDraftImported && (
                <div className={styles.importedDraftNotice}>
                  <span>Certificate details carried over.</span>
                  <p>
                    {childLabel}'s nickname, tooth date, tooth type, and certificate message are already here.
                    Check consent, then continue into the tiny story step.
                  </p>
                </div>
              )}
              <h2>Start the time capsule</h2>
              <Field label="Parent email">
                <input
                  type="email"
                  value={draft.parentEmail}
                  onChange={(event) => updateDraft({ parentEmail: event.target.value })}
                  placeholder="parent@example.com"
                  required
                />
              </Field>
              <Field label="Child nickname">
                <input
                  value={draft.childNickname}
                  onChange={(event) => updateDraft({ childNickname: event.target.value })}
                  placeholder="Optional"
                />
              </Field>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={draft.consentAccepted}
                  onChange={(event) => updateDraft({ consentAccepted: event.target.checked })}
                />
                <span>I am the parent or guardian creating this private family time capsule.</span>
              </label>
              <button className={styles.primaryButton} type="submit" disabled={!draft.consentAccepted}>
                Continue
              </button>
            </form>
          )}

          {createStep === 'moment' && (
            <form className={styles.flowPanel} onSubmit={continueToChildMode}>
              <GuideNote title="Capture the tiny memory" body="A date, tooth type, and one grown-up sentence are enough. Photos can wait." />
              <h2>Tiny memory</h2>
              <Field label="Tooth date">
                <input
                  type="date"
                  value={draft.toothDate}
                  onChange={(event) => updateDraft({ toothDate: event.target.value })}
                />
              </Field>
              <SegmentedControl
                label="Tooth type"
                options={toothTypes}
                selected={draft.toothType}
                onSelect={(toothType) => updateDraft({ toothType })}
              />
              <Field label="Tooth photo">
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </Field>
              <Field label="Parent note">
                <textarea
                  value={draft.parentNote}
                  onChange={(event) => updateDraft({ parentNote: event.target.value })}
                placeholder="What should this capsule remember?"
                  rows={4}
                />
              </Field>
              <button className={styles.primaryButton} type="submit">
                Let child add message
              </button>
            </form>
          )}

          {createStep === 'child' && (
            <form className={styles.childPanel} onSubmit={sealCapsule}>
              <GuideNote title="Child mode" body="One tap is enough. The child can pick a ready-made message or write their own." tone="night" />
              <h2>Add one message for future-you.</h2>
              <SegmentedControl
                label="Capsule glow"
                options={capsuleStyles.map((style) => style.label)}
                selected={selectedStyle.label}
                onSelect={(label) => {
                  const next = capsuleStyles.find((style) => style.label === label) ?? capsuleStyles[0]
                  updateDraft({ capsuleStyle: next.id })
                }}
              />
              <SegmentedControl
                label="Fairy stamp"
                options={fairyStamps.map((stamp) => stamp.label)}
                selected={selectedStamp.label}
                onSelect={(label) => {
                  const next = fairyStamps.find((stamp) => stamp.label === label) ?? fairyStamps[0]
                  updateDraft({ fairyStamp: next.id })
                }}
              />
              <Field label={childPrompts[1]}>
                <textarea
                  value={draft.childPromptAnswer}
                  onChange={(event) => updateDraft({ childPromptAnswer: event.target.value })}
                  placeholder="I want future-me to remember..."
                  rows={4}
                  required
                />
              </Field>
              <div className={styles.childAnswerChips} aria-label="Quick child messages">
                <span>Tap a message</span>
                {childAnswerChips.map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    onClick={() => updateDraft({ childPromptAnswer: answer })}
                  >
                    {answer}
                  </button>
                ))}
              </div>
              <Field label="Open again date (optional)">
                <input
                  type="date"
                  value={draft.unlockDate}
                  onChange={(event) => updateDraft({ unlockDate: event.target.value })}
                />
              </Field>
              <button className={styles.primaryButton} type="submit">
                Seal my time capsule
              </button>
            </form>
          )}

          {createStep === 'reveal' && (
            <div className={styles.revealPanel}>
              <div>
                <p className={styles.eyebrow}>Capsule sealed</p>
                <h2>{childLabel}'s Tooth Light Capsule is ready.</h2>
                <p>
                  The capsule is sealed. Share it with family now or keep the link for a future open-again moment.
                </p>
                {saveStatus && <p className={styles.saveStatus} aria-live="polite">{saveStatus}</p>}
                <div className={styles.revealActions}>
                  <button className={styles.secondaryButton} type="button" onClick={() => downloadCertificate('capsule_reveal')}>
                    Download artifact
                  </button>
                  <button className={styles.secondaryButton} type="button" onClick={() => shareCertificate('capsule_reveal')}>
                    Share family update
                  </button>
                  <Link className={styles.primaryLink} href={`/capsule/${draft.capsuleId ?? 'demo-capsule'}`}>
                    View capsule
                  </Link>
                  <Link
                    className={styles.secondaryLink}
                    href={`/family-note/${draft.capsuleId ?? 'demo-invite'}`}
                    data-tfn-event="family_note_started"
                  >
                    Invite family note
                  </Link>
                  {shareStatus && <span className={styles.statusText} aria-live="polite">{shareStatus}</span>}
                </div>
              </div>
              <CapsuleArtifact
                childLabel={childLabel}
                toothDate={draft.toothDate}
                toothType={draft.toothType}
                parentNote={draft.parentNote}
                childPromptAnswer={draft.childPromptAnswer}
                sealNumber={sealNumber}
                stamp={selectedStamp.label}
                styleName={selectedStyle.label}
                photoPreviewUrl={draft.photoPreviewUrl}
              />
              <div className={styles.upgradePanel}>
                <h3>Parent upgrade options</h3>
                <p>Premium certificate styles, future unlock reminders, and family contributor links.</p>
                <Link href="/pricing" data-tfn-event="upgrade_viewed">
                  See upgrades
                </Link>
              </div>
              <details className={styles.advancedPanel}>
                <summary>Parent-only advanced keepsake</summary>
                <p>Optional Solana keepsake certificate. No child identity or private memory goes on-chain.</p>
              </details>
            </div>
          )}

          <aside className={styles.capsuleMission} aria-label="Capsule mission">
            <img src="/story-assets/tanda/v2/s1-frame-25-first-toothlight.png" alt="Tanda holding the first Toothlight" />
            <div>
              <span>Time capsule mission</span>
              <h2>{createStep === 'reveal' ? 'The capsule is ready.' : 'Keep it tiny. Future-you opens it.'}</h2>
              <p>
                {createStep === 'reveal'
                  ? 'You have a shareable family artifact. Durable cloud save is the next backend step.'
                  : 'This flow is designed for a parent and child to finish before bedtime momentum disappears.'}
              </p>
            </div>
            <div className={styles.missionCards}>
              {capsuleFlowCards.map((card, index) => (
                <article key={card.step} data-active={stepIndex(createStep) === index} data-complete={stepIndex(createStep) > index}>
                  <span>{card.step}</span>
                  <strong>{card.title}</strong>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </MvpShell>
    )
  }

  if (variant === 'pricing') {
    return (
      <MvpShell active="pricing">
        <section className={styles.plainBand}>
          <p className={styles.eyebrow}>Pricing test</p>
          <h1>Let parents see the artifact first.</h1>
          <div className={styles.priceGrid}>
            <PriceCard title="Free" price="$0" body="Basic certificate and one local capsule preview." />
            <PriceCard title="Save" price="$5-$9" body="Full capsule save, premium certificate, and future unlock reminder." />
            <PriceCard title="Family" price="$15-$25" body="Family contributor link, premium keepsake, and reminder bundle." />
          </div>
        </section>
      </MvpShell>
    )
  }

  if (variant === 'privacy') {
    return (
      <MvpShell active="privacy">
        <section className={styles.plainBand}>
          <p className={styles.eyebrow}>Privacy</p>
          <h1>Parent-led and private by default.</h1>
          <div className={styles.copyGrid}>
            <p>Children do not create accounts. Parent email is the account anchor.</p>
            <p>Child full name and birthday are not required. Nicknames are optional.</p>
            <p>Family links are private sharing tools, not a public gallery or social graph.</p>
            <p>Private child content is not written to public chains.</p>
          </div>
        </section>
      </MvpShell>
    )
  }

  if (variant === 'terms') {
    return (
      <MvpShell active="terms">
        <section className={styles.plainBand}>
          <p className={styles.eyebrow}>Terms</p>
          <h1>A small family keepsake experiment.</h1>
          <div className={styles.copyGrid}>
            <p>Parents and guardians are responsible for the information they choose to save.</p>
            <p>The first MVP is for traction learning and may change as parent feedback comes in.</p>
            <p>Paid features should describe concrete upgrades before checkout starts.</p>
            <p>Advanced keepsake features are parent-only and optional.</p>
          </div>
        </section>
      </MvpShell>
    )
  }

  if (variant === 'capsule') {
    const capsuleToShow = savedCapsule
    const savedChildLabel = capsuleToShow?.childNickname.trim() || 'Your child'

    return (
      <MvpShell active="create">
        <section className={styles.plainBand}>
          <p className={styles.eyebrow}>Capsule</p>
          <h1>{capsuleToShow ? `${savedChildLabel}'s Tooth Light Capsule` : `Tooth Light Capsule ${capsuleId ?? 'demo'}`}</h1>
          {capsuleToShow ? (
            <div className={styles.savedCapsuleView}>
              <p className={styles.saveStatus}>Capsule link loaded. This memory can be reviewed from the local MVP server.</p>
              <CapsuleArtifact
                childLabel={savedChildLabel}
                toothDate={capsuleToShow.toothDate}
                toothType={capsuleToShow.toothType}
                parentNote={capsuleToShow.parentNote}
                childPromptAnswer={capsuleToShow.childPromptAnswer}
                sealNumber={buildSealNumber(savedChildLabel, capsuleToShow.toothDate, capsuleToShow.fairyStamp)}
                stamp={stampLabelFor(capsuleToShow.fairyStamp)}
                styleName={styleLabelFor(capsuleToShow.capsuleStyle)}
                photoPreviewUrl={capsuleToShow.photoPreviewUrl}
              />
              <div className={styles.revealActions}>
                <button className={styles.secondaryButton} type="button" onClick={() => downloadCertificate('capsule_view', capsuleToShow)}>
                  Download artifact
                </button>
                <button className={styles.secondaryButton} type="button" onClick={() => shareCertificate('capsule_view', capsuleToShow)}>
                  Share family update
                </button>
                <Link
                  className={styles.primaryLink}
                  href={`/family-note/${capsuleId ?? 'demo-invite'}`}
                  data-tfn-event="family_note_started"
                >
                  Invite family note
                </Link>
                <Link className={styles.secondaryLink} href={`/capsule/${capsuleId ?? 'demo'}/unlock`}>
                  Open unlock view
                </Link>
                {shareStatus && <span className={styles.statusText} aria-live="polite">{shareStatus}</span>}
              </div>
            </div>
          ) : (
            <>
              <p className={styles.narrowCopy}>
                {capsuleLoadState === 'loading'
                  ? 'Looking up this capsule link...'
                  : 'This capsule link was not found on this local MVP server. Create a new capsule to generate a fresh review link.'}
              </p>
              <Link className={styles.primaryLink} href="/create">
                Create a capsule
              </Link>
            </>
          )}
        </section>
      </MvpShell>
    )
  }

  if (variant === 'unlock') {
    return (
      <MvpShell active="create">
        <section className={styles.plainBand}>
          <p className={styles.eyebrow}>Future unlock</p>
          <h1>The memory waits until the parent says it is time.</h1>
          <p className={styles.narrowCopy}>
            Unlock reminders belong behind the parent account and upgrade path. The child does not need a login
            to participate in the first capsule.
          </p>
        </section>
      </MvpShell>
    )
  }

  if (variant === 'family-note') {
    return (
      <MvpShell active="create">
        <section className={styles.toolBand}>
          <div className={styles.toolIntro}>
            <p className={styles.eyebrow}>Family note</p>
            <h1>Add a future message.</h1>
            <p>A family contributor can leave one note without seeing private parent settings.</p>
          </div>
          <form className={styles.toolForm} onSubmit={submitFamilyNote}>
            <Field label="Your name">
              <input value={familyName} onChange={(event) => setFamilyName(event.target.value)} placeholder="Grandma" />
            </Field>
            <Field label="Message">
              <textarea
                value={familyNote}
                onChange={(event) => setFamilyNote(event.target.value)}
                placeholder="I remember when..."
                rows={4}
                required
              />
            </Field>
            <button className={styles.primaryButton} type="submit">
              Save note
            </button>
          </form>
          <div className={styles.familyPreview}>
            <span>{familyName.trim() || 'Family'}</span>
            <p>{familySaved ? familyNote : 'Your note will wait inside the capsule.'}</p>
          </div>
        </section>
      </MvpShell>
    )
  }

  return (
    <MvpShell active="home">
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Tooth Fairy Network</p>
          <h1>Make a Tooth Fairy certificate tonight.</h1>
          <p>
            A free printable gift for a child who lost a tooth. Make the first certificate in under a minute,
            then keep going only if you want to turn a lost tooth into a future memory.
          </p>
          <div className={`${styles.trustBadges} ${styles.heroTrustBadges}`} aria-label="Trust and speed">
            {trustBadges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.primaryLink} href="/certificate" data-tfn-event="landing_cta_click">
              Make Free Certificate
            </Link>
            <Link className={styles.secondaryLink} href="/create" data-tfn-event="landing_cta_click">
              Create Tooth Capsule
            </Link>
          </div>
          <span className={styles.storyTagline}>Turn a lost tooth into a future memory.</span>
          <span className={styles.trustLine}>Parent-led. Private by default. No wallet required.</span>
        </div>
        <div className={styles.heroArtifact} aria-hidden="true">
          <img src="/story-assets/tanda/v2/s1-frame-25-first-toothlight.png" alt="" />
        </div>
      </section>

      <section className={styles.stepsBand} aria-label="How it works">
        {['Add the tooth moment', 'Let your child seal it', 'Save the memory for later'].map((step, index) => (
          <article key={step} className={styles.stepCard}>
            <span>{index + 1}</span>
            <h2>{step}</h2>
          </article>
        ))}
      </section>

      <KeepsakeBankLoop />

      <section className={styles.artifactBand}>
        <div className={styles.artifactCopy}>
          <p className={styles.eyebrow}>Immediate reward</p>
          <h2>An artifact before any payment prompt.</h2>
          <p>
            Parents should see the certificate and sealed capsule first. Upgrade only after the moment feels
            worth keeping.
          </p>
          <div className={styles.referenceRow}>
            <span>Prompt cards</span>
            <span>Private family notes</span>
            <span>Future unlock date</span>
          </div>
        </div>
        <CertificateArtifact
          childLabel="Kai"
          toothDate={todayIso()}
          toothType="First tooth"
          message="A tiny tooth, a big brave smile."
          sealNumber="TFN-0824"
          stamp="North Star"
          styleName="Moon glow"
          generated
        />
      </section>

      <section className={styles.campaignBand} aria-label="Campaign angles">
        {landingAngles.map((angle) => (
          <Link key={angle.title} href={angle.href} className={styles.angleCard} data-tfn-event="landing_cta_click">
            <h2>{angle.title}</h2>
            <p>{angle.body}</p>
          </Link>
        ))}
      </section>
    </MvpShell>
  )
}

function KeepsakeBankLoop() {
  return (
    <section className={styles.bankLoopBand} aria-labelledby="bank-loop-title">
      <div className={styles.bankLoopCopy}>
        <p className={styles.eyebrow}>Magical Keepsake Bank</p>
        <h2 id="bank-loop-title">The certificate is the receipt. The keepsake bank is the reason to save it.</h2>
        <p>
          A lost-tooth story starts as a printable proof for the child, becomes a Toothlight, then drops a
          starter coin into a parent-led keepsake bank.
        </p>
        <div className={styles.bankLoopSteps} aria-label="Keepsake loop">
          <span>Paper proof</span>
          <span>Toothlight</span>
          <span>Starter coin</span>
          <span>Family bank</span>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.primaryLink} href="/certificate" data-tfn-event="landing_cta_click">
            Make the proof
          </Link>
          <Link className={styles.secondaryLink} href="/create" data-tfn-event="landing_cta_click">
            Build the bank loop
          </Link>
        </div>
      </div>

      <div
        className={styles.bankLoopStage}
        aria-label="Animated product loop showing a certificate becoming a Toothlight, a coin, and a magical piggy bank"
      >
        <svg className={styles.bankLightPath} viewBox="0 0 760 420" aria-hidden="true">
          <path d="M128 178 C 235 88, 330 96, 408 170 S 545 284, 635 220" />
          <path d="M177 263 C 282 312, 420 322, 587 276" />
        </svg>

        <article className={styles.loopPaper}>
          <span>Official Tooth Light Certificate</span>
          <strong>Kai</strong>
          <small>First tooth - North Star</small>
        </article>

        <div className={styles.loopToothlight} aria-hidden="true">
          <img src="/toothfairy/visual-system/toothlight-keepsake-current.jpg" alt="" />
          <span />
        </div>

        <div className={styles.loopTanda} aria-hidden="true">
          <img src="/toothfairy/animation/live-hero-v1/tanda-carry-coin.webp" alt="" />
        </div>

        <span className={styles.loopCoin} aria-hidden="true">
          <span />
        </span>

        <div className={styles.loopBank} aria-hidden="true">
          <span className={styles.loopBankGlow} />
          <img src="/toothfairy/animation/layered/piggy-cutout-soft-no-coin.png" alt="" />
          <span className={styles.loopBankSlot} />
          <span className={styles.loopBankBadge}>SOL</span>
        </div>

        <div className={styles.loopCaption}>
          <span>Parent-only savings layer</span>
          <strong>1 tooth story saved</strong>
        </div>

        <div className={styles.loopSparkles} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}

function MvpShell({
  active,
  children,
}: {
  active: 'home' | 'certificate' | 'create' | 'pricing' | 'privacy' | 'terms'
  children: React.ReactNode
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.navbar}>
        <Link href="/" className={styles.brand}>
          <span>TFN</span>
          Tooth Fairy Network
        </Link>
        <nav aria-label="Tooth Fairy Network">
          <Link href="/certificate" data-active={active === 'certificate'}>
            Certificate
          </Link>
          <Link href="/create" data-active={active === 'create'}>
            Create
          </Link>
          <Link href="/pricing" data-active={active === 'pricing'}>
            Pricing
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <span>Parent-led Tooth Light Capsules.</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/toothlight">Old Toothlight preview</Link>
        </div>
      </footer>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  )
}

function GuideNote({
  title,
  body,
  tone = 'day',
}: {
  title: string
  body: string
  tone?: 'day' | 'night'
}) {
  return (
    <div className={styles.guideNote} data-tone={tone}>
      <img src="/toothfairy/visual-system/tanda-guide-v1.png" alt="" />
      <div>
        <span>{title}</span>
        <p>{body}</p>
      </div>
    </div>
  )
}

function SegmentedControl({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: string[]
  selected: string
  onSelect: (option: string) => void
}) {
  return (
    <fieldset className={styles.segmentGroup}>
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            data-selected={selected === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function CertificateArtifact({
  childLabel,
  toothDate,
  toothType,
  message,
  sealNumber,
  stamp,
  styleName,
  generated,
}: {
  childLabel: string
  toothDate: string
  toothType: string
  message: string
  sealNumber: string
  stamp: string
  styleName: string
  generated: boolean
}) {
  return (
    <article className={styles.certificate} data-generated={generated}>
      <div className={styles.certificateRibbon}>
        <span>{generated ? 'Ready' : 'Preview'}</span>
      </div>
      <div className={styles.certificateStars} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className={styles.certificateKicker}>Official Tooth Light Capsule Certificate</span>
      <h2>{childLabel}</h2>
      <dl>
        <div>
          <dt>Date</dt>
          <dd>{formatDisplayDate(toothDate)}</dd>
        </div>
        <div>
          <dt>Tooth</dt>
          <dd>{toothType}</dd>
        </div>
        <div>
          <dt>Seal</dt>
          <dd>{sealNumber}</dd>
        </div>
        <div>
          <dt>Stamp</dt>
          <dd>{stamp}</dd>
        </div>
      </dl>
      <p>{message.trim() || 'This tooth moment has been recorded by the Tooth Fairy Network.'}</p>
      <small>{styleName} certificate</small>
      <div className={styles.certificateSeal} aria-label={`Seal ${sealNumber}`}>
        <span>{stamp.split(' ')[0]}</span>
        <strong>TFN</strong>
      </div>
    </article>
  )
}

function CapsuleArtifact({
  childLabel,
  toothDate,
  toothType,
  parentNote,
  childPromptAnswer,
  sealNumber,
  stamp,
  styleName,
  photoPreviewUrl,
}: {
  childLabel: string
  toothDate: string
  toothType: string
  parentNote: string
  childPromptAnswer: string
  sealNumber: string
  stamp: string
  styleName: string
  photoPreviewUrl: string | null
}) {
  return (
    <article className={styles.capsuleArtifact}>
      <div className={styles.capsuleImage}>
        {photoPreviewUrl ? <img src={photoPreviewUrl} alt="" /> : <img src="/toothfairy/visual-system/save-moment-v1.png" alt="" />}
      </div>
      <div>
        <span>{styleName}</span>
      <h2>{childLabel}'s sealed time capsule</h2>
      <p>{childPromptAnswer || parentNote || 'A small tooth became a future memory capsule.'}</p>
        <dl>
          <div>
            <dt>Date</dt>
            <dd>{formatDisplayDate(toothDate)}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{toothType}</dd>
          </div>
          <div>
            <dt>Stamp</dt>
            <dd>{stamp}</dd>
          </div>
          <div>
            <dt>Seal</dt>
            <dd>{sealNumber}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

function PriceCard({ title, price, body }: { title: string; price: string; body: string }) {
  return (
    <article className={styles.priceCard}>
      <span>{price}</span>
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  )
}

function stepIndex(step: CreateStep) {
  return ['parent', 'moment', 'child', 'reveal'].indexOf(step)
}

function styleLabelFor(styleId: string) {
  return capsuleStyles.find((style) => style.id === styleId)?.label ?? capsuleStyles[0].label
}

function stampLabelFor(stampId: string) {
  return fairyStamps.find((stamp) => stamp.id === stampId)?.label ?? fairyStamps[0].label
}

function createCapsuleId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `capsule-${crypto.randomUUID().slice(0, 8)}`
  }
  return `capsule-${Date.now().toString(36)}`
}

function buildSealNumber(childLabel: string, toothDate: string, stamp: string) {
  const seed = `${childLabel}-${toothDate}-${stamp}`
  let total = 0
  for (const char of seed) total += char.charCodeAt(0)
  return `TFN-${String(total % 10000).padStart(4, '0')}`
}

function formatDisplayDate(value: string) {
  if (!value) return 'Tonight'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function buildCertificateSvg({
  childLabel,
  toothDate,
  toothType,
  message,
  sealNumber,
  stamp,
  styleName,
}: {
  childLabel: string
  toothDate: string
  toothType: string
  message: string
  sealNumber: string
  stamp: string
  styleName: string
}) {
  const safeMessage = message.trim() || 'This tooth moment has been recorded by the Tooth Fairy Network.'
  const lines = wrapCertificateText(safeMessage, 54)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#fffdf6"/>
  <rect x="52" y="52" width="1096" height="696" rx="28" fill="#fffaf0" stroke="#c6a352" stroke-width="4"/>
  <circle cx="1040" cy="640" r="62" fill="#fff1c6" stroke="#c6a352" stroke-width="4"/>
  <polygon points="1018,84 1108,84 1148,124 1148,214" fill="#ff8a5b"/>
  <text x="1082" y="142" fill="#fffdf6" font-family="Arial, sans-serif" font-size="22" font-weight="900" text-anchor="middle" transform="rotate(45 1082 142)">READY</text>
  <path d="M52 220 C250 120 320 330 520 220 S870 120 1148 230" fill="none" stroke="#f5d074" stroke-width="14" opacity="0.55"/>
  <polygon points="988,304 1000,332 1031,335 1007,354 1014,384 988,368 962,384 969,354 945,335 976,332" fill="#f5d074" opacity="0.78"/>
  <polygon points="166,645 174,663 194,665 178,677 183,696 166,686 149,696 154,677 138,665 158,663" fill="#ff8a5b" opacity="0.8"/>
  <text x="96" y="142" fill="#0d7069" font-family="Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="5">OFFICIAL TOOTH LIGHT CAPSULE CERTIFICATE</text>
  <text x="96" y="256" fill="#132124" font-family="Georgia, serif" font-size="88">${escapeXml(childLabel)}</text>
  <text x="96" y="340" fill="#647376" font-family="Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="3">DATE</text>
  <text x="96" y="384" fill="#132124" font-family="Arial, sans-serif" font-size="34" font-weight="800">${escapeXml(formatDisplayDate(toothDate))}</text>
  <text x="430" y="340" fill="#647376" font-family="Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="3">TOOTH</text>
  <text x="430" y="384" fill="#132124" font-family="Arial, sans-serif" font-size="34" font-weight="800">${escapeXml(toothType)}</text>
  <text x="96" y="470" fill="#647376" font-family="Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="3">SEAL</text>
  <text x="96" y="514" fill="#132124" font-family="Arial, sans-serif" font-size="34" font-weight="800">${escapeXml(sealNumber)}</text>
  <text x="430" y="470" fill="#647376" font-family="Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="3">STAMP</text>
  <text x="430" y="514" fill="#132124" font-family="Arial, sans-serif" font-size="34" font-weight="800">${escapeXml(stamp)}</text>
  ${lines.map((line, index) => `<text x="96" y="${610 + index * 42}" fill="#304346" font-family="Georgia, serif" font-size="34">${escapeXml(line)}</text>`).join('\n  ')}
  <text x="96" y="718" fill="#8c6c2c" font-family="Arial, sans-serif" font-size="24" font-weight="800">${escapeXml(styleName)} certificate</text>
  <text x="1040" y="626" fill="#8c5f1d" font-family="Arial, sans-serif" font-size="16" font-weight="900" text-anchor="middle">${escapeXml(stamp.split(' ')[0]).toUpperCase()}</text>
  <text x="1040" y="666" fill="#8c5f1d" font-family="Arial, sans-serif" font-size="34" font-weight="900" text-anchor="middle">TFN</text>
</svg>`
}

function wrapCertificateText(value: string, maxLength: number) {
  const words = value.replace(/\s+/g, ' ').trim().split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxLength && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
    if (lines.length === 2) break
  }

  if (current && lines.length < 3) lines.push(current)
  return lines.slice(0, 3)
}

function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'tooth-light'
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
