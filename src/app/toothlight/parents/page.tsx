import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ToothlightMemoryCard,
  toothlightDemoMemories,
} from "@/components/toothlight/toothlight-memory-card"
import { ToothlightHeader } from "@/components/toothlight/toothlight-header"
import {
  parentAssuranceRows,
  parentTrustItems,
  toothlightScenes,
} from "@/components/toothlight/toothlight-data"
import styles from "@/components/toothlight/toothlight-v3-pages.module.css"

export const metadata: Metadata = {
  title: "Parents and Smile Fund | Toothlight",
  description:
    "How Toothlight keeps family memories clear, parent-led, and easy to return to.",
}

export default function ToothlightParentsPage() {
  const family = toothlightDemoMemories[3]

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="Parents and Smile Fund">
        <Image
          src={toothlightScenes.parents}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <ToothlightHeader active="Parents" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>For parents</p>
            <h1>Memory first. Parent choices next.</h1>
            <p className={styles.lead}>
              Toothlight starts with the memory. The photo stays recognizable,
              important choices wait for parent review, and Smile Fund remains
              optional.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/toothlight/make">
                Make a Toothlight
              </Link>
              <Link className={styles.secondaryAction} href="/toothfairy/smile-fund">
                Smile Fund details
              </Link>
            </div>
          </div>
          <div className={styles.heroCard}>
            <ToothlightMemoryCard memory={family} size="large" />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="Parent trust principles">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Parent controls</p>
          <h2 className={styles.sectionTitle}>Simple choices stay with parents.</h2>
          <p>
            Toothlight keeps the card child-friendly while sharing, gifting,
            and account choices stay clear for adults.
          </p>
        </div>
        <div className={styles.trustGrid}>
          {parentTrustItems.map((item) => (
            <article key={item.title} className={styles.trustCard}>
              <span className={styles.miniStat}>For parents</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className={styles.assuranceGrid} aria-label="Parent assurance checklist">
          {parentAssuranceRows.map((row) => (
            <article key={row.title} className={styles.assuranceCard}>
              <strong>{row.title}</strong>
              <p>{row.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-label="Smile Fund placement">
        <div className={styles.split}>
          <div className={styles.visualPanel}>
            <Image src={toothlightScenes.keepsake} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" />
          </div>
          <div className={styles.bodyPanel}>
            <p className={styles.eyebrow}>Smile Fund</p>
            <h2 className={styles.panelTitle}>A small gift, never the main event.</h2>
            <p className={styles.bodyCopy}>
              A Toothlight does not need a fund to matter. When parents want
              to add a small gift, Smile Fund can sit quietly beside the memory.
            </p>
            <div className={styles.fundMock} aria-label="Smile Fund placement mock">
              <div className={styles.fundRow}>
                <span>Toothlight</span>
                <strong>{family.title}</strong>
              </div>
              <div className={styles.fundRow}>
                <span>Gift</span>
                <strong>Optional</strong>
              </div>
              <div className={styles.fundRow}>
                <span>Control</span>
                <strong>Parent review</strong>
              </div>
              <div className={styles.fundRow}>
                <span>Child view</span>
                <strong>Memory first</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.darkBand} aria-label="Parent proof">
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>What you keep</p>
            <h2 className={styles.sectionTitle}>The photo, the date, the words.</h2>
            <p>
              The card should be easy to understand years later: this was the
              tooth, this was the day, and this was the story.
            </p>
          </div>
          <div className={styles.cardRail}>
            {toothlightDemoMemories.map((memory) => (
              <ToothlightMemoryCard key={memory.title} memory={memory} size="medium" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
