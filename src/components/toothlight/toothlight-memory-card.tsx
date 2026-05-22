import styles from "./toothlight-memory-card.module.css"

export type ToothlightMemory = {
  title: string
  date: string
  quote: string
  image: string
  alt: string
  href?: string
}

type ToothlightMemoryCardProps = {
  memory: ToothlightMemory
  size?: "hero" | "large" | "medium" | "small"
  framed?: boolean
  className?: string
}

export const toothlightDemoMemories: ToothlightMemory[] = [
  {
    title: "Robot-dog wish",
    date: "Saved May 5",
    quote: "I want the Tooth Fairy to get me a robot dog.",
    image: "/v3/memories/robot-dog-wish.png",
    alt: "A real lost tooth resting on a hand with colorful child-drawn marks and a heart",
    href: "/toothfairy/keepsake/D2KhUfrDSs6ejGcfNEXfaYQMxPz4SH5Rd87h9ZUsGMSa",
  },
  {
    title: "Wiggly for two weeks",
    date: "Saved May 5",
    quote: "It was wiggling for two weeks.",
    image: "/v3/memories/wiggly-two-weeks.png",
    alt: "A child holding a baby tooth with blue, green, and orange drawings added over the photo",
    href: "/toothfairy/keepsake/F8pf5qkNMkSL5pBdrfk88piukq65MLTjsnYyXYBix62E",
  },
  {
    title: "Dad helped draw it",
    date: "Saved May 11",
    quote: "My tooth fell out today and I made a drawing with my dad.",
    image: "/v3/memories/dad-helped-draw-it.png",
    alt: "A child's drawing of a tooth, sun, green hills, and a small house on paper",
    href: "/toothfairy/keepsake/5DffDLpt4B4Gwm61P6msyHWHgC5RzD8RToYY5nQovVhw",
  },
  {
    title: "Dinner became the story",
    date: "Saved May 13",
    quote: "The spicy dinner became part of the memory.",
    image: "/v3/memories/dinner-became-story.png",
    alt: "A storybook portrait of a parent and two children with gold wings and a moonlit frame",
    href: "/toothfairy/keepsake/AjLMXmNP9A6hfzQuTYLG1drU5JppViraCf8NwGmngK1r",
  },
  {
    title: "First handoff",
    date: "Saved May 11",
    quote: "A small tooth, held in the palm, ready to become a keepsake.",
    image: "/v3/memories/first-handoff.png",
    alt: "A small baby tooth resting in the palm of a hand with a soft illustrated finish",
    href: "/toothfairy/keepsake/5hsP9CctgecT2bYqdhuLM3Kn2s3JzoVp8iZUWNLFvvfi",
  },
  {
    title: "First drawing",
    date: "Saved May 8",
    quote: "I hope this drawing stays with us.",
    image: "/v3/memories/first-drawing.png",
    alt: "A childlike drawing with gold and silver shapes on warm paper",
    href: "/toothfairy/keepsake/7SuoSiQMBuB8dLC5kswfQoVCcq2ArSdRTMG6ErJDqVzN",
  },
]

export const toothlightNetworkMemories: ToothlightMemory[] = [
  ...toothlightDemoMemories,
  {
    title: "Your next Toothlight",
    date: "Coming next",
    quote: "A new family memory can appear here when it is ready.",
    image: "/story-assets/placeholder-gold.svg",
    alt: "A warm gold future slot for a Toothlight memory card",
  },
]

function ToothGlint() {
  return (
    <svg className={styles.toothGlint} viewBox="0 0 38 44" aria-hidden>
      <path
        d="M19.1 4.2c-5.5 0-10 4.1-10.4 9.6-.3 3.5.7 6.5 1.8 9.6.9 2.4 1.2 5.8 1.6 9.2.4 3.1 1.5 5.8 3.6 5.8 1.8 0 2.4-2.5 2.8-5.8.2-1.7.5-3.1.7-3.8.2.7.5 2.1.7 3.8.4 3.3 1.1 5.8 2.8 5.8 2.1 0 3.2-2.7 3.6-5.8.4-3.4.8-6.8 1.6-9.2 1.1-3.1 2.1-6.2 1.8-9.6-.4-5.5-5.2-9.6-10.8-9.6Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ToothlightMemoryCard({
  memory,
  size = "medium",
  framed = true,
  className = "",
}: ToothlightMemoryCardProps) {
  const content = (
    <article
      className={[
        styles.card,
        styles[size],
        framed ? styles.framed : styles.unframed,
        className,
      ].join(" ")}
    >
      <span className={styles.orbitOne} aria-hidden />
      <span className={styles.orbitTwo} aria-hidden />
      <span className={styles.sparkleA} aria-hidden />
      <span className={styles.sparkleB} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.imageWrap}>
          <img className={styles.image} src={memory.image} alt={memory.alt} draggable={false} />
          <span className={styles.imageGlow} aria-hidden />
        </div>
        <div className={styles.copy}>
          <p>{memory.date}</p>
          <h3>{memory.title}</h3>
          <blockquote>&ldquo;{memory.quote}&rdquo;</blockquote>
        </div>
        <ToothGlint />
      </div>
    </article>
  )

  if (!memory.href) return content

  return (
    <a href={memory.href} className={styles.link} aria-label={`Open ${memory.title}`}>
      {content}
    </a>
  )
}
