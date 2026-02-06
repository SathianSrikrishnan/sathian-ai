export interface ArticleTheme {
  accent: string        // Primary accent color (hex)
  accentGlow: string    // Glow variant for backgrounds
  background: 'beams' | 'aurora' | 'grid'
  mood: 'energetic' | 'contemplative' | 'urgent'
}

export interface Article {
  title: string
  titleHighlight?: string   // Substring to accent-highlight in title
  slug: string
  date: string
  author: string
  domains: string[]
  description: string       // Short description for cards and OG
  body: string
  pullQuotes: string[]      // Key sentences to feature as pull quotes
  theme: ArticleTheme
  media?: { src: string; alt: string; caption?: string; placement: 'hero' | 'full-bleed' | 'inline-left' | 'inline-right'; afterSection?: number }[]
  sectionHeadings?: string[]   // Heading for each section (index matches section index)
  sectionTints?: string[]      // Hex color tint per section (emotional arc)
  specialElements?: { type: 'price-counter' | 'scroll-pin' | 'stacked-pages' | 'whitepaper-cta'; afterSection: number; data?: Record<string, unknown> }[]
  textHighlights?: { text: string; color: string }[]  // Specific phrases to color-highlight
  hiddenSignal?: string
}

export const articles: Article[] = [
  {
    title: 'C.R.E.A.M. 2.0',
    titleHighlight: 'C.R.E.A.M.',
    slug: 'cream-2-point-0',
    date: '2026-10-31',
    author: 'Sathian',
    domains: ['hip-hop culture', 'decentralized finance'],
    description: 'How Wu-Tang Clan\'s journey from Staten Island to a corporate arena mirrors Bitcoin\'s path from cypherpunk whitepaper to institutional adoption.',
    pullQuotes: [
      'Wu-Tang had become their own ETF — the authentic thing, repackaged, sanitized, and sold to a broader market at a premium.',
      'The people who move first are the ones in the margins who recognize a signal before it has a name.',
      'The question isn\'t whether that happens. It always does. The question is whether enough people heard the original frequency to keep it alive underneath.',
    ],
    theme: {
      accent: '#F59E0B',
      accentGlow: 'rgba(245, 158, 11, 0.15)',
      background: 'beams',
      mood: 'energetic',
    },
    hiddenSignal: '"Reunited" — Wu-Tang Forever (1997), Method Man: "worldwide total carnage / the sickest flow that we code name Agent Orange"',
    sectionHeadings: ['The Arena', 'The Producers', 'The Frequency'],
    sectionTints: ['#F59E0B', '#D4A017', '#3B4252'],
    textHighlights: [
      { text: 'C.R.E.A.M.', color: '#F59E0B' },
      { text: 'Cash Rules Everything Around Me', color: '#F59E0B' },
    ],
    media: [
      { src: '/media/stage-smoke.jpg', alt: 'Concert stage atmosphere', caption: 'Nine men in their fifties reminiscing on verses they wrote as teenagers', placement: 'hero' },
      { src: '/media/vinyl-turntable.jpg', alt: 'Vinyl turntable', caption: 'RZA constructed the sound by sampling kung fu movies, dusty soul records, and street corner philosophy', placement: 'inline-right', afterSection: 1 },
      { src: '/media/bitcoin-coin.jpg', alt: 'Bitcoin', caption: 'Here\'s the work', placement: 'inline-left', afterSection: 1 },
      { src: '/media/wutang-scotiabank-arena.jpg', alt: 'Wu-Tang Clan performing at Scotiabank Arena with Maple Leafs banners', caption: 'The Scotiabank Arena version — Leafs banners overhead, the edges filed off, the danger gone', placement: 'full-bleed', afterSection: 2 },
      { src: '/media/boardroom.jpg', alt: 'Corporate boardroom', caption: 'ETFs, institutional custody, boardroom presentations', placement: 'inline-right', afterSection: 2 },
    ],
    body: `Last August I was sitting in the Scotiabank Arena watching Wu-Tang Clan perform in Maple Leafs jerseys. My buddy and I were the only ones smoking joints in the building — which twenty years ago at a Wu-Tang show would've been the least notable thing happening. But this wasn't 2003. This was nine men in their fifties reminiscing on verses they wrote as teenagers, for an audience that included an eleven-year-old kid from Sudbury losing his mind to C.R.E.A.M.

Cash Rules Everything Around Me. The anthem of project kids in Staten Island, now soundtracking a corporate arena experience for small-town Ontario families.

Wu-Tang had become their own ETF — the authentic thing, repackaged, sanitized, and sold to a broader market at a premium.

---

In 1993, Wu-Tang did something labels said couldn't be done. They kept the group together while every member negotiated solo deals. No label owned them. They built Shaolin. RZA constructed the sound by sampling kung fu movies, dusty soul records, and street corner philosophy — pieces that already existed, threaded into something that hadn't.

Fifteen years later, Satoshi dropped a nine-page whitepaper the same way RZA dropped *Enter the Wu-Tang*. No publisher. No institution. No face. Just: here's the work.

And like RZA, Satoshi didn't invent the components. Adam Back had built Hashcash — proof-of-work — back in 1997, the same year Wu-Tang Forever came out. Hal Finney built Reusable Proof of Work. Wei Dai proposed b-money. Nick Szabo sketched Bit Gold. David Chaum had been working on digital cash since the early nineties. Satoshi sampled all of it. Threaded existing cryptographic ideas together the way a producer threads existing sounds — into something that hadn't existed before.

The first person to exchange bitcoin for dollars was Martti Malmi — a Finnish developer who sold 5,050 BTC for $5.02 over PayPal in October 2009. Before Malmi, Bitcoin had no market value. After him, a handful of developers picked it up. Then the cypherpunks. Then the world.

A few kids in Staten Island who heard what RZA was building. A few cryptographers who read what Satoshi wrote. Same pattern. The people who move first are the ones in the margins who recognize a signal before it has a name.

---

That kid from Sudbury singing along to C.R.E.A.M. doesn't know any of this history. He doesn't know the song was written in a project hallway about surviving a system that wasn't built for the people inside it. He just knows it hits.

But here's what I think about, sitting in that arena watching him: he's hearing the repackaged version. The Scotiabank Arena version. Wu-Tang in Leafs jerseys, the edges filed off, the danger gone. And that's exactly what's happening to Bitcoin right now — ETFs, institutional custody, boardroom presentations. The thing that was built to escape the system is being absorbed by it.

The question isn't whether that happens. It always does. The question is whether enough people heard the original frequency to keep it alive underneath. Whether somewhere, right now, there's a kid in a project hallway writing something that won't make sense to the rest of us for another fifteen years.

Cash ruled everything around them in '93. It still does. But the next verse is being written somewhere the institutions haven't found yet.`,
  },
  {
    title: 'The Yellow Box',
    titleHighlight: 'Yellow Box',
    slug: 'the-yellow-box',
    date: '2026-02-06',
    author: 'Sathian',
    domains: ['institutional decay', 'digital sovereignty'],
    description: 'An Uber driver, a box of No Name spaghetti, and how the gap between what institutions promise and what people experience follows the same pattern from glasnost to grocery stores.',
    pullQuotes: [
      'The most basic nutrition on the shelf, more than doubled, while nothing else about his life changed except what he could afford.',
      'The collapse didn\'t arrive as a single dramatic event. It arrived the way Hemingway described going bankrupt: gradually, then suddenly.',
      'The question for every institution today is the same one the Soviet Union faced in 1986: can you survive your citizens doing the math?',
    ],
    theme: {
      accent: '#DC2626',
      accentGlow: 'rgba(220, 38, 38, 0.12)',
      background: 'aurora',
      mood: 'contemplative',
    },
    sectionHeadings: ['The Math', 'Glasnost', 'The Western Mirror', 'The Architecture'],
    sectionTints: ['#D4A017', '#CD0000', '#CD0000', '#F7931A'],
    textHighlights: [
      { text: 'yellow box', color: '#F5D442' },
      { text: 'No Name', color: '#F5D442' },
      { text: 'glasnost', color: '#CD0000' },
      { text: 'gradually, then suddenly', color: '#DC2626' },
    ],
    specialElements: [
      { type: 'price-counter', afterSection: 0, data: { startPrice: 0.97, endPrice: 2.49, startYear: 2019, endYear: 2026 } },
      { type: 'scroll-pin', afterSection: 1 },
    ],
    media: [
      { src: '/media/night-driving.jpg', alt: 'Night driving through city streets', caption: 'He was trying to explain to me what went wrong', placement: 'hero' },
      { src: '/media/supermarket-shelves.jpg', alt: 'Grocery store shelves', caption: 'Just the yellow box', placement: 'inline-left', afterSection: 0 },
      { src: '/media/soviet-building.jpg', alt: 'Soviet-era architecture', caption: 'The gap between what the state had been saying and what people had been living', placement: 'full-bleed', afterSection: 1 },
      { src: '/media/propaganda-red.jpg', alt: 'Soviet red', caption: 'The emperor had no clothes and the shelves had no food', placement: 'inline-left', afterSection: 1 },
      { src: '/media/grocery-aisle.jpg', alt: 'Supermarket aisle', caption: 'The official numbers told one story. The grocery receipt told another.', placement: 'full-bleed', afterSection: 2 },
      { src: '/media/empty-shelf.jpg', alt: 'Empty grocery shelf', caption: 'The system\'s accounting doesn\'t match your lived experience', placement: 'inline-right', afterSection: 2 },
    ],
    hiddenSignal: 'In 1989, Boris Yeltsin made an unscheduled stop at a Randalls supermarket in Clear Lake, Texas. He wandered the aisles in silence. Later he told his aides the Soviet people would revolt if they saw what Americans had access to. Within two years, the Soviet Union was gone.',
    body: `My Uber driver — a guy who'd come to Canada from Afghanistan in 2017 — was trying to explain to me what went wrong.

When he arrived, Canada was paradise. He started driving, things were good, the math worked. Somewhere in the last few years, the math stopped working and he couldn't figure out why. He wasn't reading economics papers or following central bank announcements. But he had an analogy that was better than anything I'd read in the Financial Post.

No Name spaghetti. The yellow box. Loblaw's cheapest option — the thing you buy when you're watching every dollar. It was about a dollar a few years ago. Now it's well over two. The most basic nutrition on the shelf, more than doubled, while nothing else about his life changed except what he could afford.

Before you get to housing. Before you get to gas or daycare or rent. Just the yellow box.

---

In 1986, Mikhail Gorbachev made a bet. He believed that if the Soviet Union told the truth about itself, the system would get stronger. He called it glasnost — openness. The idea was simple: expose the problems, let people discuss them, and the state would earn trust by showing it could reform.

Within five years, there was no Soviet Union.

What Gorbachev didn't account for was that the gap between what the state had been saying and what people had been living was too wide to survive exposure. For decades, the system had told its citizens that the shelves were stocked, that the economy was growing, that the West was failing. Glasnost didn't create the rot. It just let people talk about what they already knew — that the emperor had no clothes and the shelves had no food.

The collapse didn't arrive as a single dramatic event. It arrived the way Hemingway described going bankrupt: gradually, then suddenly. Years of quiet erosion — the slow accumulation of small lies, small shortages, small disappointments — and then one day, a wall comes down and everyone acts surprised. But nobody who'd been standing in line for bread was surprised. They'd known for years. They just hadn't been allowed to say it out loud.

---

Social media gave the West its own glasnost without anyone planning it.

Every institution that relied on controlling its narrative — governments, banks, media companies — suddenly had millions of people fact-checking them in real time. The gap between what was promised and what was delivered turned out to be wider than anyone in charge had expected. Central banks said inflation was transitory. The yellow box said otherwise. Politicians said the economy was strong. The rent check said otherwise. The official numbers told one story. The grocery receipt told another.

My Uber driver didn't need a history lesson to understand this. He had his own yellow box. The system told him Canada was working. The spaghetti told him it wasn't. And once you see that gap — between what the institution says and what the shelf price confirms — you can't unsee it.

This is the pattern that repeats. The Soviet citizen standing in line for bread. The Canadian immigrant staring at spaghetti prices. Different decades, different countries, same realization: the system's accounting doesn't match your lived experience, and no amount of official reassurance can put that knowledge back in the box.

---

Bitcoin was built for this moment, even if most people don't see it yet.

Satoshi's whitepaper wasn't a manifesto. It was an engineering document — nine pages describing a system where no single institution controls the ledger. No central bank decides how much money exists. No government can inflate away your purchasing power to cover its own debts. The protocol doesn't care about elections or monetary policy or what the governor of the Bank of Canada said on Tuesday.

This isn't ideology. It's architecture. The same way glasnost revealed what Soviet citizens already knew, the transparent ledger of a blockchain makes it impossible to hide what's happening to the money supply. Every transaction visible. Every coin accounted for. No closed-door meetings where a handful of people decide that your savings should be worth a little less this year.

The people building sovereign technology right now — decentralized finance, local-first infrastructure, open protocols — aren't utopians. They're people who picked up the yellow box, looked at the price, and decided to stop trusting systems that can't be audited.

It happens slowly, then suddenly. The quiet part — the part we're in now — is millions of people around the world doing the same math my Uber driver did. Looking at the price of the most basic things and realizing the numbers don't add up. Most of them haven't heard of Bitcoin yet. Most of them don't know there's an alternative. But they know something is wrong, the same way Soviet citizens knew something was wrong long before anyone gave them permission to say it.

Gorbachev thought transparency would save the system. It destroyed it — because the system couldn't survive being seen clearly. The question for every institution today is the same one the Soviet Union faced in 1986: can you survive your citizens doing the math?

My Uber driver already did the math. He's still driving. He's still watching the yellow box. And slowly, then suddenly, so is everyone else.`,
  },
  {
    title: 'Nine Pages',
    titleHighlight: 'Nine',
    slug: 'nine-pages',
    date: '2026-02-06',
    author: 'Sathian',
    domains: ['cryptocurrency', 'first principles'],
    description: 'I was around Bitcoin for years before I actually read the whitepaper. Nine pages changed everything. Here\'s what I found — and two versions so you can read it yourself.',
    pullQuotes: [
      'I had opinions about Bitcoin for years before I actually read the document that started it. Most people do. That should bother us.',
      'Nine pages. That\'s it. The thing that governments are scrambling to regulate, that Wall Street is racing to package, that has moved trillions of dollars — it fits in a pamphlet.',
      'The Gen Z version did something I didn\'t think was possible: it made me understand the parts I\'d been pretending to understand.',
    ],
    theme: {
      accent: '#F7931A',
      accentGlow: 'rgba(247, 147, 26, 0.12)',
      background: 'aurora',
      mood: 'contemplative',
    },
    sectionHeadings: ['The Confession', 'The Read', 'The Translation', 'The Resource'],
    sectionTints: ['#F7931A', '#F59E0B', '#06B6D4', '#22C55E'],
    textHighlights: [
      { text: 'nine pages', color: '#F7931A' },
      { text: 'Nine pages', color: '#F7931A' },
      { text: 'Satoshi Nakamoto', color: '#F7931A' },
    ],
    media: [
      { src: '/media/adam-back-btc-dc.jpg', alt: 'Sathian with Adam Back at Bitcoin Conference DC', caption: 'With Adam Back — inventor of Hashcash, cited in the whitepaper — at Bitcoin Conference, DC, October 2025', placement: 'inline-right', afterSection: 1 },
    ],
    specialElements: [
      { type: 'stacked-pages', afterSection: -1 },
      { type: 'whitepaper-cta', afterSection: 3 },
    ],
    hiddenSignal: 'On page 1, section 1, Satoshi writes: "What is needed is an electronic payment system based on cryptographic proof instead of trust." Every section that follows is an answer to that single sentence. The entire system is one idea, executed with discipline.',
    body: `People ask me why Bitcoin is my religion. Not my investment thesis — my religion. It\'s a fair question. I\'ve built pieces of my life around it. I talk about it the way some people talk about their faith — with a certainty that can be off-putting if you haven\'t had the same experience.

Here\'s my confession: I had opinions about Bitcoin for years before I actually read the document that started it. Most people do. That should bother us.

I bought Bitcoin. I traded Bitcoin. I argued about Bitcoin at dinner tables and in group chats. I watched the price. I had takes. But I never sat down and read the nine-page whitepaper that Satoshi Nakamoto published on October 31, 2008. Not once. Not until 2024.

For years, I was forming opinions about the most significant financial innovation of our lifetime based on other people\'s summaries, podcasts, Twitter threads, and vibes. I suspect I\'m not alone.

---

When I finally read it — actually read it — two things hit me immediately.

First: nine pages. That\'s it. The thing that governments are scrambling to regulate, that Wall Street is racing to package, that has moved trillions of dollars — it fits in a pamphlet. Satoshi Nakamoto laid out the entire architecture of a peer-to-peer electronic cash system in fewer pages than most college essays. No fluff. No marketing. No vision statement about changing the world. Just: here is a problem, here is a solution, here is the math.

Second: the mechanisms are simple. Not easy — simple. There\'s a difference. Proof-of-work isn\'t some alien concept. It\'s the idea that if you make someone spend real computational energy to add a record, they won\'t waste it on lies. A timestamp server isn\'t mysterious — it\'s a chain of digital fingerprints, each one proving the one before it existed. The longest chain wins because it represents the most work, and work can\'t be faked.

I\'d been intimidated by these concepts for years. The jargon made them feel inaccessible. But reading the source material — not a summary, not an explainer, the actual document — I realized these mechanisms are deeply intuitive once you strip away the mystique. Satoshi wasn\'t writing for cryptographers. The paper reads like someone explaining a system to a smart friend over coffee.

The moment I understood how a network of strangers could agree on truth without trusting each other — without any institution mediating — something shifted. This wasn\'t just a better way to move money. This was a new way to protect truth. A protocol that makes it more expensive to lie than to be honest. That\'s not a financial product. That\'s an architecture for trust in a world that\'s running out of it.

---

I carried this around for a while, this realization that the source material was sitting there the whole time and I\'d ignored it. Then I came across something that made me think about it differently.

Someone had taken the Bitcoin whitepaper and translated it into Gen Z language. Not a summary — a full translation. Every section, every concept, rewritten in the kind of language you\'d hear on TikTok or in a group chat. Slang. Memes. The word "vibe" used unironically in a discussion about cryptographic hash functions.

My first reaction was to dismiss it. This is serious technology. You don\'t translate the Magna Carta into emoji.

But then I read it. And the Gen Z version did something I didn\'t think was possible: it made me understand the parts I\'d been pretending to understand. The sections on Simplified Payment Verification and Merkle trees — concepts I\'d nodded along to in the original without fully grasping — suddenly clicked when they were described as "receipts" and "cheat codes." The irreverent tone somehow made the precision more accessible, not less.

This is the paradox: an AI-generated, meme-laden, deliberately unserious translation of the most important financial document of the century did a better job of transmitting the actual ideas than years of serious commentary. Not because the ideas are unserious — because the barriers to understanding them are mostly artificial. Jargon creates a priesthood. Strip the jargon and you strip the priesthood.

---

So here\'s what this is. A resource. Something I can send to the next person who asks me why Bitcoin is my religion.

Read the original: bitcoin.org/bitcoin.pdf — nine pages, published October 31, 2008, by someone whose identity remains unknown. It is, in my view, the most significant document published in the 21st century. Read it like you\'d read the operating manual for something you already own but never learned to use.

Read the translation: the Gen Z version on this site — same nine sections, same ideas, different language. Read it if the original feels impenetrable, or read it after and see which version made the concepts stick.

Then decide for yourself. Which version communicated better? Which section surprised you? Did you already know how proof-of-work actually works, or were you — like me — running on borrowed conviction?

I spent years having opinions about something I hadn\'t read. Most people in Bitcoin have. Most people arguing against Bitcoin definitely have. The document is nine pages. It takes twenty minutes. There is no excuse, mine included, for not reading the primary source before forming a position.

This isn\'t about converting anyone. It\'s about intellectual honesty. Read the thing. Then we can talk.`,
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getAllArticles(): Article[] {
  return articles
}
