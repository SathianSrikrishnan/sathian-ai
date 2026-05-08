'use client'

import Link from 'next/link'
import {
  allTraditionsForGlobe,
  allTraditionImages,
  wallCards,
  comingSoonTraditions,
} from '@/data/wall-cards'
import { FEATURED_STORIES } from '@/data/stories'

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
    chapter: 'Chapter 1 - Meet Tanda',
    title: 'Tanda and the Night the Network Woke',
    collector: 'Tanda Fae',
    doorway: 'A skipped bedtime note wakes the Toothlight and sends Tanda looking for the other keepers.',
    signal: 'No tooth without its story. No story left for after.',
    status: '32-frame flagship origin',
  },
  'viking-origin': {
    cover: '/story-assets/viking-origin/vo-01-village.png',
    minutes: '5 min',
    chapter: 'Chapter 2 - The Original Tooth Fairy',
    title: 'Tanda Fae and the Tooth Fee',
    collector: 'Tanda Fae',
    doorway: 'A father by the sea turns a small tooth into proof of growing up.',
    signal: 'This is where Tanda becomes the Original Tooth Fairy: not by taking the tooth, but by protecting the promise.',
    status: '33-frame storybook ready',
  },
  'ratoncito-perez': {
    cover: '/story-assets/ratoncito-perez/v2/rp3-frame-01-two-doors.png',
    minutes: '5 min',
    chapter: 'Chapter 3 - The Toothlight Treaty',
    title: 'Ratoncito Perez and the Toothlight Treaty',
    collector: 'El Ratoncito Perez',
    doorway: 'A child with two true family traditions asks Perez and Tanda not to make her choose.',
    signal: 'The Network works when every keeper keeps their own door, rule, and voice.',
    status: '28-frame storybook ready',
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
    title: 'Parent saves it to the time capsule',
    body: 'Add the memory beside the child\'s tooth story so the family version does not disappear.',
  },
]

const collectorRoster = [
  {
    name: 'Tanda Fae',
    region: 'First window visit',
    role: 'Carries the child into the wider story world.',
    signal: 'Coordination',
    image: '/story-assets/tanda/tf-05-tanda.png',
  },
  {
    name: 'The Father',
    region: 'Viking origin',
    role: 'Keeps the tiny proof that a child is becoming braver.',
    signal: 'Promise',
    image: '/story-assets/viking-origin/vo-02-father.png',
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
    region: 'Korea',
    role: 'A rooftop messenger who teaches children to listen closely.',
    signal: 'Message',
    image: '/story-assets/characters/char-magpie.jpg',
  },
  {
    name: 'Hyena',
    region: 'Ethiopia',
    role: 'Waits beyond the doorway for the child brave enough to step out.',
    signal: 'Courage',
    image: '/story-assets/characters/char-hyena.jpg',
  },
  {
    name: 'Beaver',
    region: 'Cherokee Nation',
    role: 'Builds strength from effort, breath, and four determined laps.',
    signal: 'Effort',
    image: '/story-assets/characters/char-beaver.jpg',
  },
  {
    name: 'The Crow',
    region: 'Romania',
    role: 'Catches what is thrown into the dark and asks for a stronger thing back.',
    signal: 'Grit',
    image: '/story-assets/characters/char-crow.jpg',
  },
  {
    name: 'Granny Rose',
    region: 'Jamaica',
    role: 'Turns a roof toss into a memory only an older voice could tell.',
    signal: 'Memory',
    image: '/story-assets/characters/char-granny-jamaica.jpg',
  },
]

const storyRoadmap = [
  {
    number: '01',
    title: 'Tanda and the Night the Network Woke',
    place: 'First window visit',
    keeper: 'Tanda Fae',
    stage: 'Meet Tanda',
    engine: 'A capable fairy discovers that a rule needs keepers, and the Network begins when different traditions learn to answer one another.',
    image: '/story-assets/tanda/v2/s1-frame-01-cover.png',
  },
  {
    number: '02',
    title: 'Tanda Fae and the Tooth Fee',
    place: 'The Norse coast',
    keeper: 'The Original Tooth Fairy',
    stage: 'Origin',
    engine: 'A father by the sea helps Tanda understand that the first tooth fee was not payment. It was a promise.',
    image: '/story-assets/viking-origin/v2/s2-frame-25-home-glow.png',
  },
  {
    number: '03',
    title: 'Ratoncito Perez and the Toothlight Treaty',
    place: 'Madrid, Spain',
    keeper: 'El Ratoncito Perez',
    stage: 'Treaty',
    engine: 'A child in a mixed-tradition family asks two beloved tooth keepers to arrive without making either parent story smaller.',
    image: '/story-assets/ratoncito-perez/v2/rp3-frame-28-treaty-partners.png',
  },
  {
    number: '04',
    title: "The Magpie's Song",
    place: 'South Korea',
    keeper: 'Kkachi',
    stage: 'Messenger',
    engine: 'A rooftop song teaches the Network that messages can carry care without carrying every secret.',
    image: '/story-assets/characters/char-magpie.jpg',
  },
  {
    number: '05',
    title: "The Hyena's Bargain",
    place: 'Ethiopia',
    keeper: 'Hyena',
    stage: 'Courage',
    engine: 'A child steps toward the dark and discovers that courage can be asked for out loud.',
    image: '/story-assets/characters/char-hyena.jpg',
  },
  {
    number: '06',
    title: 'Hammaskeiju vs. Hammaspeikko',
    place: 'Finland',
    keeper: 'Hammaskeiju',
    stage: 'Snow chase',
    engine: 'A fairy and a tooth troll turn brushing, fear, and protection into a snowy chase.',
    image: '/story-assets/characters/char-finish-fairy.jpg',
  },
  {
    number: '07',
    title: 'Anna Bogle',
    place: 'Ireland',
    keeper: 'Anna Bogle',
    stage: 'Trust story',
    engine: 'A grumpy, gap-toothed keeper has to risk caring about the Network again.',
    image: '/story-assets/characters/char-anna-bogle.jpg',
  },
  {
    number: '08',
    title: 'The Beaver Circuit',
    place: 'Cherokee Nation',
    keeper: 'Beaver',
    stage: 'Careful research',
    engine: 'A running ritual becomes a story about effort, breath, and building strength.',
    image: '/story-assets/characters/char-beaver.jpg',
  },
  {
    number: '09',
    title: 'The Crow',
    place: 'Romania',
    keeper: 'The Crow',
    stage: 'Grit story',
    engine: 'A thrown tooth, a mountain night, and a dare to ask for something stronger.',
    image: '/story-assets/characters/char-crow.jpg',
  },
  {
    number: '10',
    title: 'The Tooth Kami',
    place: 'Japan',
    keeper: 'The Tooth Kami',
    stage: 'Quiet story',
    engine: 'A roof throw becomes a lesson in direction, patience, and the way new things grow.',
    image: '/story-assets/characters/char-tooth-kami.jpg',
  },
  {
    number: '11',
    title: 'The Tooth Worm',
    place: 'Babylonia',
    keeper: 'The old forgetting',
    stage: 'Old forgetting',
    engine: 'The first keeper becomes the warning: stories can be consumed if no one passes them on.',
    image: '/story-assets/characters/char-tooth-worm.jpg',
  },
  {
    number: '12',
    title: 'The Roof Toss',
    place: 'Jamaica',
    keeper: 'Granny Rose',
    stage: 'Family version',
    engine: 'A loud little ritual opens the door to the version only one household remembers.',
    image: '/story-assets/jamaica/jm-05-granny.jpg',
  },
]

const atlasRoutes = [
  {
    place: 'Madrid, Spain',
    keeper: 'El Ratoncito Perez',
    cue: 'A tooth under the pillow becomes a night route through the city.',
  },
  {
    place: 'South Korea',
    keeper: 'Kkachi the Magpie',
    cue: 'A rooftop call turns a lost tooth into a message carried upward.',
  },
  {
    place: 'Ethiopia',
    keeper: 'Hyena',
    cue: 'A child steps toward the dark and asks courage to answer back.',
  },
  {
    place: 'Cherokee Nation',
    keeper: 'Beaver',
    cue: 'A running ritual teaches effort, breath, and growing strength.',
  },
  {
    place: 'Jamaica',
    keeper: 'Granny Rose',
    cue: 'A roof toss becomes the version only one household remembers.',
  },
]

export default function StoriesPage() {
  const markers = allTraditionsForGlobe()
  const thumbnails = allTraditionImages()
  const activeTraditions = wallCards.length
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
          <h1>The world has always made magic from a lost tooth.</h1>
          <p>
            Tanda's shelf gathers the rituals families have whispered at
            pillows, windows, rooftops, cups of water, and kitchen tables. Start
            with the first three stories, then follow the keepers across the map.
          </p>
          <div className="hero-actions">
            <Link href="#begin-reading">Read the first stories</Link>
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
            <span>{totalTraditions}</span>
            <b>traditions on the atlas</b>
            <small>{activeTraditions} illustrated now</small>
          </div>
        </div>
      </section>

      <section id="begin-reading" className="story-shelf">
        <div className="section-kicker">
          <p className="eyebrow">Opening trilogy</p>
          <h2>Meet Tanda, then meet the Network.</h2>
          <p>
            Chapter one introduces Tanda and the Network. Chapter two shows how
            Tanda Fae becomes the Original Tooth Fairy. Chapter three gathers the
            collectors for the first time, beginning with Perez in Madrid.
          </p>
        </div>

        <div className="featured-grid">
          {FEATURED_STORIES.map((story) => {
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
          <h2>The atlas opens the cultures behind the tooth.</h2>
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
                <p>traditions to sort, research, and turn into storybooks</p>
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
            <p className="eyebrow">Why the atlas matters</p>
            <h3>Every tradition connects a child to someone older.</h3>
            <p>
              A child can begin with Tanda, then discover Perez in Spain, a
              magpie in Korea, a hyena in Ethiopia, a beaver in Cherokee
              tradition, and dozens of family rituals waiting to be preserved.
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

      <section className="collector-section" aria-label="collector roster">
        <div className="section-kicker">
          <p className="eyebrow">Meet the collectors</p>
          <h2>Every place gives the tooth a different keeper.</h2>
          <p>
            Tanda does not replace the old ways. She finds the keepers already
            doing the work: proud, funny, careful, stubborn, brave, and quiet.
            The world gets bigger when each one keeps their own rule.
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
          <p className="eyebrow">Story roadmap</p>
          <h2>The next shelf opens twelve different doors.</h2>
          <p>
            Each doorway has its own feeling: origin, comedy, messenger,
            courage, old forgetting, family version. That range keeps the atlas
            from becoming a list of facts.
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
          <h2>Make it a child-grandparent story activity.</h2>
          <p>
            This is the handoff for parents: choose a story, invite a
            grandparent or family storyteller to share their version, then save
            that memory to the child&apos;s time capsule.
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
