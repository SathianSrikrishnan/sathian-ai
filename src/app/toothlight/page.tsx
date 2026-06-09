import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductEntryRead } from '@/components/toothlight/v4/ProductEntryRead'
import { ToothlightCard } from '@/components/toothlight/v4/ToothlightCard'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Toothlight | Tooth Fairy Network',
  description:
    'Turn a lost tooth into a glowing family time capsule with a photo, drawing, story, note for later, and optional family gift.',
}

const howSteps = [
  { label: 'Make', detail: 'Photo, drawing, glow' },
  { label: 'Save', detail: 'Story and parent account' },
  { label: 'Seal', detail: 'Note for later' },
  { label: 'Share', detail: 'Family note and gift' },
]

const FRONT_DOOR_BEATS = [
  { label: 'Photo + drawing', detail: 'Child-made memory' },
  { label: 'AI Toothlight', detail: 'Story object' },
  { label: 'Sealed note', detail: 'Parent message for later' },
  { label: 'Family note + gift', detail: 'Optional next layer' },
]

const trustPills = ['Create before sign-in', 'Original stays saved', 'Parent controls the note']

export default function ToothlightV4EntryPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/toothlight" className={styles.brand} aria-label="Tooth Fairy Network Toothlight home">
          <span aria-hidden="true">TFN</span>
          Toothlight
        </Link>
        <nav className={styles.nav} aria-label="Toothlight">
          <a href="#how">How it works</a>
          <Link href="/toothlight/make">Create</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="toothlight-title">
        <div className={styles.heroVisual}>
          <ProductEntryRead />
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Tooth Fairy Network</p>
          <h1 id="toothlight-title">Toothlight</h1>
          <p className={styles.lede}>
            Turn a lost tooth into a glowing time capsule: photo, drawing,
            story, note for later, and an optional family gift.
          </p>
          <ol className={styles.beatRail} aria-label="10-second Toothlight story">
            {FRONT_DOOR_BEATS.map((beat, index) => (
              <li key={beat.label}>
                <span>{index + 1}</span>
                <strong>{beat.label}</strong>
                <small>{beat.detail}</small>
              </li>
            ))}
          </ol>
          <div className={styles.trustPills} aria-label="Parent trust cues">
            {trustPills.map((pill) => (
              <span key={pill}>{pill}</span>
            ))}
          </div>
          <div className={styles.actions}>
            <Link href="/toothlight/make" className={styles.primaryAction}>
              Create a Toothlight
            </Link>
            <a href="#how" className={styles.secondaryAction}>
              See the ritual
            </a>
          </div>
          <p className={styles.heroNote}>
            Start with the memory. Save and seal only when it feels right.
          </p>
          <p className={styles.trustLine}>
            Tanda helps make the memory. Parents decide what gets saved.
          </p>
        </div>
      </section>

      <section id="how" className={styles.how} aria-label="How It Works">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>How It Works</p>
          <h2>Small ritual. Future gift.</h2>
        </div>
        <div className={styles.howSteps}>
          {howSteps.map((step, index) => (
            <article key={step.label} className={styles.howStep}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <div className={styles.stepGlyph} aria-hidden="true">
                <span />
              </div>
              <h3>{step.label}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.objectSection} aria-label="A saved Toothlight">
        <div className={styles.objectCopy}>
          <p className={styles.eyebrow}>The object</p>
          <h2>One memory can grow.</h2>
          <p>
            A Toothlight can start as a simple glow. It becomes richer when a
            parent seals a note for later or invites family to add a note and
            optional gift.
          </p>
          <Link href="/toothlight/make" className={styles.textAction}>
            Save this Toothlight
          </Link>
        </div>
        <div className={styles.objectVisual}>
          <ToothlightCard
            title="Kai's Toothlight"
            caption="First tooth. Big smile."
            createdLabel="Sealed for later"
            visualState="sealed"
            smileFundActive
            familyNodes={[
              { id: 'nana-note', kind: 'family_note' },
              { id: 'uncle-gift', kind: 'family_gift' },
            ]}
          />
        </div>
      </section>

      <section className={styles.networkBand} aria-label="Tooth Fairy Network">
        <p>
          In the Network, Tanda and the keepers protect Toothlights until the
          right future moment.
        </p>
      </section>
    </main>
  )
}
