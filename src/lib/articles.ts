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
  specialElements?: { type: 'price-counter' | 'scroll-pin' | 'stacked-pages' | 'whitepaper-cta' | 'youtube-embed'; afterSection: number; data?: Record<string, unknown> }[]
  textHighlights?: { text: string; color: string; link?: string }[]  // Specific phrases to color-highlight (optional Grokipedia link)
  hiddenSignal?: string
}

export const articles: Article[] = [
  {
    title: 'C.R.E.A.M. 2.0',
    titleHighlight: 'C.R.E.A.M.',
    slug: 'cream-2-point-0',
    date: '2025-10-31',
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
    hiddenSignal: 'In 2015, Wu-Tang pressed a single copy of "Once Upon a Time in Shaolin" and sold it for $2 million to Martin Shkreli. The DOJ seized it. In 2021, PleasrDAO — a crypto collective of strangers on the internet — bought it for $4 million. The most exclusive album in history ended up owned by a decentralized group. Wu-Tang and crypto didn\'t just mirror each other. They literally converged.',
    sectionHeadings: ['The Arena', 'The Producers', 'Martti Malmi or $5.02', 'The Frequency'],
    sectionTints: ['#F59E0B', '#D4A017', '#F7931A', '#3B4252'],
    textHighlights: [
      { text: 'C.R.E.A.M.', color: '#F59E0B' },
      { text: 'Cash Rules Everything Around Me', color: '#F59E0B' },
      { text: 'Martti Malmi', color: '#F7931A' },
      { text: '$5.02', color: '#F7931A' },
      { text: '5,050 BTC', color: '#F7931A' },
    ],
    media: [
      { src: '/media/wutang-90s.jpg', alt: 'Wu-Tang Clan in the 90s — before the corporate arena, before the ETFs', caption: 'Before the Scotiabank Arena. Before the Leafs jerseys. Before anyone outside Staten Island was paying attention.', placement: 'hero' },
      { src: '/media/wutang-rooftop.jpg', alt: 'Wu-Tang Clan rooftop photo', caption: 'The same group, two decades and a corporate arena later — the edges filed off, the danger gone', placement: 'full-bleed', afterSection: 0 },
      { src: '/media/vinyl-turntable.jpg', alt: 'Vinyl turntable', caption: 'RZA constructed the sound by sampling kung fu movies, dusty soul records, and street corner philosophy', placement: 'inline-right', afterSection: 1 },
      { src: '/media/bitcoin-coin.jpg', alt: 'Bitcoin', caption: 'Here\'s the work', placement: 'inline-left', afterSection: 1 },
      { src: '/media/wutang-concert-selfie.jpg', alt: 'At the Wu-Tang concert in Toronto', caption: 'At the Wu-Tang concert, Toronto, July 2025', placement: 'inline-left', afterSection: 0 },
      { src: '/media/wutang-scotiabank-arena.jpg', alt: 'Wu-Tang Clan performing at Scotiabank Arena with Maple Leafs banners', caption: 'The Scotiabank Arena version — Leafs banners overhead, the edges filed off, the danger gone', placement: 'full-bleed', afterSection: 3 },
      { src: '/media/boardroom.jpg', alt: 'Corporate boardroom', caption: 'ETFs, institutional custody, boardroom presentations', placement: 'inline-right', afterSection: 3 },
    ],
    body: `Last July I was sitting in the Scotiabank Arena watching Wu-Tang Clan perform in Maple Leafs jerseys. I was the only one smoking a joint in the building — doing exactly what I would've done twenty years ago, except back then nobody would've noticed. This wasn't a basement in Scarborough. This was a corporate arena full of small-town Ontario families and kids in overpriced merch. Nine men in their fifties (ODB passed in 2004, replaced by Cappadonna) reminiscing on verses they wrote as teenagers. An eleven-year-old kid from Sudbury losing his mind to C.R.E.A.M. And me — still listening the way I first heard it, out of place in a room that had moved on entirely.

Cash Rules Everything Around Me. The anthem of project kids in Staten Island, now soundtracking a corporate arena experience for small-town Ontario families.

Wu-Tang had become their own ETF — the authentic thing, repackaged, sanitized, and sold to a broader market at a premium.

---

In 1993, Wu-Tang did something labels said couldn't be done. They kept the group together while every member negotiated solo deals. No label owned them. They built Shaolin. RZA constructed the sound by sampling kung fu movies, dusty soul records, and street corner philosophy — pieces that already existed, threaded into something that hadn't.

Fifteen years later, Satoshi dropped a nine-page whitepaper the same way RZA dropped *Enter the Wu-Tang* — raw, unfiltered. But unlike RZA, Satoshi had no publisher. No institution. No face. Just: here's the work.

And like RZA, Satoshi didn't invent the components. Adam Back built Hashcash — proof-of-work — in 1997, the same year Wu-Tang Forever came out. Hal Finney built Reusable Proof of Work. Wei Dai proposed b-money. Satoshi sampled all of them — threaded existing cryptographic ideas together the way a producer threads existing sounds into something that hadn't existed before.

---

The first person to exchange bitcoin for dollars was Martti Malmi — a Finnish developer who sold 5,050 BTC for $5.02 over PayPal in October 2009. Before Malmi, Bitcoin had no market value. After him, a handful of developers picked it up. Then the cypherpunks. Then the world.

A few kids in Staten Island who heard what RZA was building. A few cryptographers who read what Satoshi wrote. Same pattern. The people who move first are the ones in the margins who recognize a signal before it has a name.

---

That kid from Sudbury singing along to C.R.E.A.M. doesn't know any of this history. He doesn't know the song was written in a project hallway about surviving a system that wasn't built for the people inside it. He just knows it hits.

But here's what I think about, sitting in that arena watching him: he's hearing the repackaged version. The Scotiabank Arena version. Wu-Tang in Leafs jerseys, the edges filed off, the danger gone. And that's exactly what's happening to Bitcoin right now — ETFs, institutional custody, boardroom presentations. The thing that was built to escape the system is being absorbed by it.

The question isn't whether that happens. It always does. The question is whether enough people heard the original frequency to keep it alive underneath. Whether somewhere, right now, there's a kid in a project hallway writing something that won't make sense to the rest of us for another fifteen years.

Cash ruled everything around them in '93. It still does. The arena changes. The frequency doesn't.`,
  },
  {
    title: 'The Yellow Box',
    titleHighlight: 'Yellow Box',
    slug: 'the-yellow-box',
    date: '2025-12-29',
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
      { text: 'glasnost', color: '#CD0000', link: 'https://grokipedia.com/page/Glasnost' },
      { text: 'perestroika', color: '#CD0000', link: 'https://grokipedia.com/page/Perestroika' },
      { text: 'gradually, then suddenly', color: '#DC2626' },
    ],
    specialElements: [
      { type: 'price-counter', afterSection: 0, data: { startPrice: 0.97, endPrice: 2.49, startYear: 2019, endYear: 2025 } },
    ],
    media: [
      { src: '/media/abandoned-cart.jpg', alt: 'Empty shopping cart on barren pavement', caption: 'He was trying to explain to me what went wrong', placement: 'hero' },
      { src: '/media/supermarket-shelves.jpg', alt: 'Grocery store shelves', caption: 'Just the yellow box', placement: 'inline-left', afterSection: 0 },
      { src: '/media/sathian-yellow-box.jpg', alt: 'Sathian standing in front of yellow pasta boxes at the grocery store', caption: 'The yellow box. The thing you buy when you\'re watching every dollar.', placement: 'inline-right', afterSection: 0 },
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

In 1986, Mikhail Gorbachev made a bet. He believed that if the Soviet Union told the truth about itself and restructured from within, the system would get stronger. He called it glasnost — openness — and perestroika — restructuring. The idea was simple: expose the problems, let people discuss them, rebuild the machinery from inside, and the state would earn trust by showing it could reform.

Within five years, there was no Soviet Union.

What Gorbachev didn't account for was that the gap between what the state had been saying and what people had been living was too wide to survive exposure. For decades, the system had told its citizens that the shelves were stocked, that the economy was growing, that the West was failing. Glasnost didn't create the rot. It just let people talk about what they already knew — that the emperor had no clothes and the shelves had no food.

The collapse didn't arrive as a single dramatic event. It arrived the way Hemingway described going bankrupt: gradually, then suddenly. Years of quiet erosion — the slow accumulation of small lies, small shortages, small disappointments — and then one day, a wall comes down and everyone acts surprised. But nobody who'd been standing in line for bread was surprised. They'd known for years. They just hadn't been allowed to say it out loud.

---

Social media gave the West its own glasnost without anyone planning it.

Every institution that relied on controlling its narrative — governments, banks, media companies — suddenly had millions of people fact-checking them in real time. The gap between what was promised and what was delivered turned out to be wider than anyone in charge had expected. Central banks said inflation was transitory. The yellow box said otherwise. Politicians said the economy was strong. The rent check said otherwise. The official numbers told one story. The grocery receipt told another.

My Uber driver didn't need a history lesson to understand this. He had his own yellow box. The system told him Canada was working. The spaghetti told him it wasn't. And once you see that gap — between what the institution says and what the shelf price confirms — you can't unsee it.

This is the pattern that repeats. The Soviet citizen standing in line for bread. The Canadian immigrant staring at spaghetti prices. Different decades, different countries, same realization: the system's accounting doesn't match your lived experience, and no amount of official reassurance can put that knowledge back in the box.

---

It happens slowly, then suddenly. Millions of people around the world doing the same math my Uber driver did. Looking at the price of the most basic things and realizing the numbers don't add up. Most of them haven't heard of Bitcoin. Most of them don't know there's an alternative architecture — a ledger no central bank controls, a money supply no closed-door meeting can dilute. But they know something is wrong, the same way Soviet citizens knew something was wrong long before anyone gave them permission to say it.

Gorbachev thought transparency would save the system. It destroyed it — because the system couldn't survive being seen clearly. The question for every institution today is the same one the Soviet Union faced in 1986: can you survive your citizens doing the math?

My Uber driver already did the math. He's still driving. He's still watching the yellow box. And slowly, then suddenly, so is everyone else.`,
  },
  {
    title: 'Nine Pages',
    titleHighlight: 'Nine',
    slug: 'nine-pages',
    date: '2025-07-01',
    author: 'Sathian',
    domains: ['cryptocurrency', 'first principles'],
    description: 'I was around Bitcoin for years before I actually read the whitepaper. Nine pages changed everything. Here\'s what I found — and two versions so you can read it yourself.',
    pullQuotes: [
      'I had opinions about Bitcoin for years before I actually read the document that started it. Most people do. That\'s worth sitting with.',
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
      { text: 'bitcoin.org/bitcoin.pdf', color: '#F7931A', link: 'https://bitcoin.org/bitcoin.pdf' },
    ],
    media: [
      { src: '/media/sathian-oracle.jpg', alt: 'Sathian — Bitcoin is my religion', caption: '', placement: 'hero' },
      { src: '/media/adam-back-btc-dc.jpg', alt: 'Sathian with Adam Back at Bitcoin Conference DC', caption: 'With Adam Back — inventor of Hashcash, cited in the whitepaper — at Bitcoin Conference, DC, October 2025', placement: 'inline-right', afterSection: 1 },
    ],
    specialElements: [
      { type: 'stacked-pages', afterSection: -1 },
      { type: 'whitepaper-cta', afterSection: 3 },
    ],
    hiddenSignal: 'On page 1, section 1, Satoshi writes: "What is needed is an electronic payment system based on cryptographic proof instead of trust." Every section that follows is an answer to that single sentence. The entire system is one idea, executed with discipline.',
    body: `Here\'s my confession: I had opinions about Bitcoin for years before I actually read the document that started it. Most people do. That\'s worth sitting with.

I bought Bitcoin. I traded Bitcoin. I argued about Bitcoin at dinner tables and in group chats. I watched the price. I had takes. I talked about it with the certainty of someone who\'d done the reading — except I hadn\'t. I never sat down and read the nine-page whitepaper that Satoshi Nakamoto published on October 31, 2008. Not once. Not until 2024.

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

So here\'s what this is. A resource. Something I can send to the next person who tells me they have opinions about Bitcoin.

Read the original: bitcoin.org/bitcoin.pdf — nine pages, published October 31, 2008, by someone whose identity remains unknown. Read it like you\'d read the operating manual for something you already own but never learned to use.

Read the translation: the Gen Z version linked below — same nine sections, same ideas, different language. Read it if the original feels impenetrable, or read it after and see which version made the concepts stick.

Then decide for yourself. Which version communicated better? Which section surprised you? Did you already know how proof-of-work actually works, or were you — like me — running on borrowed conviction?

I spent years having opinions about something I hadn\'t read. Most people in Bitcoin have. Most people arguing against Bitcoin definitely have. The document is nine pages. It takes twenty minutes. There is no excuse, mine included, for not reading the primary source before forming a position.

Nine pages. Twenty minutes. Read the thing. Then we can talk.`,
  },
  {
    title: 'Yakko\'s World Was Already Wrong',
    titleHighlight: 'Already Wrong',
    slug: 'yakkos-world',
    date: '2026-02-09',
    author: 'Sathian',
    domains: ['geopolitics', 'digital sovereignty', 'culture'],
    description: 'In 1993 a cartoon Warner brother sang every country on Earth. A cypherpunk wrote a manifesto. The web went free. A billion people entered the global economy. The map was already wrong on day one — and we\'re at the same hinge point again.',
    pullQuotes: [
      'The map was already wrong on day one.',
      'Fifty-two days apart. The manifesto for encrypted money. And the free, open network it would ride on.',
      'One billion people. Gold airlifted in secrecy. A planned economy dismantled. The internet launched on the anniversary of freedom.',
      'I wasn\'t paying attention in 1993 \u2014 I was ten, watching cartoons. I\'m paying attention now.',
    ],
    theme: {
      accent: '#06B6D4',
      accentGlow: 'rgba(6, 182, 212, 0.12)',
      background: 'aurora',
      mood: 'contemplative',
    },
    sectionHeadings: [
      'The Song That Was Wrong on Day One',
      '52 Days That Changed Everything',
      'The Prophecy Book',
      'What Yakko Missed',
      'The Year the Old World Peaked',
      'The Next Hinge',
    ],
    sectionTints: ['#D4A017', '#06B6D4', '#8B5CF6', '#EF4444', '#F59E0B', '#F7931A'],
    textHighlights: [
      { text: 'A Cypherpunk\'s Manifesto', color: '#06B6D4', link: 'https://www.activism.net/cypherpunk/manifesto.html' },
      { text: 'The Sovereign Individual', color: '#8B5CF6' },
      { text: 'electronic money', color: '#F7931A', link: 'https://www.activism.net/cypherpunk/manifesto.html' },
      { text: '67 tonnes of gold', color: '#F5D442' },
      { text: 'btc.sathian.ai', color: '#F7931A', link: 'https://btc.sathian.ai' },
      { text: 'BTC Cultural Atlas', color: '#F7931A', link: 'https://btc.sathian.ai' },
      { text: 'License Raj', color: '#F5D442', link: 'https://grokipedia.com/page/Licence_Raj' },
      { text: 'glasnost', color: '#EF4444', link: 'https://grokipedia.com/page/Glasnost' },
    ],
    media: [
      { src: '/media/yakkos-world-globe.jpg', alt: 'Yakko Warner pointing at a world map, naming every country', caption: 'September 14, 1993 — Yakko names roughly 185 countries. The map was already wrong.', placement: 'hero' },
      { src: '/media/cypherpunk-manifesto.jpg', alt: 'A Cypherpunk\'s Manifesto by Eric Hughes — March 9, 1993', caption: 'March 9, 1993. Twelve paragraphs on a mailing list. "We are defending our privacy with cryptography... and with electronic money."', placement: 'inline-left', afterSection: 1 },
      { src: '/media/sovereign-individual-cover.jpg', alt: 'The Sovereign Individual by Davidson and Rees-Mogg — book cover', caption: 'Published 1997. Predicted encrypted digital money eleven years before Bitcoin.', placement: 'inline-right', afterSection: 2 },
      { src: '/media/india-ambassador-1991.jpg', alt: 'A white Hindustan Ambassador on a dusty Delhi road — symbol of the License Raj era', caption: '1991. Gold airlifted in secrecy. A planned economy dismantled. A billion people entered the global economy.', placement: 'inline-left', afterSection: 4 },
      { src: '/media/wutang-90s.jpg', alt: 'Wu-Tang Clan in the early 90s — the same year as Yakko\'s World', caption: 'November 1993. C.R.E.A.M. — Cash Rules Everything Around Me. A song about the system, the same year someone wrote a manifesto about replacing it with cryptography.', placement: 'inline-left', afterSection: 4 },
    ],
    specialElements: [
      { type: 'youtube-embed', afterSection: 0, data: { videoId: '5pOFKmk7ytU' } },
    ],
    hiddenSignal: 'September 14, 1993 was episode 2 of Animaniacs. The show\'s premiere had been September 13 \u2014 the same day the Oslo Accords were signed. The entire show debuted in a two-day window that also saw the last attempt at Middle East peace and the world\'s most comprehensive geography lesson, both rendered obsolete within the decade.',
    body: `September 14, 1993. A Tuesday. I was ten years old in Toronto, the son of parents who ran a small business. Every morning before they carted us off to work at the shop \u2014 which I despised at the time and now count as the greatest education of my life \u2014 I had a narrow window of cartoons. I savored every minute of it. That morning, I watched a cartoon Warner brother in khakis belt out the names of every country on Earth to the tune of the Mexican Hat Dance.

Yakko Warner named roughly 185 places in under two minutes. It was virtuoso. It was catchy. And it was already wrong.

I only saw it once or twice. There was no replay, no DVR, no YouTube. You caught the episode or you didn\'t. But the melody stuck. I tried to memorize it. Now, of course, I play it for my own children on demand.

Czechoslovakia had dissolved into two countries eight months earlier \u2014 the "Velvet Divorce," midnight, January 1, 1993. Yugoslavia was mid-disintegration, bleeding into wars that would produce seven successor states. Yakko sang "both Yemens" even though Yemen had unified three years prior. He named Zaire, which would become the Democratic Republic of the Congo four years later. He skipped all fifteen former Soviet republics except Russia.

The map was already wrong on day one. But I didn\'t know that. I was ten. I was learning countries from a cartoon the same week Kurt Cobain was doing his last great work.

1993 wasn\'t just a year. It was a hinge. The old world was dissolving and the new one was being coded into existence \u2014 literally \u2014 while a cartoon taught kids geography that was already obsolete.

---
Rewind six months before Yakko\'s debut.

March 9, 1993. Eric Hughes, a Berkeley mathematician, posts a 12-paragraph document to a mailing list. He calls it *A Cypherpunk\'s Manifesto*. The opening line: *"Privacy is necessary for an open society in the electronic age."*

The manifesto draws a distinction that still trips people up: privacy is not secrecy. Secrecy is hiding everything. Privacy is the power to selectively reveal yourself to the world. He argues that governments and corporations will never protect this power voluntarily. That the only defense is code. Cryptography. Anonymous systems. And \u2014 here\'s the line that echoes forward into Bitcoin \u2014 electronic money.

*"We the Cypherpunks are dedicated to building anonymous systems. We are defending our privacy with cryptography, with anonymous mail forwarding systems, with digital signatures, and with electronic money."*

Electronic money. March 1993. Fifteen years before Satoshi Nakamoto\'s whitepaper. The people who wrote the future didn\'t ask permission. They wrote code.

Now jump forward 52 days.

April 30, 1993. CERN \u2014 the European particle physics lab in Geneva \u2014 makes the most consequential decision in the history of information: they release the World Wide Web into the public domain. Free. No license fees. No restrictions.

This wasn\'t a bureaucratic inevitability. Tim Berners-Lee chose to give it away. He could have patented HTML, HTTP, URLs \u2014 the entire architecture of the modern internet. He didn\'t. He gave humanity the most powerful communication tool ever built, for free. He\'s spent the decades since watching his gift get captured by Facebook, Google, and Amazon. The cypherpunks saw this coming.

Fifty-two days apart. The manifesto for encrypted electronic money. And the free, open network it would eventually ride on.

Nobody connected these two events at the time. A mailing list post and a physicist\'s act of generosity. But together, they are the double helix of everything that followed: the open internet AND the cryptographic tools to operate privately within it.
---
Four years later, in 1997, James Dale Davidson and Lord William Rees-Mogg published *The Sovereign Individual*. If the Cypherpunk\'s Manifesto was the philosophy, this was the prophecy.

They described digital money with eerie precision: *"It will consist of encrypted sequences of multihundred-digit prime numbers. Unique, anonymous, and verifiable, this money will accommodate the largest transactions. It will also be divisible into the tiniest fraction of value."*

Written in 1997. Eleven years before Bitcoin. They described proof-of-work cryptocurrency without knowing the name.

But Davidson and Rees-Mogg went further. They predicted remote work becoming the default for knowledge workers. Digital nomads choosing jurisdictions like consumers. Nation-states losing tax revenue to cybercommerce. Citizenship becoming a product, with countries competing for residents. The cognitive elite pulling away from everyone else. Information overload making curation valuable. All of this has come true.

They also got things wrong. They predicted the collapse of public schooling by 2010, the end of democratic governance, and widespread elite abandonment of national loyalty within a generation. None of that happened on their timeline. Prophecy is never a clean hit \u2014 it\'s a direction, not a GPS coordinate.

But the direction was right. Their core thesis: the nation-state \u2014 the thing Yakko was singing about \u2014 was a product of industrial-age economics. Gunpowder and factories made large territorial governments efficient. But information technology would reverse that equation. In the Information Age, the individual with skills and mobility would become sovereign.

I read *The Sovereign Individual* in 2023, thirty years after Yakko\'s World aired. By then, I was watching every prediction play out in real time. Bitcoin crossing $100K. Fifty countries offering digital nomad visas. My own career untethered from any single geography. Peter Thiel writing the foreword to the reprint, calling it the book that shaped his worldview.

They understood something fundamental: when the cost of information drops to zero, the structures built on controlling information collapse. They saw it, they said it, and they built toward it.
---
Since September 14, 1993, at least 34 significant changes have occurred to the political map of the world. Countries ceased to exist. New ones formed. Others renamed themselves entirely. Yakko skipped 40+ nations \u2014 all fourteen non-Russian former Soviet republics, the Yugoslav successor states, most Pacific island nations, half the Caribbean.

The song named roughly 185 places. The world now has 193 UN member states plus dozens of disputed territories. The map is a living document, and the institutions drawn on it are more fragile than we\'re taught to believe.

And here\'s the thing: the next 34 changes won\'t just be borders. They\'ll be currencies, protocols, and identity systems. The map of money is about to undergo the same violent redrawing that the map of nations went through in the 1990s.
---
1993 wasn\'t just geopolitics and manifestos. It was a creative supernova \u2014 the kind that only happens when an old world is burning out and a new one hasn\'t quite ignited.

Nirvana released *In Utero* in September \u2014 the same month Yakko sang. Six months later, Kurt Cobain was dead. When I was ten, Nirvana was just the loud music my older cousins played. Now I hear it as the sound of a world that knew something was ending but couldn\'t articulate what came next.

Wu-Tang Clan dropped *36 Chambers* in November. C.R.E.A.M. \u2014 Cash Rules Everything Around Me \u2014 became the anthem. A song about money, survival, and the system, released the same year someone wrote a manifesto about replacing that entire system with cryptography.

The Oslo Accords were signed on September 13 \u2014 one day before Yakko\'s World aired. Rabin and Arafat shaking hands on the White House lawn. The optimism of that handshake didn\'t survive the decade. The EU formally came into existence on November 1. Nations binding together while others were splitting apart.

And then there was India. Two years before Yakko sang, in July 1991, the world\'s largest democracy was days away from sovereign default. Foreign reserves had fallen to $1.2 billion \u2014 enough for two weeks of imports. The government, in secret, airlifted 67 tonnes of gold to London and Zurich as collateral for emergency loans. Citizens were voting in general elections while their nation\'s gold reserves were being flown out of the country in crates.

What followed was the dismantling of the License Raj \u2014 four decades of state control over India\'s economy. Finance Minister Manmohan Singh, presenting the reforms to Parliament, opened with Victor Hugo: *"No power on earth can stop an idea whose time has come."* A billion people entered the global economy. And four years later, on August 15, 1995 \u2014 Independence Day \u2014 India launched its public internet. The date was chosen deliberately. Sovereignty and connectivity, fused in one symbolic act.

One billion people. Gold airlifted in secrecy. A planned economy dismantled. The internet launched on the anniversary of freedom. If you want to understand what a hinge looks like from inside, look at India between 1991 and 1995. It looked like collapse. It was a beginning.

And through all of it, a ten-year-old in Toronto was watching a cartoon character sing about countries, absorbing a worldview that was already dissolving. That kid was at the peak of the old childhood \u2014 the last generation to grow up without the internet, to learn geography from cartoons instead of algorithms, to experience a world that still felt stable even as it was fracturing underneath.

I think about this a lot now. Because I have young children about to turn seven. They\'re the age where the world is still a song you can memorize. And I\'m acutely aware that the map I hand them will be wrong too.
---
Here\'s the thread that connects all of this.

1991. India airlifts its gold and dismantles a planned economy. A billion people step into the open market.

1993. A cartoon sings about nations. A cypherpunk writes about electronic money. The web goes free. Countries dissolve and reform. Nirvana plays its last great year.

1995. India launches its internet on Independence Day. The old world\'s largest democracy connects to the new world\'s infrastructure.

1997. Two economists predict that digital currency will look like *"encrypted sequences of multihundred-digit prime numbers"* and that nation-states will *"starve to death"* as tax revenues decline.

2008. Satoshi Nakamoto publishes the Bitcoin whitepaper on a cypherpunk mailing list. The abstract begins: *"A purely peer-to-peer version of electronic cash..."*

2009. The genesis block is mined. Block 0. The beginning of money that doesn\'t need a nation.

2026. And now?

We\'re at the next hinge. I wasn\'t paying attention in 1993 \u2014 I was ten, watching cartoons. I\'m paying attention now.

Bitcoin has crossed from experiment to infrastructure \u2014 nation-states are buying it, ETFs hold it, the thing the cypherpunks described in a manifesto is on the balance sheets of sovereign wealth funds. Identity is moving on-chain: ENS names, Nostr key pairs, self-sovereign credentials. The next generation won\'t need a government to prove who they are. The map is fracturing again \u2014 new currencies, new protocols, new forms of sovereignty that don\'t correspond to any line on a map.

The people who saw 1993 clearly \u2014 Hughes, Berners-Lee, Davidson, Rees-Mogg, and later Satoshi \u2014 they didn\'t just predict. They built. They wrote code. They released things into the world.

I\'m building too. That\'s what the BTC Cultural Atlas is \u2014 btc.sathian.ai \u2014 my attempt to map what I see happening.

---

*The original "Yakko\'s World" was written by Randy Rogel and performed by Rob Paulsen as Yakko Warner. It first aired as part of Animaniacs, Season 1 Episode 2, on September 14, 1993. The song remains one of the most creative pieces of educational entertainment ever produced. This essay is written in admiration of that work.*`,
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getAllArticles(): Article[] {
  return articles
}
