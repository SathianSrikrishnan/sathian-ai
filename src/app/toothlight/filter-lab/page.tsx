import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ToothlightMemoryCard,
  toothlightDemoMemories,
} from "@/components/toothlight/toothlight-memory-card"
import { ToothlightHeader } from "@/components/toothlight/toothlight-header"
import {
  filterReviewRules,
  toothlightScenes,
} from "@/components/toothlight/toothlight-data"
import styles from "@/components/toothlight/toothlight-v3-pages.module.css"

export const metadata: Metadata = {
  title: "Photo Styles | Toothlight",
  description:
    "Choose a Toothlight photo style that keeps the original memory recognizable.",
}

const candidates = [
  {
    title: "Original",
    className: "",
    body: "The memory as it was saved.",
  },
  {
    title: "Warm storybook",
    className: styles.filterWarm,
    body: "A warmer finish without changing the child or tooth.",
  },
  {
    title: "Light frame",
    className: styles.filterField,
    body: "A soft light frame around the original image.",
  },
  {
    title: "Paper keepsake",
    className: styles.filterPaper,
    body: "A printed-card feel for drawings and notes.",
  },
]

export default function ToothlightFilterLabPage() {
  const memory = toothlightDemoMemories[0]
  const drawing = toothlightDemoMemories[2]

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="Photo style choices">
        <Image
          src={toothlightScenes.bedroom}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <ToothlightHeader active="Make" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Photo styles</p>
            <h1>Keep the photo looking like your child.</h1>
            <p className={styles.lead}>
              Toothlight can make the card feel finished without changing who
              is in the photo or what the child made.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/toothlight/make">
                Back to Make
              </Link>
              <Link className={styles.secondaryAction} href="/toothlight/network">
                See Network
              </Link>
            </div>
          </div>
          <div className={styles.heroCard}>
            <ToothlightMemoryCard memory={memory} size="large" />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="Photo style choices">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Style choices</p>
          <h2 className={styles.sectionTitle}>Use gentle styles first.</h2>
          <p>
            Warmth, paper texture, and light overlays can make the card feel
            finished while keeping the original moment easy to recognize.
          </p>
        </div>
        <div className={styles.filterGrid}>
          {candidates.map((candidate) => (
            <article key={candidate.title} className={styles.filterTile}>
              <div className={[styles.filterPreview, candidate.className].join(" ")}>
                <img src={memory.image} alt={memory.alt} />
              </div>
              <div className={styles.filterCopy}>
                <strong>{candidate.title}</strong>
                <p>{candidate.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.reviewGrid} aria-label="Style review rules">
          {filterReviewRules.map((rule) => (
            <article key={rule.title} className={styles.reviewCard}>
              <strong>{rule.title}</strong>
              <p>{rule.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-label="Drawing treatment">
        <div className={styles.split}>
          <div className={styles.visualPanel}>
            <Image src={toothlightScenes.keepsake} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" />
          </div>
          <div className={styles.bodyPanel}>
            <p className={styles.eyebrow}>Card check</p>
            <h2 className={styles.panelTitle}>The card decides.</h2>
            <p className={styles.bodyCopy}>
              If the child, tooth, drawing, or quote no longer feels clear
              inside the Toothlight, choose a simpler style.
            </p>
            <div className={styles.inlineCard}>
              <ToothlightMemoryCard memory={drawing} size="small" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
