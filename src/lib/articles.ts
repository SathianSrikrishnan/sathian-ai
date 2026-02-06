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
  media?: { src: string; alt: string; placeholder?: boolean }[]
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
    media: [
      { src: '/media/wu-tang-1993.jpg', alt: 'Wu-Tang Clan, circa 1993 — Staten Island', placeholder: true },
      { src: '/media/wu-tang-scotiabank-2025.jpg', alt: 'Wu-Tang Clan at Scotiabank Arena, Toronto — August 2025', placeholder: true },
      { src: '/media/bitcoin-whitepaper-page1.png', alt: 'First page of the Bitcoin whitepaper — October 31, 2008', placeholder: true },
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
    media: [
      { src: '/media/no-name-spaghetti.jpg', alt: 'No Name spaghetti — the yellow box', placeholder: true },
      { src: '/media/yeltsin-gorbachev.jpg', alt: 'Boris Yeltsin visiting a Houston supermarket, 1989', placeholder: true },
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
]

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getAllArticles(): Article[] {
  return articles
}
