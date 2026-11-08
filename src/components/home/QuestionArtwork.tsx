import Image from 'next/image'
import styles from './HomeArtwork.module.css'

const descriptions = [
  'Artwork of a pink piggy bank and golden coins',
  'Artwork of Tanda and a golden coin',
  'Artwork of a child with a key beside a safe holding a piggy bank, coins and a tooth',
  'Artwork of three growing piggy banks, with coins and small flowers',
  'Artwork of a mother hugging a child holding a lost tooth',
  'Artwork of a father and child holding hands beneath a heart and sun',
  'Grandma and Me artwork with a grandmother, child, cat and flowers',
  'Artwork of a family together beneath a rainbow',
] as const

export function QuestionArtwork({ src, alt, additional }: { src: string; alt: string; additional: readonly [number, number] }) {
  return (
    <span className={styles.questionArt}>
      <Image src={src} alt={alt} width={360} height={270} sizes="(max-width: 760px) 44vw, 200px" quality={65} loading="lazy" />
      <span className={styles.questionDetails}>
        {additional.map((index) => (
          <Image key={index} src={`/proof-assets/proof-site-first-edition/collage-${index}-640.webp`} alt={descriptions[index]} width={640} height={478} sizes="(max-width: 760px) 21vw, 100px" quality={65} loading="lazy" />
        ))}
      </span>
    </span>
  )
}
