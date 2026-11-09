import { ArtworkCarousel } from './ArtworkCarousel'
import { HOME_HERO_SLIDES } from '@/content/home-hero-slides'

export function HomeHeroCarousel() {
  return <ArtworkCarousel slides={HOME_HERO_SLIDES} label="A child's village" sizes="(max-width: 760px) 100vw, 460px" hero href="/village" />
}
