import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductEntryRead } from '@/components/toothlight/v4/ProductEntryRead'
import { ToothlightCard } from '@/components/toothlight/v4/ToothlightCard'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Toothlight | Tooth Fairy Network',
  description:
    'Turn a lost tooth into a future asset your child can grow into with a photo, drawing, story, parent note, and family learning path.',
}

const howSteps = [
  { label: 'Capture', detail: 'Photo, drawing, or tooth moment' },
  { label: 'Time-lock', detail: 'Parent note and future gift' },
  { label: 'Invite', detail: 'Family love under parent control' },
  { label: 'Learn', detail: 'Age-10 responsibility track' },
]

const FRONT_DOOR_BEATS = [
  { label: 'Capture', detail: 'Their real moment' },
  { label: 'Story', detail: 'Their words' },
  { label: 'Note', detail: 'Your future message' },
  { label: 'Learn', detail: 'Ready by age 10' },
]

const trustPills = ['Drawings welcome', 'Original stays saved', 'Parent controls the handoff']

const sampleMemories = [
  {
    title: 'Robot-dog wish',
    detail: 'Photo + child words',
    image: '/v3/memories/robot-dog-wish.png',
    note: 'A real tooth moment becomes a small story.',
  },
  {
    title: 'Dad helped draw it',
    detail: 'Finished drawing',
    image: '/v3/memories/dad-helped-draw-it.png',
    note: 'Paper artwork can be the main keepsake.',
  },
  {
    title: 'First drawing',
    detail: 'Child-made art',
    image: '/v3/memories/first-drawing.png',
    note: 'Simple marks still carry the memory.',
  },
  {
    title: 'Dinner became the story',
    detail: 'Family context',
    image: '/v3/memories/dinner-became-story.png',
    note: 'The day around the tooth matters too.',
  },
  {
    title: 'First handoff',
    detail: 'Original photo',
    image: '/v3/memories/first-handoff.png',
    note: 'A plain photo can stay recognizable.',
  },
  {
    title: 'Wiggly for two weeks',
    detail: 'Memory caption',
    image: '/v3/memories/wiggly-two-weeks.png',
    note: 'One sentence gives it a future handle.',
  },
]

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
          <Link href="/toothlight/learn" data-tfn-event="learn_clicked">Learn</Link>
          <Link href="/toothlight/start" data-tfn-event="cta_click">Create</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="toothlight-title">
        <div className={styles.heroVisual}>
          <ProductEntryRead />
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Tooth Fairy Network</p>
          <h1 id="toothlight-title">Turn a lost tooth into a future asset.</h1>
          <p className={styles.lede}>
            Start with the drawing, photo, or funny sentence your child already
            made. A Toothlight keeps the story, your note, and the family handoff
            together so they can grow into it around age 10.
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
            <Link href="/toothlight/start" className={styles.primaryAction} data-tfn-event="cta_click">
              Create a Toothlight
            </Link>
            <a href="#how" className={styles.secondaryAction}>
              See the steps
            </a>
          </div>
          <p className={styles.heroNote}>
            No AI render is required to begin. The first product is the memory.
          </p>
          <p className={styles.trustLine}>
            Tanda helps make the memory. Parents decide what gets saved, shared, and handed over.
          </p>
        </div>
      </section>

      <section className={styles.proofSection} aria-label="Real Toothlight examples">
        <div className={styles.proofIntro}>
          <p className={styles.eyebrow}>Real starts</p>
          <h2>Crayon first. Future asset second.</h2>
          <p>
            The strongest examples start with ordinary family material: a quick
            drawing, a tooth in a hand, a sentence only that child would say.
          </p>
        </div>
        <div className={styles.proofGrid}>
          {sampleMemories.map((memory) => (
            <article key={memory.title} className={styles.proofCard}>
              <div className={styles.proofImage}>
                <img src={memory.image} alt={`${memory.title}: ${memory.detail}`} loading="lazy" />
              </div>
              <div className={styles.proofCardCopy}>
                <span>{memory.detail}</span>
                <h3>{memory.title}</h3>
                <p>{memory.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className={styles.how} aria-label="How It Works">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>How It Works</p>
          <h2>Capture, time-lock, invite, learn.</h2>
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
            optional gift. The learning layer gives the child a way to understand
            what they are receiving before the handoff.
          </p>
          <Link href="/toothlight/start" className={styles.textAction} data-tfn-event="cta_click">
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
          right future moment. Solana can support the ownership layer when the
          family is ready for that path.
        </p>
      </section>
    </main>
  )
}
