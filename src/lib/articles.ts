export interface Article {
  title: string
  slug: string
  date: string
  domains: string[]
  body: string
  media?: { src: string; alt: string; placeholder?: boolean }[]
  hiddenSignal?: string
}

export const articles: Article[] = [
  {
    title: 'C.R.E.A.M. 2.0',
    slug: 'cream-2-point-0',
    date: '2026-01-27',
    domains: ['hip-hop culture', 'decentralized finance', 'truth tellers'],
    hiddenSignal: '"Reunited" — Wu-Tang Forever (1997), Method Man: "worldwide total carnage / the sickest flow that we code name Agent Orange"',
    media: [
      { src: '/media/wu-tang-1993.jpg', alt: 'Wu-Tang Clan, circa 1993 — Staten Island', placeholder: true },
      { src: '/media/wu-tang-scotiabank-2025.jpg', alt: 'Wu-Tang Clan at Scotiabank Arena, Toronto — August 2025', placeholder: true },
      { src: '/media/bitcoin-whitepaper-page1.png', alt: 'First page of the Bitcoin whitepaper — October 31, 2008', placeholder: true },
    ],
    body: `Last August I was sitting in the Scotiabank Arena watching Wu-Tang Clan perform in Maple Leafs jerseys. My buddy and I were the only ones smoking joints in the building — which twenty years ago at a Wu-Tang show would've been the least notable thing happening. But this wasn't 2003. This was nine men in their fifties reminiscing on verses they wrote as teenagers, for an audience that included an eleven-year-old kid from Sudbury losing his mind to C.R.E.A.M.

Cash Rules Everything Around Me. The anthem of project kids in Staten Island, now soundtracking a corporate arena experience for small-town Ontario families.

Wu-Tang had become their own ETF — the authentic thing, repackaged, sanitized, and sold to a broader market at a premium. The raw signal wrapped in institutional clothing.

---

In 1993, Wu-Tang did something labels said couldn't be done. They kept the group together while every member negotiated solo deals. No label owned them. They built Shaolin. RZA constructed the sound by sampling kung fu movies, dusty soul records, and street corner philosophy — pieces that already existed, threaded into something that hadn't.

There were always nine members, plus Cappadonna on his own label. It was always "Wu-Tang Clan *featuring* Cappadonna" — the tenth man with an asterisk. When ODB died in 2004, the asterisk disappeared. Cap stepped in. Even the clan's membership rules evolved when they had to. Institutions always do.

On their 1997 album *Wu-Tang Forever*, Method Man dropped a line on "Reunited" — *worldwide total carnage, the sickest flow that we code name Agent Orange.* Agent Orange was a chemical weapon sprayed across Vietnam. But *agent* and *orange* together hit different now. Bitcoin's color is orange. Its agents are autonomous. Its protocol runs without a name on the door.

I collect these — old hip-hop lines that accidentally predicted crypto before crypto existed. It's a hobby. You'll find them buried throughout this site if you look.

---

Fifteen years after Wu-Tang built Shaolin, Satoshi dropped a nine-page whitepaper the same way RZA dropped *Enter the Wu-Tang*. No publisher. No institution. No face. Just: here's the work.

And like RZA, Satoshi didn't invent the components. Adam Back had built Hashcash — proof-of-work — back in 1997, the same year Wu-Tang Forever came out. Hal Finney built Reusable Proof of Work. Wei Dai proposed b-money. Nick Szabo sketched Bit Gold. David Chaum had been working on digital cash since the early nineties. Satoshi sampled all of it. Threaded existing cryptographic ideas together the way a producer threads existing sounds — into something that hadn't existed before.

The first person to exchange bitcoin for dollars was Martti Malmi — a Finnish developer who sold 5,050 BTC for $5.02 over PayPal in October 2009. Five dollars to etch the first price on the blockchain. Before Malmi, Bitcoin had no market value. After him, the snowball started. First a handful of developers. Then the cypherpunks. Then the world.

That's how every movement starts. Not with mass adoption but with a handful of people in the margins who hear something everyone else is ignoring. A few kids in Staten Island who heard what RZA was building. A few cryptographers who read what Satoshi wrote. The signal doesn't start loud. It starts specific.

---

That kid from Sudbury singing along to C.R.E.A.M. doesn't know any of this history. He doesn't know the song was written in a project hallway about surviving a system that wasn't built for the people inside it. He just knows it hits.

The signal finds people when they're ready. Wu-Tang went from Staten Island to Scotiabank Arena. Bitcoin went from Malmi's five-dollar PayPal transaction to a hundred-thousand-dollar asset. The signal always gets louder. The question is what it sounds like after the institutions get hold of it — and whether the next generation hears the original frequency or only the repackaged version.

The signal was always there. Most of us just weren't ready to hear it.

Cash ruled everything around them in '93. It still does. The protocol just changed.`,
  },
  {
    title: 'The Yellow Box',
    slug: 'the-yellow-box',
    date: '2026-01-27',
    domains: ['institutional decay', 'personal sovereignty', 'parenting', 'truth tellers'],
    media: [
      { src: '/media/no-name-spaghetti.jpg', alt: 'No Name spaghetti — the yellow box', placeholder: true },
      { src: '/media/yeltsin-gorbachev.jpg', alt: 'Boris Yeltsin and Mikhail Gorbachev', placeholder: true },
      { src: '/media/toronto-skyline.jpg', alt: 'Toronto skyline', placeholder: true },
    ],
    body: `I had just dropped off my kids and was heading to a dinner across town. My Uber driver — a guy who'd come to Canada from Afghanistan in 2017 — was trying to explain to me what went wrong.

When he arrived, Canada was paradise. He started driving, things were good, the math worked. Somewhere in the last few years, the math stopped working and he couldn't figure out why. He wasn't reading economics papers or following central bank announcements. But he had an analogy that was better than anything I'd read in the Financial Post.

No Name spaghetti. The yellow box. Loblaw's cheapest option — the thing you buy when you're watching every dollar. It was about a dollar a few years ago. Now it's well over two. The most basic nutrition on the shelf, more than doubled, while nothing else about his life changed except what he could afford.

Before you get to housing. Before you get to gas or daycare or rent. Just the yellow box. That's the signal.

---

A few weeks earlier, my twin daughters had each lost a tooth — within days of each other, because that's what twins do. Their mom told me the tooth fairy left them five dollars each.

Five dollars. I got one dollar when I lost my first tooth. My parents left it under my pillow with a little handwritten note. That was the early nineties. Thirty years later the tooth fairy pays five times more for the same tooth.

Even the tooth fairy has inflation.

But here's where it gets interesting. In October 2009, a Finnish developer named Martti Malmi sold 5,050 bitcoins for $5.02 — the first time anyone exchanged bitcoin for dollars. Five dollars. That's what it cost to set the first price on the blockchain. Before Malmi, Bitcoin had no market value. After that five-dollar PayPal transaction, the snowball started to roll.

Five dollars from the tooth fairy. Five dollars for the genesis of a trillion-dollar protocol. Same amount. The tooth fairy's five dollars will be worth less next year. Malmi's five dollars bought an asset that went from a fraction of a penny to over a hundred thousand dollars — and will be worth orders of magnitude more within our lifetimes.

I told my daughters I'd also left them something. I'd deposited some sats — satoshis, the smallest unit of Bitcoin — into their digital wallets. They stared at me. "What are sats?"

What followed was twenty minutes of questions I wasn't fully prepared for, which is how most of my best parenting moments start. Why does money change? Why does the tooth fairy give more now? What makes sats different from dollars? They didn't get all of it. But they asked, and I'd rather they ask early than figure it out late — the way I did.

That conversation became a project. I started building a series of stories for them — characters they already knew from their bedtime world, exploring money, value, and why the tooth fairy's rates keep going up. That work lives in a different part of this site, behind a door. If you're curious, ask.

---

In 1986, Gorbachev bet that if the Soviet Union told the truth about itself, the system would get stronger. He called it glasnost — openness. Within five years, there was no Soviet Union. Transparency didn't reform the system. It exposed it.

Social media gave the West its own glasnost without anyone planning it. Every institution that relied on controlling its narrative — governments, banks, media — suddenly had millions of people fact-checking them live. And the gap between what was promised and what was delivered turned out to be as embarrassing as empty Soviet shelves.

My Uber driver didn't need a history lesson to understand this. He had the yellow box. The system told him Canada was working. The spaghetti told him it wasn't. And once you see that gap — between what the institution says and what the shelf price confirms — you can't unsee it.

That's the thing about transparency. It doesn't fix broken systems. It exposes them. Gorbachev learned that. My Uber driver is learning it in real time. My daughters will learn it — one lost tooth, one sat at a time.

---

I didn't understand any of this when I was younger. A friend put *End the Fed* by Ron Paul in my hands years ago and told me to pay attention. I nodded and didn't listen. Later I stumbled across people building alternative financial systems from scratch — and something clicked. But the real education came from running my own business head-to-tail and watching how easily short-term incentives drown out long-term thinking.

The signal was always there. I just wasn't ready to hear it.

That's the thread that connects everything I write about on this site. Cryptographers, technologists, rappers, comedians — the people I'm drawn to are all truth tellers. People who said the uncomfortable thing before the crowd was ready to hear it. Satoshi published a whitepaper nobody asked for. Ron Paul wrote a book most people laughed at. RZA built a sound out of things other people threw away. Truth doesn't always arrive when you're ready for it. But once you hear it — once you pick up the yellow box and actually look at the price — you can't unhear it.

The people building alternatives right now — sovereign technology, decentralized finance, local-first infrastructure — aren't idealists. They're people who picked up the yellow box, looked at the price, and started asking questions nobody around them was asking.

My daughters are asking those questions now. One lost tooth, one sat at a time.

That's how it always starts. Not with a revolution. With a question at the grocery store.`,
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getAllArticles(): Article[] {
  return articles
}
