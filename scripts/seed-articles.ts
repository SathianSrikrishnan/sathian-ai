/**
 * Seed script: migrates articles from articles.ts → Supabase
 * Run: npx tsx --env-file=.env.local scripts/seed-articles.ts
 *
 * PREREQUISITE: Run scripts/migration.sql in Supabase Dashboard first
 */

import { createClient } from '@supabase/supabase-js'
import { articles } from '../src/lib/articles'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars. Run with: npx tsx --env-file=.env.local scripts/seed-articles.ts')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

// Article #5 draft
const article5 = {
  title: 'The Maze Has a Door',
  title_highlight: 'Door',
  slug: 'the-maze-has-a-door',
  date: '2026-02-17',
  author: 'Sathian',
  domains: ['consciousness', 'technology', 'sovereignty'],
  description: "A rat in a maze can't see the room. Neither can you — unless you learn to dissolve the thing that built the walls. On ego, algorithms, and the architecture of independent thought.",
  read_time: '11 min',
  pull_quotes: [
    "Mind control isn't hypnosis. It's architecture. Design the informational environment well enough and independent judgment never forms in the first place.",
    "The ego would rather be right than free. That's what makes it the perfect accomplice.",
    "I'm the guy who asks a stranger at dinner what they think about community-sourced truth mechanisms and then wonders why the table goes quiet.",
    "The grooves filled in. And for the first time, I could see the walls I'd built myself.",
    "The most valuable asset you own is your independent ability to figure out what's actually true without needing to ask permission.",
  ],
  theme: {
    accent: '#8B5CF6',
    accentGlow: 'rgba(139, 92, 246, 0.12)',
    background: 'aurora',
    mood: 'contemplative',
  },
  section_headings: [
    'The Narrow Strip Map',
    'The Architecture',
    'The Reducing Valve',
    'Fresh Snow',
    'The Bridging Algorithm',
    'The Ledger',
    'The Door',
  ],
  section_tints: ['#8B5CF6', '#DC2626', '#06B6D4', '#22C55E', '#3B82F6', '#F7931A', '#8B5CF6'],
  text_highlights: [
    { text: 'narrow strip maps', color: '#8B5CF6' },
    { text: 'broad comprehensive maps', color: '#22C55E' },
    { text: 'Default Mode Network', color: '#06B6D4' },
    { text: 'reducing valve', color: '#06B6D4' },
    { text: 'Community Notes', color: '#3B82F6' },
    { text: 'bridging algorithm', color: '#3B82F6' },
    { text: 'printing press', color: '#F7931A' },
    { text: 'blockchain', color: '#F7931A' },
    { text: 'How to Change Your Mind', color: '#22C55E' },
  ],
  media: [
    { src: '/media/maze-overhead.jpg', alt: 'A maze seen from above — the view the rat never gets', caption: 'The view from above. The rat never sees this.', placement: 'hero' },
    { src: '/media/sathian-dinner.jpg', alt: 'Sathian at dinner with strangers', caption: 'Running the bridging algorithm in meatspace — calibrating the Overton window over appetizers.', placement: 'inline-right', afterSection: 4 },
  ],
  special_elements: [],
  hidden_signal: "In 1948, Edward Tolman observed that rats under stress formed \"narrow strip maps\" — rigid, single-route knowledge of their environment. Rats given freedom to explore formed \"broad comprehensive maps\" and could find new solutions when the familiar path was blocked. Tolman titled the paper \"Cognitive Maps in Rats and Men.\" The \"and Men\" was the point.",
  status: 'draft',
  sort_order: 5,
  body: `In 1948, a psychologist named Edward Tolman put rats in mazes and watched what happened. What he found wasn't about rats.

The rats who were trained on a single route — rewarded for the same path, punished for deviation — learned quickly. They could run the maze blind. But when Tolman changed the maze, blocked the familiar route, forced them into new territory, these rats froze. They'd run the dead-end path again. And again. And again. Tolman called it perseveration — the compulsive repetition of a strategy that's already failed. These rats had built what he called narrow strip maps: rigid, single-route knowledge of their world. They knew the path. They didn't know the room.

A second group of rats — the ones given freedom to explore, to wander without immediate reward — responded differently. When the maze changed, they adapted. They found new routes. They improvised. Tolman said these rats had built broad comprehensive maps. They didn't just know the path. They understood the space.

Here's the part that stayed with me: the difference between the two groups wasn't intelligence. It was exposure. The narrow-map rats weren't stupider. They'd just never been given reason to look beyond the route that was already working. The map they had was good enough — until it wasn't. And by then, the habit of not looking was stronger than the crisis demanding they should.

I think about this constantly. Not the rats. Us. How many of the paths I run every day are grooves I cut years ago that I've never questioned? How much of what I think I know is a narrow strip map — functional, efficient, and completely blind to the room I'm actually standing in?

Tolman titled the paper "Cognitive Maps in Rats and Men." The "and Men" was the point.

---

In 2014, Facebook ran a quiet experiment on 689,000 users. They tweaked what people saw in their feeds — more positive posts for some, more negative posts for others — and measured what happened. The result: people who saw more negativity posted more negatively. People who saw more positivity posted more positively. No persuasion. No argument. Just a slight adjustment to the informational environment, and hundreds of thousands of people shifted their behavior without ever knowing they'd been touched.

Nobody was forced to do anything. Nobody was lied to. The information in their feeds was real — it was just curated. A little more of this, a little less of that. The mood of a city-sized population, dialed up or down by an algorithm.

That's not censorship. It's architecture.

Mind control isn't hypnosis. It's designing the informational environment so thoroughly that independent judgment never forms in the first place. You don't need to win an argument if you control which arguments are visible. You don't need to suppress the truth if you can make it slightly harder to find than the convenient version. A slightly different search result. A post that mysteriously doesn't get traction. A warning label. A slow, invisible throttle. No jackboots, no gulags — just a little bit of steering, applied across a billion people, a hundred million times a day.

Tom Bilyeu made a point recently that I can't stop thinking about. He fired up Google's Gemini and asked it to summarize the Epstein files — over three million pages of documents the Department of Justice had just made public. The AI refused. "I can't help you with that." Not a conspiracy theory. Not classified information. A government release, on the public record, and the AI that hundreds of millions of people use as their front door to information simply declined to discuss it.

Maybe it was safety tuning. Maybe it was an edge case. But that's exactly the point. In a world of algorithmic gatekeeping, you don't need a courtroom to suppress a topic. You just need enough friction, enough uncertainty, enough quiet refusal that normal people stop trying and move on.

The Soviet Union used to mail citizens replacement pages for their encyclopedias — literally cut out the old entry, paste in the new one, pretend the person never existed. We've upgraded the mechanism. The principle is identical. Control the record. Control the narrative. Control what people are allowed to think and remember. The formula hasn't changed since Stalin. What's changed is that AI can now do it at scale, invisibly, in real time, to everyone, all at once.

---

Here's what makes it work. Not the technology — us.

Humans see 0.0035% of the electromagnetic spectrum. That's the bandwidth we're working with. Everything else, we fill in. Shortcuts, assumptions, predictions, pattern-matching — the brain builds a model of the world from a trickle of data and then treats that model as reality itself. This is how we navigate a complicated world without being paralyzed by it. It's also the exact mechanism a magician uses when they make something disappear.

In 1954, Aldous Huxley called the brain a reducing valve — a filter that eliminates most of reality to let through only what's needed for survival. Get food, avoid danger, attract mates, maintain status. Everything else gets screened out. Efficient. Ruthless. And completely invisible to the person running the software.

Sixty years later, neuroscientists at Imperial College London found the valve. They called it the Default Mode Network — a set of brain regions most active when you're not focused on anything in particular. When you ruminate. When you self-reflect. When your mind wanders. When the voice in your head tells you who you are, what you want, what you're afraid of, and what the world means.

The Default Mode Network is the ego's neural address.

Michael Pollan, in his book How to Change Your Mind, describes it as "a stingy, vigilant security guard" that admits only "the narrowest bandwidth of reality." Its priorities are survival priorities: getting ahead, getting liked, getting fed. Not understanding the world clearly. Not seeing the room from above. Just running the path efficiently.

Robin Carhart-Harris, the neuroscientist leading the psychedelic research at Imperial College, puts it more bluntly: "A happy brain is a supple and flexible brain." Depression, addiction, OCD, anxiety — all characterized by the same thing: rigidity. Neural pathways grooved so deep the brain can't escape them. The same dead-end path, run again and again. Perseveration. Not because you're stupid. Because the ego has built a narrow strip map and is defending it with everything it has.

The ego would rather be right than free. That's what makes it the perfect accomplice. An informational environment designed to prevent independent judgment doesn't need to defeat your critical thinking. It just needs to feed the ego's existing map — confirm what you already believe, reinforce the grooves that are already there — and your own cognitive architecture does the rest.

---

I read Pollan's book in 2024 and what hit me wasn't the history or the science. It was a metaphor.

Your neural pathways are like tracks in snow. Over a lifetime, the grooves deepen. Every thought, every reaction, every interpretation follows the same well-worn route — not because it's the best route, but because it's the one with the least resistance. Your personality, your worldview, your habits, your fears — all grooved tracks. The brain is an efficiency machine. It doesn't want new paths. New paths cost energy. Old paths are free.

Psilocybin — the compound in psychedelic mushrooms — temporarily suppresses the Default Mode Network. When researchers at Johns Hopkins put people in an fMRI scanner under psilocybin, they watched the ego's neural home go quiet. The reducing valve opens. The filter lifts. And the grooves fill in like fresh snow on a ski slope. For a window of time — hours, not days — the brain can carve new paths.

Pollan asks the question that stopped me: "Is it possible that perceptions of people on psychedelics are, at least in certain instances, more accurate — less influenced by expectation and therefore more faithful to reality?"

Not hallucinating. Seeing more clearly. Because the filter that screens out most of reality has temporarily stepped aside.

I want to be honest about something here, and I'm writing this knowing that my children will read it one day. I've used psilocybin. Not recreationally — deliberately, sparingly, and with more respect than I bring to almost anything else in my life. I also still use cannabis, which I love and am not apologetic about. I quit cigarettes at twenty-nine. My father smoked — I saw him pick it up later in life and never thought much about it until I found myself doing the same math every smoker does: is this the one I quit on?

The psilocybin is different. It's the sharpest tool I've found for one specific job: melting the ego long enough to see what's underneath.

I won't pretend there's a single dramatic moment I can point to. There isn't. What there is, is a slow accumulation of clarity. The ability to hold sadness and gratitude in the same hand. To miss what I've lost — and I have lost things I loved deeply, things with real beauty in them — without needing to assign blame or build a story about who was wrong. The ego wants a villain. Psilocybin dissolves the need for one. What's left is simpler and harder: two people who deserved to be whole. Children who deserved parents at peace. A version of me I didn't recognize at first but trust more than the one I'd been performing.

I don't write this as advocacy. I write it because this article is about independent judgment, and hiding the tool that most helped me develop mine would make the whole thing dishonest. Pollan was a sixty-year-old food journalist who'd never taken psychedelics and then wrote the definitive book about them. He handled the vulnerability by being precise. I'll try to do the same.

The numbers, for what they're worth: 80% of terminal cancer patients at Johns Hopkins showed clinically significant reductions in anxiety and depression after a single psilocybin session. 80% of smokers in a Hopkins trial quit at six months. The degree of symptom relief correlated directly with the intensity of ego dissolution reported. It's not the drug. It's what happens when the reducing valve opens and you see your own patterns clearly for the first time.

The fresh snow metaphor is the one that stayed with me. The grooves filled in. And for the first time in longer than I'd like to admit, I could see the walls I'd built myself. Not the ones the algorithm built. Mine.

---

There's a mechanism on the internet right now that nobody I talk to understands, and it might be the single most important innovation in truth-telling since the open web.

It's called Community Notes. It lives on X — the platform most people reflexively dismiss as crypto bros and right-wing rage. I know this because every time I tell someone that X is where I spend my social media time, I can watch the category snap into place behind their eyes. It takes about 0.3 seconds. That's the reducing valve in real time — not just theirs, mine too. I have the same reflexes. The difference is I've learned to notice the snap.

Community Notes started as "Birdwatch" in January 2021 — a small pilot of 500 users at Twitter, built by a team led by Keith Coleman. It was not inspired by Reddit, though people assume it was. The actual inspiration was Wikipedia's model: could a crowd produce better truth than an institution? The answer was yes, but only if you solved the incentive problem — because majority rule just creates echo chambers.

The solution was a bridging algorithm. Here's how it works: when someone writes a note adding context to a post, other contributors rate it as helpful or unhelpful. But a note only becomes publicly visible if it receives positive ratings from people who have historically disagreed with each other. Not majority rule. Cross-partisan consensus. The algorithm doesn't care what you believe. It cares whether people who believe different things can agree that this specific piece of context is accurate.

The algorithm is fully open-source. The data is publicly auditable. There is no override button. Elon Musk — who owns the platform — cannot manually change the status of a note. Anything he touches in that system leaves an audit trail. When a note goes live, resharing of the flagged post drops by 50-61%. Post deletion increases by 80%. It works. And it works precisely because no single person controls it.

I'm a Community Notes contributor. I applied because I wanted to participate in something I believe matters — a decentralized, community-derived truth mechanism where anyone in the world can challenge any claim, cite their source, and let the marketplace of diverse perspectives evaluate the accuracy. Over time, this converges on truth. Not because people are virtuous, but because the math rewards agreement across divides.

I'm the guy who asks a stranger at dinner what they think about community-sourced truth mechanisms and then wonders why the table goes quiet. I do this a few times a week — dinner with someone I've never met. People in their twenties, seventies, every decade between. It's my analog version of the bridging algorithm. I'm not trying to convince anyone. I'm trying to understand what the world actually looks like from perspectives that aren't mine. And I'm consistently surprised by what people don't know about the tools that already exist to protect them.

---

The printing press democratized the distribution of information. Anyone could publish. Blockchain democratizes the verification of information. No one can un-publish, alter, or forge.

I believe blockchain is the most important innovation in human history since the printing press, and I think the next thousand years will prove this right. I've put this belief publicly behind my name. I've accepted the ridicule that comes with it — the "crypto bro" label, the eye rolls, the reflexive categorization. That's fine. The ridicule is itself a data point. It's the social friction that the system applies to discourage people from standing on inconvenient positions. The same mechanism Bilyeu describes with AI — just applied through peers instead of algorithms.

Here's why this connects to everything above.

The Soviet Union mailed replacement pages. AI refuses to discuss public records. Algorithms suppress posts without announcement. In a world where the record can be edited, suppressed, or fabricated — by governments, by corporations, by AI — the single most important infrastructural question is: can anyone alter the ledger?

A blockchain is a ledger that no one can alter. Not a government. Not a corporation. Not an AI. Every entry is timestamped, distributed across thousands of machines, and cryptographically chained to every entry before it. You can hash any document and write it to a blockchain, and that hash proves the document existed at that exact time and hasn't been modified since. There are no replacement pages. Every edit is visible, permanent, and auditable.

That's not a financial product. That's a civilizational defense mechanism.

The three-layer truth stack, as I've come to think of it: internally, learn to dissolve the ego's filter — through psychedelics, through meditation, through the deliberate practice of questioning your own grooved tracks. Socially, participate in decentralized truth-telling — Community Notes, open discourse, the practice of seeking perspectives that challenge your own. Infrastructurally, build on systems that can't be edited by the powerful — immutable ledgers, open-source protocols, transparent algorithms.

Internal. Social. Infrastructural. The reducing valve, the bridging algorithm, the blockchain. Three layers of defense against a world that would prefer you didn't think for yourself.

---

Tolman's rats had two options. They could perseverate — running the dead-end path harder, defending the narrow strip map, doubling down on the route that used to work. Or they could explore — build a broader map, accept the discomfort of not knowing the path, and find the new route.

The maze has a door. I know because I've been walking through versions of it for years now. The door isn't a single event — it's a practice. It's reading the primary source instead of the summary. It's asking the AI the same question three different ways and comparing what it hides. It's sitting across from a stranger and asking what they see that you don't. It's dissolving the ego's grip long enough to notice the walls you built yourself — and loving what you find on the other side, even when it's not what you expected.

Jim Carrey — another kid from Scarborough, Ontario, which gives me exactly zero authority to quote him but I'm going to anyway — once said he wished everyone could get everything they ever wanted so they could see that it's not the answer. That line sounds like a platitude until you've felt it. It's not. It's the report of a person who found the door.

The world is building a maze around you. AI writes the walls. Algorithms set the path. Your own ego patrols the corridors, making sure you don't wander into a room that might challenge the map you've already drawn.

But the maze has a door. It always has. The rats who found it weren't smarter. They were just willing to explore.

The most valuable asset you own is not your money, your followers, or your status. It's your independent ability to figure out what's actually true without needing to ask permission.

Build a broader map. The room is bigger than the path.

---

*Sathian S. builds at sathian.ai*`,
}

async function seed() {
  console.log('Checking if articles table exists...')
  const { error: checkError } = await supabase.from('articles').select('id').limit(1)
  if (checkError) {
    console.error('Table not found. Run scripts/migration.sql in Supabase Dashboard first.')
    console.error('Error:', checkError.message)
    process.exit(1)
  }

  // Check if already seeded
  const { data: existing } = await supabase.from('articles').select('slug')
  if (existing && existing.length > 0) {
    console.log(`Found ${existing.length} existing articles. Skipping already-seeded slugs.`)
  }
  const existingSlugs = new Set((existing || []).map((a: { slug: string }) => a.slug))

  // Seed the 4 published articles
  let inserted = 0
  for (const article of articles) {
    if (existingSlugs.has(article.slug)) {
      console.log(`  Skip: ${article.slug} (already exists)`)
      continue
    }

    const row = {
      title: article.title,
      title_highlight: article.titleHighlight || null,
      slug: article.slug,
      date: article.date,
      author: article.author,
      domains: article.domains,
      description: article.description,
      read_time: article.readTime,
      body: article.body,
      pull_quotes: article.pullQuotes,
      theme: article.theme,
      media: article.media || [],
      section_headings: article.sectionHeadings || [],
      section_tints: article.sectionTints || [],
      special_elements: article.specialElements || [],
      text_highlights: article.textHighlights || [],
      hidden_signal: article.hiddenSignal || null,
      status: 'published',
      sort_order: inserted + 1,
    }

    const { error } = await supabase.from('articles').insert(row)
    if (error) {
      console.error(`  Error inserting ${article.slug}:`, error.message)
    } else {
      console.log(`  Inserted: ${article.slug} (published)`)
      inserted++
    }
  }

  // Seed article #5 draft
  if (!existingSlugs.has(article5.slug)) {
    const { error } = await supabase.from('articles').insert(article5)
    if (error) {
      console.error(`  Error inserting ${article5.slug}:`, error.message)
    } else {
      console.log(`  Inserted: ${article5.slug} (draft)`)
      inserted++
    }
  } else {
    console.log(`  Skip: ${article5.slug} (already exists)`)
  }

  console.log(`\nDone. Inserted ${inserted} articles.`)
}

seed().catch(console.error)
