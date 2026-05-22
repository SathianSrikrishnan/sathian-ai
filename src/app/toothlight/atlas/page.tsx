import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ToothlightMemoryCard,
  toothlightDemoMemories,
  toothlightNetworkMemories,
} from "@/components/toothlight/toothlight-memory-card"
import { ToothlightHeader } from "@/components/toothlight/toothlight-header"
import {
  atlasArrivalBeats,
  atlasDistricts,
  atlasMemoryPlacements,
  atlasSignalNodes,
  atlasTraditionPaths,
  networkPulseItems,
  toothlightScenes,
} from "@/components/toothlight/toothlight-data"
import {
  contributionDoor,
  futureKeeperDoors,
  openKeeperDoors,
} from "@/data/toothfairy/network-spine"
import styles from "@/components/toothlight/toothlight-v3-pages.module.css"

export const metadata: Metadata = {
  title: "Toothlight Network | Toothlight",
  description:
    "Explore the Toothlight Network, where family memory cards meet keeper stories and lost-tooth traditions.",
}

function pointStyle(x: string, y: string, index: number): CSSProperties {
  return {
    "--x": x,
    "--y": y,
    "--delay": `${(index % 10) * 0.16}s`,
  } as CSSProperties
}

function districtStyle(district: (typeof atlasDistricts)[number]): CSSProperties {
  return {
    "--x": district.x,
    "--y": district.y,
    "--accent": district.accent,
  } as CSSProperties
}

function accentStyle(accent: string): CSSProperties {
  return { "--accent": accent } as CSSProperties
}

export default function ToothlightAtlasPage() {
  const featured = toothlightDemoMemories[3]
  const arriving = toothlightDemoMemories[0]
  const memoryExamples = toothlightNetworkMemories.slice(0, 7)
  const keeperDoors = openKeeperDoors
  const storyPathDoors = keeperDoors.map((door, index) => ({
    door,
    memory: memoryExamples[index % memoryExamples.length],
  }))
  const listeningDoors = [...futureKeeperDoors.slice(0, 6), contributionDoor]

  return (
    <main className={[styles.page, styles.darkPage].join(" ")}>
      <section className={styles.hero} aria-label="Toothlight Network">
        <Image
          src={toothlightScenes.atlas}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <ToothlightHeader active="Network" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Toothlight Network</p>
            <h1>The Toothlight Network.</h1>
            <p className={styles.lead}>
              Every Toothlight begins as a real family card. The Network gives
              that card keeper stories, tradition paths, and a gentle place to
              belong.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/toothlight/make">
                Make a Toothlight
              </Link>
              <Link className={styles.secondaryAction} href="#keepers">
                Meet the keepers
              </Link>
            </div>
          </div>
          <div className={styles.heroCard}>
            <ToothlightMemoryCard memory={featured} size="large" />
          </div>
        </div>
      </section>

      <section className={styles.networkExampleBand} aria-label="Toothlights in the Network">
        <div className={styles.wideSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Real Toothlights</p>
            <h2 className={styles.sectionTitle}>The card stays at the center.</h2>
            <p>
              These examples are Toothlight memories already made. One open
              space shows where the next family card can join.
            </p>
          </div>
          <div className={styles.networkExampleGrid}>
            {memoryExamples.map((memory) => (
              <div key={memory.title} className={styles.networkExampleCard}>
                <ToothlightMemoryCard memory={memory} size="small" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="keepers" className={styles.darkBand} aria-label="Keeper council">
        <div className={styles.wideSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Meet the keepers</p>
            <h2 className={styles.sectionTitle}>Keeper doors children can follow.</h2>
            <p>
              Each keeper carries one familiar way families remember a lost
              tooth: under a pillow, toward the sky, into the earth, across
              water, or through a rule only one family knows.
            </p>
          </div>

          <div className={styles.keeperCouncilGrid}>
            {keeperDoors.map((door) => (
              <Link
                href={door.href ?? "/toothlight/stories"}
                key={door.id}
                className={styles.keeperCouncilCard}
                style={accentStyle(door.accent)}
              >
                <Image
                  src={door.image}
                  alt=""
                  fill
                  sizes="(min-width: 1000px) 28vw, 92vw"
                />
                <div>
                  <span>{door.keeper}</span>
                  <strong>{door.title}</strong>
                  <p>{door.region}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.lightBand} aria-label="Seven active story paths">
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Story paths</p>
            <h2 className={styles.sectionTitle}>Choose the path that feels close.</h2>
            <p>
              A Toothlight can sit beside a keeper story, a place, or a small
              ritual that feels close to what happened at home.
            </p>
          </div>

          <div className={styles.networkStoryGrid}>
            {storyPathDoors.map(({ door, memory }) => (
              <article
                key={door.id}
                className={styles.networkStoryCard}
                style={accentStyle(door.accent)}
              >
                <div className={styles.networkStoryImage}>
                  <Image src={door.image} alt="" fill sizes="(min-width: 900px) 22vw, 92vw" />
                </div>
                <div>
                  <span>{door.chapter} / {door.region}</span>
                  <strong>{door.keeper}</strong>
                  <p>{door.readerHook}</p>
                  <em className={styles.storyMemoryTag}>Toothlight: {memory.title}</em>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.networkPulseBand} aria-label="What lives in the Network">
        <div className={styles.section}>
          <div className={styles.networkPulseIntro}>
            <p className={styles.eyebrow}>Inside the Network</p>
            <h2 className={styles.sectionTitle}>Cards, keepers, and family ways.</h2>
            <p>
              Start with the card. Meet a keeper. Follow a path. Add the version
              your family already knows.
            </p>
          </div>
          <div className={styles.networkPulseGrid}>
            {networkPulseItems.map((item) => (
              <article key={item.title} className={styles.networkPulseCard}>
                <span>{item.label}</span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.atlasField} aria-label="Toothlight Network map">
        <div className={styles.wideSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Living field</p>
            <h2 className={styles.sectionTitle}>A gentle place for each card.</h2>
            <p>
              The field gives every card a sense of place. The real memory stays
              visible while soft paths show the world around it.
            </p>
          </div>

          <div className={styles.atlasWorkbench}>
            <aside className={styles.atlasSidebar} aria-label="Ways to browse the Network">
              <div>
                <p className={styles.eyebrow}>Ways in</p>
                <div className={styles.atlasFilters}>
                  <span>Family cards</span>
                  <span>Keeper stories</span>
                  <span>Tradition paths</span>
                  <span>Your family rule</span>
                </div>
              </div>
              <div className={styles.arrivalStack}>
                {atlasArrivalBeats.map((beat) => (
                  <article key={beat.label} className={styles.arrivalCard}>
                    <span>{beat.label}</span>
                    <strong>{beat.title}</strong>
                    <p>{beat.body}</p>
                  </article>
                ))}
              </div>
            </aside>

            <div className={styles.atlasMapFrame}>
              <div className={styles.atlasMap}>
                <Image
                  src={toothlightScenes.atlas}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 900px) 960px, 100vw"
                  className={styles.mapImage}
                />
                <div className={styles.mapShade} />
                <span className={styles.networkPathOne} aria-hidden />
                <span className={styles.networkPathTwo} aria-hidden />
                <span className={styles.networkPathThree} aria-hidden />
                {atlasSignalNodes.map(([x, y], index) => (
                  <span
                    key={`${x}-${y}-${index}`}
                    className={styles.signalNode}
                    style={pointStyle(x, y, index)}
                    aria-hidden
                  />
                ))}
                <div className={styles.centralArrival} aria-hidden>
                  <span />
                  <strong>New Toothlight</strong>
                </div>
                {atlasDistricts.map((district) => (
                  <article
                    key={district.name}
                    className={styles.district}
                    style={districtStyle(district)}
                  >
                    <span>{district.kind}</span>
                    <strong>{district.name}</strong>
                    <p>{district.body}</p>
                  </article>
                ))}
                <div className={styles.memoryDock} aria-label="New Toothlight entering the Network">
                  <ToothlightMemoryCard memory={arriving} size="small" />
                  <ToothlightMemoryCard memory={featured} size="small" />
                </div>
              </div>
              <div className={styles.mapLegend}>
                <span>Warm points are family memories.</span>
                <span>Soft paths lead to keeper stories.</span>
                <span>Gold cards are real Toothlight examples.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.lightBand} aria-label="Memory placements">
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>How cards join</p>
            <h2 className={styles.sectionTitle}>The memory stays visible everywhere.</h2>
            <p>
              Whether a card meets a keeper, a place, or a family rule, the
              photo, drawing, date, and words stay easy to see.
            </p>
          </div>
          <div className={styles.memoryGrid}>
            {toothlightDemoMemories.map((memory, index) => {
              const placement = atlasMemoryPlacements[index]
              return (
                <article key={memory.title} className={styles.memoryPlacement}>
                  <ToothlightMemoryCard memory={memory} size="small" />
                  <div>
                    <span className={styles.miniStat}>{placement.path}</span>
                    <strong>{placement.district}</strong>
                    <p>{placement.signal}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={styles.darkBand} aria-label="Keeper story doors">
        <div className={styles.wideSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>More traditions</p>
            <h2 className={styles.sectionTitle}>More family ways can join.</h2>
            <p>
              More places, songs, phrases, and family rules can join as the
              Network grows.
            </p>
          </div>

          <div className={styles.listeningGrid} aria-label="Listening doors">
            {listeningDoors.map((door) => (
              <article
                key={door.id}
                className={styles.listeningCard}
                style={accentStyle(door.accent)}
              >
                <span>{door.region}</span>
                <strong>{door.title}</strong>
                <p>{door.readerHook}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.lightBand} aria-label="Tradition paths">
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Ways families remember</p>
            <h2 className={styles.sectionTitle}>Five simple paths through the Network.</h2>
            <p>
              Some teeth go under pillows. Some go upward, into the earth, into
              water, or into a rule only one family knows.
            </p>
          </div>
          <div className={styles.pathGrid}>
            {atlasTraditionPaths.map((path) => (
              <article
                key={path.name}
                className={styles.pathCard}
                style={accentStyle(path.accent)}
              >
                <span>{path.district}</span>
                <strong>{path.name}</strong>
                <p>{path.body}</p>
              </article>
            ))}
          </div>

          <div className={styles.atlasCta}>
            <div>
              <p className={styles.eyebrow}>Your family door</p>
              <h2 className={styles.sectionTitle}>What does your family do?</h2>
            </div>
            <p>
              A phrase, a drawing, a joke, a roof toss, a note under the pillow:
              your Toothlight can carry the version that really happened.
            </p>
            <Link className={styles.primaryAction} href="/toothlight/filter-lab">
              Choose a photo style
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
