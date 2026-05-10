'use client'

import Link from 'next/link'
import {
  allTraditionsForGlobe,
  allTraditionImages,
  wallCards,
  comingSoonTraditions,
} from '@/data/wall-cards'
import { LIVE_STORIES } from '@/data/stories'

const palette = {
  paper: '#fffaf1',
  cream: '#fbf7ee',
  parchment: '#efe3c8',
  ink: '#11234a',
  inkSoft: '#334260',
  muted: '#687188',
  forest: '#12261f',
  forestSoft: '#1d3a30',
  gold: '#d8a43c',
  goldDeep: '#9b690f',
  rose: '#bd536f',
  teal: '#2f917f',
  border: 'rgba(178, 151, 107, 0.32)',
}

const storyDetails: Record<string, {
  cover: string
  minutes: string
  chapter: string
  title: string
  collector: string
  doorway: string
  signal: string
  status: string
}> = {
  tanda: {
    cover: '/story-assets/tanda/v2/s1-frame-01-cover.png',
    minutes: '4 min',
    chapter: 'Story 1 - Meet Tanda',
    title: 'Tanda and the Night the Network Woke',
    collector: 'Tanda Fae',
    doorway: 'A skipped bedtime note wakes the Toothlight and sends Tanda looking for the other keepers.',
    signal: 'No tooth without its story. No story left behind.',
    status: 'Begin here',
  },
  'viking-origin': {
    cover: '/story-assets/viking-origin/v2/s2-frame-01-cover-v3.png',
    minutes: '5 min',
    chapter: 'Story 2 - The First Tooth Fee',
    title: 'Tanda Fae and the First Tooth Fee',
    collector: 'Tanda and her father',
    doorway: 'A father by the sea turns the first tooth fee into a promise to notice what a child outgrows.',
    signal: 'A fee is not a purchase. It is a promise to notice.',
    status: 'Origin story',
  },
  'ratoncito-perez': {
    cover: '/story-assets/ratoncito-perez/v2/rp3-frame-01-two-doors.png',
    minutes: '5 min',
    chapter: 'Story 3 - The Toothlight Treaty',
    title: 'The Toothlight Treaty',
    collector: 'Ratoncito Perez',
    doorway: 'A child with two true family traditions asks Perez and Tanda not to make her choose.',
    signal: 'Every keeper keeps their own door, rule, and voice.',
    status: 'Family traditions',
  },
  korea: {
    cover: '/story-assets/korea/v2/s4-frame-01-cover.png',
    minutes: '6 min',
    chapter: 'Story 4 - The Roof Song',
    title: 'Kkachi and the Roof Song',
    collector: 'Kkachi the Magpie',
    doorway: 'A rooftop song only works when Jiyoon learns to hear the family voice inside it.',
    signal: 'A message can shine without stealing the memory.',
    status: 'Now live',
  },
  'waraba-edge-light': {
    cover: '/story-assets/waraba-edge-light/v1/frames/s5-frame-01-cover.png',
    minutes: '5 min',
    chapter: 'Story 5 - The Edge of the Light',
    title: 'Waraba at the Edge of the Light',
    collector: 'Waraba',
    doorway: 'Ilyas learns that courage can walk beside fear when the ritual belongs to the dark beyond the kitchen light.',
    signal: 'Tanda can witness without replacing the keeper.',
    status: 'Now live',
  },
  'daga-one-year-wish': {
    cover: '/story-assets/daga-one-year-wish/site/story-06-story-card.png',
    minutes: '6 min',
    chapter: 'Story 6 - The One-Year Wish',
    title: 'Daga and the One-Year Wish',
    collector: 'Daga',
    doorway: 'Maya wants her wish now, but Daga protects the hidden promise until one year has changed her.',
    signal: 'Some magic needs time to answer.',
    status: 'Now live',
  },
  'anna-bogle': {
    cover: '/story-assets/anna/v2/finals/story7-frame-01-cover.png',
    minutes: '6 min',
    chapter: 'Story 7 - The Gap in the Gold',
    title: 'Anna Bogle and the Gap in the Gold',
    collector: 'Anna Bogle',
    doorway: 'Ryan expects gold, but Anna teaches him that a gift should prove the memory, not replace it.',
    signal: 'Trust returns when the old promise is heard clearly.',
    status: 'Now live',
  },
}

const memoryPrompts = [
  {
    title: 'Child chooses a keeper',
    body: 'Start with Tanda, Perez, or any collector on the atlas. The child gets to lead.',
  },
  {
    title: 'Grandparent tells the house version',
    body: 'Ask what happened in their house: a coin, a cup, a drawer, a roof toss, a prayer, a joke.',
  },
  {
    title: 'Save the family version',
    body: 'Add the memory beside the child\'s Toothlight so the family version does not disappear.',
  },
]

const collectorRoster = [
  {
    name: 'Tanda Fae',
    region: 'Network origin',
    role: 'Listens to the exact child-story and calls the keepers together without making them the same.',
    signal: 'Coordination',
    image: '/story-assets/tanda/v2/s1-frame-01-cover.png',
  },
  {
    name: "Tanda's father",
    region: 'First tooth fee',
    role: 'Shows Tanda that a tooth fee is not a purchase. It is care made visible.',
    signal: 'Promise',
    image: '/story-assets/viking-origin/v2/s2-frame-10-permission.png',
  },
  {
    name: 'Ratoncito Perez',
    region: 'Spain',
    role: 'Protects the local route while learning how one child can belong to two traditions.',
    signal: 'Pride',
    image: '/story-assets/ratoncito-perez/v2/rp3-frame-24-perez-apology.png',
  },
  {
    name: 'Kkachi',
    region: 'South Korea',
    role: 'A rooftop messenger who listens for the old family voice inside the new song.',
    signal: 'Listening',
    image: '/story-assets/characters/char-kkachi.png',
  },
  {
    name: 'Waraba',
    region: 'Ethiopia / Harar',
    role: 'Waits beyond the doorway for the child brave enough to step out while still afraid.',
    signal: 'Courage',
    image: '/story-assets/characters/char-waraba.png',
  },
  {
    name: 'Daga',
    region: 'Philippines',
    role: 'Keeps hidden wishes safe until time turns a want-now into a promise that can wait.',
    signal: 'Patience',
    image: '/story-assets/characters/char-daga.png',
  },
  {
    name: 'Anna Bogle',
    region: 'Ireland',
    role: 'Guards old gifts from becoming prizes and slowly decides the Network may be trusted again.',
    signal: 'Trust',
    image: '/story-assets/characters/char-anna-bogle-v2.png',
  },
  {
    name: 'The old forgetting',
    region: 'Next shelf teaser',
    role: 'A thin pressure at the edge of neglected memories. The keepers are beginning to notice.',
    signal: 'Warning',
    image: '/story-assets/babylonia/bb-02-worm-home.jpg',
  },
]

const storyRoadmap = [
  {
    number: '01',
    title: 'Tanda and the Night the Network Woke',
    place: 'Network origin',
    keeper: 'Tanda Fae',
    stage: 'Listening',
    engine: 'A skipped note teaches Tanda that a tooth without its story is not truly kept.',
    image: '/story-assets/tanda/v2/s1-frame-01-cover.png',
  },
  {
    number: '02',
    title: 'Tanda Fae and the First Tooth Fee',
    place: 'The Norse coast',
    keeper: "Tanda's father",
    stage: 'Promise',
    engine: 'The first tooth fee becomes a promise to notice what a child outgrows.',
    image: '/story-assets/viking-origin/v2/s2-frame-01-cover-v3.png',
  },
  {
    number: '03',
    title: 'The Toothlight Treaty',
    place: 'Madrid, Spain',
    keeper: 'Ratoncito Perez',
    stage: 'Treaty',
    engine: 'Two true family traditions learn to share one child without making either story smaller.',
    image: '/story-assets/ratoncito-perez/v2/rp3-frame-28-treaty-partners.png',
  },
  {
    number: '04',
    title: 'Kkachi and the Roof Song',
    place: 'South Korea',
    keeper: 'Kkachi',
    stage: 'Listening',
    engine: 'A rooftop song teaches that a brighter version still needs the family voice inside it.',
    image: '/story-assets/korea/v2/kkachi-story-card.png',
  },
  {
    number: '05',
    title: 'Waraba at the Edge of the Light',
    place: 'Ethiopia / Harar',
    keeper: 'Waraba',
    stage: 'Courage',
    engine: 'A doorway ritual lets a child walk with fear until it becomes part of the story.',
    image: '/story-assets/waraba-edge-light/v1/support/s5-landscape-story-card.png',
  },
  {
    number: '06',
    title: 'Daga and the One-Year Wish',
    place: 'Philippines',
    keeper: 'Daga',
    stage: 'Patience',
    engine: 'A hidden tooth waits long enough for the child to grow into a better wish.',
    image: '/story-assets/daga-one-year-wish/site/story-06-story-card.png',
  },
  {
    number: '07',
    title: 'Anna Bogle and the Gap in the Gold',
    place: 'Ireland',
    keeper: 'Anna Bogle',
    stage: 'Trust',
    engine: 'A guarded old keeper remembers that gold should mark the promise, not become the point.',
    image: '/story-assets/anna/v2/finals/story7-frame-01-cover.png',
  },
]

const atlasRoutes = [
  {
    place: 'Madrid, Spain',
    keeper: 'Ratoncito Perez',
    cue: 'A tooth under the pillow becomes a night route through the city.',
  },
  {
    place: 'South Korea',
    keeper: 'Kkachi the Magpie',
    cue: 'A rooftop call turns a lost tooth into a song that remembers its elder voice.',
  },
  {
    place: 'Ethiopia / Harar',
    keeper: 'Waraba',
    cue: 'A child steps to the edge of the light and asks courage to answer back.',
  },
  {
    place: 'Philippines',
    keeper: 'Daga',
    cue: 'A roof mouse hides a wish where only time can open it.',
  },
  {
    place: 'Ireland',
    keeper: 'Anna Bogle',
    cue: 'A gold gift becomes trustworthy again when it points back to the memory.',
  },
]

export default function StoriesPage() {
  const markers = allTraditionsForGlobe()
  const thumbnails = allTraditionImages()
  const liveStoryCount = LIVE_STORIES.length
  const totalTraditions = markers.length
  const atlasPreview = [...wallCards.slice(0, 6), ...comingSoonTraditions.slice(0, 3)]
  const filmstrip = thumbnails
    .filter((thumb) => thumb.active && !thumb.src.includes('placeholder'))
    .slice(0, 12)

  return (
    <main className="atlas-page">
      <section className="atlas-hero">
        <div className="hero-copy">
          <p className="eyebrow">Tooth Fairy Atlas</p>
          <h1>Seven keepers. Seven ways to make magic from a lost tooth.</h1>
          <p>
            Tanda's shelf now holds seven live storybooks: the original trilogy plus Kkachi, Waraba, Daga, and Anna Bogle. Each one protects a different kind of growing-up promise.
          </p>
          <div className="hero-actions">
            <Link href="#begin-reading">Read the stories</Link>
            <Link href="#atlas">Explore the atlas</Link>
          </div>
        </div>

        <div className="hero-gallery" aria-label="Storybook world preview">
          <figure className="gallery-main">
            <img src="/story-assets/viking-origin/vo-01-village.png" alt="" />
          </figure>
          <figure className="gallery-tanda">
            <img src="/story-assets/tanda/tf-05-tanda.png" alt="" />
          </figure>
          <figure className="gallery-perez">
            <img src="/story-assets/ratoncito-perez/v2/rp3-frame-10-tanda-arrives.png" alt="" />
          </figure>
          <div className="gallery-count">
            <span>{liveStoryCount}</span>
            <b>live stories now</b>
            <small>{totalTraditions} traditions on the atlas</small>
          </div>
        </div>
      </section>

      <section id="begin-reading" className="story-shelf">
        <div className="section-kicker">
          <p className="eyebrow">Start here</p>
          <h2>Seven bedtime stories now open the Tooth Fairy Network.</h2>
          <p>
            Begin with the original three, then keep going: Kkachi listens for the family song, Waraba waits at the edge of fear, Daga protects time, and Anna Bogle tests whether old trust can return.
          </p>
        </div>

        <div className="featured-grid">
          {LIVE_STORIES.map((story) => {
            const meta = storyDetails[story.id] ?? storyDetails.tanda
            return (
              <Link
                key={story.id}
                href={`/toothfairy/story/${story.id}`}
                className="feature-card"
                aria-label={`Read ${story.title}`}
              >
                <span className="feature-image">
                  <img src={meta.cover} alt="" />
                  <i>{meta.minutes}</i>
                </span>
                <span className="feature-copy">
                  <small>{meta.chapter}</small>
                  <strong>{meta.title}</strong>
                  <em>{meta.collector}</em>
                  <span>{meta.doorway}</span>
                  <b>{meta.signal}</b>
                  <u>{meta.status}</u>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section id="atlas" className="map-section">
        <div className="section-kicker centered">
          <p className="eyebrow">Explore the world</p>
          <h2>Every tooth tradition opens a door to culture.</h2>
          <p>
            The Network starts with bedtime, but every story opens a culture:
            how families mark courage, luck, responsibility, growing up, and
            memory.
          </p>
        </div>

        <div className="map-panel">
          <div className="atlas-board" aria-label="Story atlas route board">
            <div className="atlas-board-top">
              <div>
                <span>{totalTraditions}</span>
                <p>traditions ready to become family story nights</p>
              </div>
              <b>Doorways into culture</b>
            </div>
            <div className="atlas-routes">
              {atlasRoutes.map((route, index) => (
                <article key={route.place}>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <div>
                    <span>{route.place}</span>
                    <strong>{route.keeper}</strong>
                    <p>{route.cue}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="map-copy">
            <p className="eyebrow">Why it matters</p>
            <h3>Every tradition connects a child to someone older.</h3>
            <p>
              A child can begin with Tanda, then discover Perez in Spain,
              Kkachi in Korea, Waraba in Ethiopia, Daga in the Philippines,
              Anna Bogle in Ireland, and dozens of family rituals waiting to
              be preserved.
            </p>
            <div className="filmstrip" aria-label="Tradition image strip">
              {filmstrip.map((thumb) => (
                <Link key={thumb.slug} href={`/toothfairy/stories/${thumb.slug}`}>
                  <img src={thumb.src} alt="" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="atlas-ledger-heading">
          <p className="eyebrow">Coming stories</p>
          <h3>More keepers are waiting on the next shelf.</h3>
        </div>

        <div className="atlas-ledger">
          {atlasPreview.map((item) => (
            <Link
              key={item.slug}
              href={`/toothfairy/stories/${item.slug}`}
              className="ledger-row"
            >
              <span>{item.region}</span>
              <strong>{item.characterName}</strong>
              <small>{item.title}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="collector-section" aria-label="tooth keeper roster">
        <div className="section-kicker">
          <p className="eyebrow">Meet the keepers</p>
          <h2>Every place gives the tooth a different keeper.</h2>
          <p>
            Tanda does not replace the old ways. She finds the keepers already doing the work: proud, funny, careful, stubborn, brave, secretive, and guarded. The world gets bigger when each one keeps their own rule.
          </p>
        </div>
        <div className="collector-grid">
          {collectorRoster.map((collector) => (
            <article key={collector.name} className="collector-card">
              <span>
                <img src={collector.image} alt="" />
              </span>
              <div>
                <small>{collector.region}</small>
                <h3>{collector.name}</h3>
                <p>{collector.role}</p>
                <b>{collector.signal}</b>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap-section">
        <div className="section-kicker">
          <p className="eyebrow">Story shelf</p>
          <h2>The live shelf now opens seven different doors.</h2>
          <p>
            Each story has its own emotional job: listening, promise, treaty, courage, patience, trust, and the first hint that neglected memories can push back.
          </p>
        </div>
        <div className="roadmap-grid">
          {storyRoadmap.map((story) => (
            <article key={story.number} className="roadmap-card">
              <span>
                <img src={story.image} alt="" />
              </span>
              <div>
                <small>{story.number} / {story.stage}</small>
                <h3>{story.title}</h3>
                <p>{story.place} - {story.keeper}</p>
                <b>{story.engine}</b>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="memory-band" aria-label="family memory bridge">
        <div className="memory-copy">
          <p className="eyebrow">Ask someone who remembers</p>
          <h2>Turn story night into a family memory.</h2>
          <p>
            This is the handoff for parents: choose a story, invite a
            grandparent or family storyteller to share their version, then save
            that memory beside the child&apos;s Toothlight.
          </p>
          <div className="memory-prompts">
            {memoryPrompts.map((prompt, index) => (
              <article key={prompt.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{prompt.title}</h3>
                  <p>{prompt.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="memory-links">
            <Link href="/toothfairy/grandparents">Add your story</Link>
            <Link href="/toothfairy/faq">Read the FAQ</Link>
          </div>
        </div>
        <div className="memory-image">
          <img src="/story-assets/viking-origin/vo-02b-kneeling.png" alt="" />
        </div>
      </section>

      <section className="close-band">
        <p>
          Read one story together. Ask someone who remembers. Save the version
          only this family could tell.
        </p>
        <Link href="/toothfairy/grandparents">Add your story</Link>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .atlas-page {
          --paper: ${palette.paper};
          --cream: ${palette.cream};
          --parchment: ${palette.parchment};
          --ink: ${palette.ink};
          --ink-soft: ${palette.inkSoft};
          --muted: ${palette.muted};
          --forest: ${palette.forest};
          --forest-soft: ${palette.forestSoft};
          --gold: ${palette.gold};
          --gold-deep: ${palette.goldDeep};
          --rose: ${palette.rose};
          --teal: ${palette.teal};
          --border: ${palette.border};
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 84% 8%, rgba(216, 164, 60, 0.16), transparent 24rem),
            linear-gradient(90deg, rgba(17, 35, 74, 0.045) 1px, transparent 1px),
            linear-gradient(180deg, #fffaf1 0%, #fbf7ee 52%, #f1e5cd 100%);
          background-size: auto, 58px 58px, auto;
          color: var(--ink);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .atlas-hero,
        .story-shelf,
        .grandparents-band,
        .map-section,
        .collector-section,
        .roadmap-section,
        .memory-band,
        .next-stories,
        .close-band {
          width: min(100% - 40px, 1200px);
          margin: 0 auto;
        }

        .atlas-hero {
          display: grid;
          gap: 3.5rem;
          align-items: center;
          min-height: min(780px, calc(100vh - 72px));
          padding: 72px 0 58px;
        }

        .eyebrow {
          margin: 0 0 0.82rem;
          color: var(--gold-deep);
          font-size: 0.74rem;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3 {
          margin: 0;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          letter-spacing: 0;
        }

        h1 {
          max-width: 820px;
          font-size: clamp(3.25rem, 7.2vw, 6.25rem);
          line-height: 0.9;
        }

        h2 {
          max-width: 820px;
          font-size: clamp(2.3rem, 4.6vw, 4.1rem);
          line-height: 0.95;
        }

        h3 {
          font-size: clamp(1.55rem, 2.4vw, 2rem);
          line-height: 1.02;
        }

        p {
          color: var(--ink-soft);
          line-height: 1.6;
        }

        .hero-copy > p,
        .section-kicker > p:not(.eyebrow),
        .grandparent-copy > p,
        .map-copy > p:not(.eyebrow) {
          max-width: 700px;
          margin: 1rem 0 0;
          font-size: 1.08rem;
        }

        .hero-actions,
        .grandparent-links,
        .memory-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.82rem;
          margin-top: 1.65rem;
        }

        .hero-actions a,
        .grandparent-links a,
        .memory-links a,
        .close-band a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 1.15rem;
          font-weight: 950;
          text-decoration: none;
        }

        .hero-actions a:first-child,
        .grandparent-links a:first-child,
        .memory-links a:first-child,
        .close-band a {
          background: linear-gradient(135deg, var(--gold), #efc56d);
          color: #2c2148;
          box-shadow: 0 18px 42px rgba(151, 102, 12, 0.18);
        }

        .hero-actions a:not(:first-child),
        .grandparent-links a:not(:first-child),
        .memory-links a:not(:first-child) {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.66);
          color: var(--ink);
        }

        .hero-gallery {
          position: relative;
          min-height: 570px;
        }

        .hero-gallery:before {
          position: absolute;
          inset: 9% 8% 7%;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--forest), var(--forest-soft));
          box-shadow: 0 34px 80px rgba(18, 38, 31, 0.2);
          content: '';
        }

        figure {
          margin: 0;
        }

        .gallery-main,
        .gallery-tanda,
        .gallery-perez,
        .gallery-count {
          position: absolute;
          overflow: hidden;
          border: 1px solid rgba(255, 250, 241, 0.42);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 24px 56px rgba(18, 38, 31, 0.2);
        }

        .gallery-main {
          inset: 2% 16% 12% 3%;
        }

        .gallery-tanda {
          right: 0;
          top: 14%;
          width: 42%;
          aspect-ratio: 3 / 4;
        }

        .gallery-perez {
          left: 5%;
          bottom: 0;
          width: 34%;
          aspect-ratio: 3 / 4;
        }

        .gallery-count {
          right: 6%;
          bottom: 10%;
          width: min(260px, 44vw);
          padding: 1rem;
          z-index: 2;
        }

        .gallery-main img,
        .gallery-tanda img,
        .gallery-perez img,
        .feature-image img,
        .grandparent-image img,
        .memory-image img,
        .filmstrip img,
        .collector-card img,
        .roadmap-card img,
        .upcoming-grid img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-main figcaption,
        .gallery-tanda figcaption,
        .gallery-perez figcaption {
          position: absolute;
          left: 0.85rem;
          right: 0.85rem;
          bottom: 0.85rem;
          z-index: 1;
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.9);
          color: var(--ink);
          padding: 0.72rem;
          font-weight: 900;
          line-height: 1.2;
        }

        .gallery-main:after,
        .gallery-tanda:after,
        .gallery-perez:after {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 48%, rgba(18, 38, 31, 0.42));
          content: '';
        }

        .gallery-main figcaption span {
          display: block;
          color: var(--gold-deep);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .gallery-main figcaption b {
          display: block;
          margin-top: 0.25rem;
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.18rem;
          line-height: 1.02;
        }

        .gallery-tanda figcaption,
        .gallery-perez figcaption {
          font-size: 0.82rem;
        }

        .gallery-count span,
        .map-stats span {
          display: block;
          color: var(--forest);
          font-family: var(--font-display), Georgia, serif;
          font-size: 4.2rem;
          font-weight: 950;
          line-height: 0.85;
        }

        .gallery-count b,
        .gallery-count small {
          display: block;
        }

        .gallery-count b {
          margin-top: 0.4rem;
          color: var(--ink);
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .gallery-count small {
          margin-top: 0.35rem;
          color: var(--ink-soft);
          font-weight: 850;
        }

        .story-shelf,
        .grandparents-band,
        .map-section,
        .collector-section,
        .roadmap-section,
        .memory-band,
        .next-stories,
        .close-band {
          border-top: 1px solid var(--border);
          padding: 68px 0;
        }

        .section-kicker.centered {
          max-width: 790px;
          margin: 0 auto;
          text-align: center;
        }

        .section-kicker.centered h2,
        .section-kicker.centered p {
          margin-left: auto;
          margin-right: auto;
        }

        .featured-grid {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }

        .feature-card {
          display: grid;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.82);
          color: inherit;
          text-decoration: none;
          box-shadow: 0 20px 46px rgba(48, 38, 24, 0.08);
          transition: transform 220ms ease, box-shadow 220ms ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 66px rgba(48, 38, 24, 0.13);
        }

        .feature-image {
          position: relative;
          display: block;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: var(--parchment);
        }

        .feature-image i {
          position: absolute;
          right: 0.8rem;
          bottom: 0.8rem;
          border-radius: 999px;
          background: rgba(255, 250, 241, 0.92);
          color: var(--ink);
          padding: 0.34rem 0.6rem;
          font-size: 0.78rem;
          font-style: normal;
          font-weight: 950;
        }

        .feature-copy {
          display: grid;
          gap: 0.52rem;
          padding: 1.05rem;
        }

        .feature-copy small,
        .feature-copy em,
        .feature-copy b,
        .feature-copy u {
          text-decoration: none;
          font-style: normal;
        }

        .feature-copy small,
        .collector-card small,
        .upcoming-grid small {
          color: var(--gold-deep);
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .feature-copy strong {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.82rem;
          line-height: 0.98;
        }

        .feature-copy em {
          color: var(--teal);
          font-weight: 950;
        }

        .feature-copy span {
          color: var(--ink-soft);
          line-height: 1.48;
        }

        .feature-copy b {
          color: var(--forest);
          font-size: 0.94rem;
          line-height: 1.35;
        }

        .feature-copy u {
          border-top: 1px solid var(--border);
          color: var(--rose);
          padding-top: 0.62rem;
          font-size: 0.9rem;
          font-weight: 950;
          line-height: 1.35;
        }

        .grandparents-band {
          display: grid;
          gap: 2.4rem;
          align-items: center;
        }

        .grandparent-image {
          min-height: 560px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--forest);
          box-shadow: 0 26px 70px rgba(20, 41, 32, 0.17);
        }

        .grandparent-copy {
          max-width: 680px;
        }

        .grandparent-steps {
          display: grid;
          gap: 0.82rem;
          margin-top: 1.45rem;
        }

        .grandparent-steps article {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 0.9rem;
          align-items: start;
          border: 1px solid rgba(18, 38, 31, 0.16);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.62);
          padding: 1rem;
        }

        .grandparent-steps span {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.18);
          color: var(--gold-deep);
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .grandparent-steps h3 {
          font-size: 1.35rem;
        }

        .grandparent-steps p {
          margin: 0.4rem 0 0;
          font-size: 0.96rem;
        }

        .map-panel {
          display: grid;
          gap: 1.4rem;
          align-items: stretch;
          margin-top: 2.1rem;
          border: 1px solid rgba(255, 250, 241, 0.24);
          border-radius: 8px;
          background:
            radial-gradient(circle at 30% 42%, rgba(216, 164, 60, 0.18), transparent 18rem),
            linear-gradient(135deg, var(--forest), var(--forest-soft));
          color: var(--paper);
          padding: 1.2rem;
          box-shadow: 0 28px 80px rgba(18, 38, 31, 0.18);
        }

        .atlas-board {
          position: relative;
          display: grid;
          gap: 1.1rem;
          min-height: 470px;
          align-content: space-between;
          overflow: hidden;
          border: 1px solid rgba(255, 250, 241, 0.16);
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(255, 250, 241, 0.1), transparent 32%),
            linear-gradient(180deg, rgba(255, 250, 241, 0.06), rgba(255, 250, 241, 0.02));
          padding: clamp(1rem, 2.3vw, 1.45rem);
        }

        .atlas-board:before {
          position: absolute;
          inset: -20% -8% auto auto;
          width: 62%;
          aspect-ratio: 1;
          border: 1px solid rgba(255, 250, 241, 0.12);
          border-radius: 999px;
          background: radial-gradient(circle, rgba(216, 164, 60, 0.2), transparent 64%);
          content: '';
        }

        .atlas-board-top,
        .atlas-routes {
          position: relative;
          z-index: 1;
        }

        .atlas-board-top {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          justify-content: space-between;
        }

        .atlas-board-top span {
          display: block;
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(4.5rem, 9vw, 7.2rem);
          font-weight: 950;
          line-height: 0.78;
        }

        .atlas-board-top p {
          max-width: 300px;
          margin: 0.7rem 0 0;
          color: rgba(255, 250, 241, 0.82);
          font-weight: 900;
          line-height: 1.32;
        }

        .atlas-board-top b {
          display: inline-flex;
          border: 1px solid rgba(255, 250, 241, 0.2);
          border-radius: 999px;
          background: rgba(255, 250, 241, 0.1);
          color: var(--paper);
          padding: 0.5rem 0.72rem;
          font-size: 0.72rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .atlas-routes {
          display: grid;
          gap: 0.62rem;
        }

        .atlas-routes article {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 0.78rem;
          border: 1px solid rgba(255, 250, 241, 0.14);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.08);
          padding: 0.78rem;
        }

        .atlas-routes small {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.2);
          color: var(--paper);
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .atlas-routes span {
          display: block;
          color: rgba(255, 250, 241, 0.72);
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .atlas-routes strong {
          display: block;
          margin-top: 0.18rem;
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.28rem;
          line-height: 1;
        }

        .atlas-routes p {
          margin: 0.32rem 0 0;
          color: rgba(255, 250, 241, 0.82);
          font-size: 0.92rem;
          line-height: 1.36;
        }

        .globe-card {
          display: grid;
          min-height: 470px;
          place-items: center;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 250, 241, 0.16);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.06);
        }

        .static-globe {
          position: relative;
          width: min(86%, 390px);
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 999px;
          background:
            radial-gradient(circle at 31% 27%, rgba(255, 250, 241, 0.95), rgba(255, 250, 241, 0.08) 18%, transparent 34%),
            radial-gradient(circle at 42% 48%, rgba(216, 164, 60, 0.45), transparent 11%),
            radial-gradient(circle at 70% 42%, rgba(47, 145, 127, 0.58), transparent 15%),
            radial-gradient(circle at 31% 49%, rgba(47, 145, 127, 0.52), transparent 13%),
            linear-gradient(135deg, #f1dfaa 0%, #426f5d 43%, #102d25 100%);
          box-shadow:
            inset -28px -36px 54px rgba(4, 19, 16, 0.46),
            inset 24px 22px 44px rgba(255, 250, 241, 0.16),
            0 26px 68px rgba(0, 0, 0, 0.18);
        }

        .static-globe:before,
        .static-globe:after,
        .globe-shine,
        .globe-line {
          position: absolute;
          pointer-events: none;
          content: '';
        }

        .static-globe:before {
          inset: 8%;
          border: 1px solid rgba(255, 250, 241, 0.16);
          border-radius: 999px;
        }

        .static-globe:after {
          inset: 0;
          background:
            linear-gradient(90deg, transparent 49%, rgba(255, 250, 241, 0.13) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(255, 250, 241, 0.12) 50%, transparent 51%);
          opacity: 0.75;
        }

        .globe-shine {
          inset: 0;
          background: radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.42), transparent 30%);
        }

        .globe-line {
          left: 50%;
          top: 50%;
          width: 84%;
          height: 84%;
          border: 1px solid rgba(255, 250, 241, 0.15);
          border-radius: 999px;
          transform: translate(-50%, -50%);
        }

        .line-one {
          width: 44%;
        }

        .line-two {
          height: 44%;
        }

        .line-three {
          width: 18%;
        }

        .static-globe i {
          position: absolute;
          z-index: 2;
          width: 11px;
          height: 11px;
          border: 2px solid rgba(255, 250, 241, 0.86);
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.9);
          box-shadow: 0 0 0 8px rgba(216, 164, 60, 0.12);
          transform: translate(-50%, -50%);
        }

        .static-globe i.active {
          width: 14px;
          height: 14px;
          background: #fffaf1;
          box-shadow:
            0 0 0 7px rgba(216, 164, 60, 0.16),
            0 0 30px rgba(255, 250, 241, 0.72);
        }

        .static-globe i b {
          position: absolute;
          left: 14px;
          top: 50%;
          display: block;
          width: max-content;
          max-width: 130px;
          border-radius: 999px;
          background: rgba(255, 250, 241, 0.88);
          color: var(--ink);
          padding: 0.24rem 0.45rem;
          font-size: 0.68rem;
          font-style: normal;
          line-height: 1;
          opacity: 0;
          transform: translateY(-50%);
          transition: opacity 180ms ease;
        }

        .static-globe i:nth-of-type(1) b,
        .static-globe i:nth-of-type(2) b,
        .static-globe i:nth-of-type(3) b,
        .static-globe i:hover b {
          opacity: 1;
        }

        .map-stats {
          position: absolute;
          left: 1rem;
          bottom: 1rem;
          width: min(260px, calc(100% - 2rem));
          border: 1px solid rgba(255, 250, 241, 0.2);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.9);
          padding: 0.95rem;
        }

        .map-stats p {
          margin: 0.42rem 0 0;
          color: var(--ink);
          font-weight: 950;
          line-height: 1.25;
        }

        .map-copy {
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.94);
          padding: clamp(1.15rem, 2.4vw, 1.8rem);
        }

        .map-copy h3,
        .map-copy p {
          color: var(--ink);
        }

        .filmstrip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.55rem;
          margin-top: 1.3rem;
        }

        .filmstrip a {
          display: block;
          aspect-ratio: 1;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--parchment);
        }

        .atlas-ledger {
          display: grid;
          gap: 0;
          margin-top: 1rem;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.78);
        }

        .atlas-ledger-heading {
          margin-top: 1.35rem;
        }

        .atlas-ledger-heading h3 {
          max-width: 620px;
        }

        .ledger-row {
          display: grid;
          gap: 0.3rem;
          min-height: 116px;
          padding: 0.95rem 1rem;
          color: inherit;
          text-decoration: none;
        }

        .ledger-row:not(:last-child) {
          border-bottom: 1px solid var(--border);
        }

        .ledger-row span {
          color: var(--teal);
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .ledger-row strong {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.3rem;
          line-height: 1;
        }

        .ledger-row small {
          color: var(--muted);
          font-weight: 850;
        }

        .collector-grid,
        .upcoming-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1.8rem;
        }

        .collector-card,
        .upcoming-grid article {
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.82);
          box-shadow: 0 20px 46px rgba(48, 38, 24, 0.08);
        }

        .collector-card span {
          display: block;
          aspect-ratio: 4 / 3;
          background: var(--parchment);
        }

        .collector-card div,
        .upcoming-grid div {
          padding: 1rem;
        }

        .collector-card h3 {
          margin-top: 0.35rem;
        }

        .collector-card p {
          margin: 0.55rem 0 0;
          font-size: 0.96rem;
        }

        .collector-card b {
          display: inline-flex;
          width: fit-content;
          margin-top: 0.8rem;
          border: 1px solid rgba(47, 145, 127, 0.24);
          border-radius: 999px;
          background: rgba(47, 145, 127, 0.08);
          color: var(--teal);
          padding: 0.28rem 0.56rem;
          font-size: 0.72rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .roadmap-grid {
          display: grid;
          gap: 0.9rem;
          margin-top: 1.8rem;
        }

        .roadmap-card {
          display: grid;
          grid-template-columns: 124px 1fr;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.84);
          box-shadow: 0 18px 42px rgba(48, 38, 24, 0.07);
        }

        .roadmap-card span {
          min-height: 150px;
          background: var(--parchment);
        }

        .roadmap-card div {
          padding: 0.95rem 1rem;
        }

        .roadmap-card small {
          color: var(--gold-deep);
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .roadmap-card h3 {
          margin-top: 0.4rem;
          font-size: clamp(1.28rem, 2.2vw, 1.8rem);
          line-height: 1;
        }

        .roadmap-card p {
          margin: 0.5rem 0 0;
          color: var(--teal);
          font-size: 0.94rem;
          font-weight: 950;
        }

        .roadmap-card b {
          display: block;
          margin-top: 0.52rem;
          color: var(--ink-soft);
          font-size: 0.94rem;
          line-height: 1.38;
        }

        .memory-band {
          display: grid;
          gap: 2rem;
          align-items: center;
        }

        .memory-copy {
          max-width: 690px;
        }

        .memory-prompts {
          display: grid;
          gap: 0.82rem;
          margin-top: 1.45rem;
        }

        .memory-prompts article {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 0.9rem;
          align-items: start;
          border: 1px solid rgba(18, 38, 31, 0.16);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.62);
          padding: 1rem;
        }

        .memory-prompts span {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.18);
          color: var(--gold-deep);
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .memory-prompts h3 {
          font-size: 1.35rem;
        }

        .memory-prompts p {
          margin: 0.4rem 0 0;
          font-size: 0.96rem;
        }

        .memory-image {
          min-height: 500px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--forest);
          box-shadow: 0 26px 70px rgba(20, 41, 32, 0.17);
        }

        .upcoming-grid article {
          display: grid;
          grid-template-columns: 140px 1fr;
        }

        .upcoming-grid span {
          min-height: 170px;
          background: var(--parchment);
        }

        .upcoming-grid p {
          margin: 0.48rem 0 0;
          color: var(--teal);
          font-weight: 950;
        }

        .upcoming-grid b {
          display: block;
          margin-top: 0.55rem;
          color: var(--ink-soft);
          line-height: 1.42;
        }

        .close-band {
          display: grid;
          gap: 1.2rem;
          align-items: center;
          padding-bottom: 86px;
        }

        .close-band p {
          max-width: 790px;
          margin: 0;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.65rem);
          line-height: 1.08;
        }

        @media (min-width: 860px) {
          .atlas-hero {
            grid-template-columns: minmax(0, 0.88fr) minmax(430px, 1.12fr);
          }

          .featured-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .grandparents-band {
            grid-template-columns: minmax(340px, 0.72fr) minmax(0, 1fr);
          }

          .map-panel {
            grid-template-columns: minmax(420px, 0.92fr) minmax(0, 0.82fr);
          }

          .atlas-ledger {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .ledger-row:not(:last-child) {
            border-bottom: 0;
            border-right: 1px solid var(--border);
          }

          .collector-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .roadmap-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .memory-band {
            grid-template-columns: minmax(0, 1fr) minmax(340px, 0.72fr);
          }

          .upcoming-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .upcoming-grid article {
            grid-template-columns: 1fr;
          }

          .close-band {
            grid-template-columns: minmax(0, 1fr) auto;
          }
        }

        @media (max-width: 680px) {
          .atlas-hero,
          .story-shelf,
          .grandparents-band,
          .map-section,
          .collector-section,
          .roadmap-section,
          .memory-band,
          .next-stories,
          .close-band {
            width: min(100% - 28px, 1200px);
          }

          .atlas-hero {
            min-height: auto;
            padding-top: 42px;
          }

          .hero-gallery {
            min-height: 520px;
          }

          .gallery-main {
            inset: 4% 5% 24% 0;
          }

          .gallery-tanda {
            width: 50%;
            right: 0;
            top: 20%;
          }

          .gallery-perez {
            width: 44%;
          }

          .gallery-count {
            right: 2%;
            bottom: 5%;
          }

          .hero-actions a,
          .grandparent-links a,
          .memory-links a,
          .close-band a {
            width: 100%;
          }

          .grandparent-image {
            min-height: 420px;
          }

          .memory-image {
            min-height: 380px;
          }

          .roadmap-card {
            grid-template-columns: 1fr;
          }

          .roadmap-card span {
            min-height: 220px;
          }

          .globe-card {
            min-height: 420px;
          }

          .filmstrip {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .collector-grid {
            grid-template-columns: 1fr;
          }
        }
      `,
        }}
      />
    </main>
  )
}
