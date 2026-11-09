import Image from 'next/image'

export function QuestionArtwork({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={360} height={270} sizes="(max-width: 760px) 44vw, 200px" quality={65} loading="lazy" />
}
