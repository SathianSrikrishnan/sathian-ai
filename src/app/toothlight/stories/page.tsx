import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ToothlightMemoryCard,
  toothlightDemoMemories,
} from "@/components/toothlight/toothlight-memory-card"
import { ToothlightHeader } from "@/components/toothlight/toothlight-header"
import {
  listenModes,
  storyShelves,
  toothlightScenes,
} from "@/components/toothlight/toothlight-data"
import { openKeeperDoors } from "@/data/toothfairy/network-spine"
import styles from "@/components/toothlight/toothlight-v3-pages.module.css"

export const metadata: Metadata = {
  title: "Stories and Listen | Toothlight",
  description:
    "Keeper stories, read-alouds, and family traditions for Toothlight.",
}

const featuredStories = openKeeperDoors.slice(0, 4)

export default function ToothlightStoriesPage() {
  const family = toothlightDemoMemories[3]

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="Stories and listen">
        <Image
          src={toothlightScenes.stories}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <ToothlightHeader active="Stories" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Stories</p>
            <h1>Stories that lead back to their Toothlight.</h1>
            <p className={styles.lead}>
              Meet a keeper, follow a familiar tooth tradition, and return to
              the card your child made.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/toothfairy/stories">
                Read stories
              </Link>
              <Link className={styles.secondaryAction} href="/toothlight/network">
                See the Network
              </Link>
            </div>
          </div>
          <div className={styles.heroCard}>
            <ToothlightMemoryCard memory={family} size="large" />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="Story shelves">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Ways to read</p>
          <h2 className={styles.sectionTitle}>Read, listen, or add your family rule.</h2>
          <p>
            The shelf stays simple: short keeper stories, quiet read-alouds,
            and one path back to the Toothlight.
          </p>
        </div>
        <div className={styles.storyGrid}>
          {storyShelves.map((shelf) => (
            <Link key={shelf.title} href={shelf.href} className={styles.textLink}>
              <article className={styles.storyCard}>
                <span className={styles.miniStat}>Story</span>
                <strong>{shelf.title}</strong>
                <p>{shelf.body}</p>
              </article>
            </Link>
          ))}
        </div>
        <div className={styles.listenStrip} aria-label="Read and listen modes">
          {listenModes.map((mode) => (
            <article key={mode.title} className={styles.listenCard}>
              <span>{mode.label}</span>
              <strong>{mode.title}</strong>
              <p>{mode.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkBand} aria-label="Keeper story cards">
        <div className={styles.wideSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Meet the keepers</p>
            <h2 className={styles.sectionTitle}>Keepers children can recognize.</h2>
            <p>
              Tanda, Perez, Kkachi, and the first keepers give children a
              friendly way into the Network.
            </p>
          </div>
          <div className={styles.storyGrid}>
            {featuredStories.map((story) => (
              <Link key={story.id} href={story.href ?? "/toothfairy/stories"} className={styles.textLink}>
                <article className={styles.storyImageCard}>
                  <Image src={story.image} alt="" fill sizes="(min-width: 900px) 25vw, 100vw" />
                  <div>
                    <strong>{story.keeper}</strong>
                    <span>{story.title}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="Toothlight memory shelf">
        <div className={styles.split}>
          <div className={styles.visualPanel}>
            <Image src={toothlightScenes.atlas} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" />
          </div>
          <div className={styles.bodyPanel}>
            <p className={styles.eyebrow}>Back to the card</p>
            <h2 className={styles.panelTitle}>The story always comes home.</h2>
            <p className={styles.bodyCopy}>
              The keepers make the world bigger, but the center is still the
              child's own photo, drawing, date, and words.
            </p>
            <div className={styles.inlineCard}>
              <ToothlightMemoryCard memory={toothlightDemoMemories[1]} size="small" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
