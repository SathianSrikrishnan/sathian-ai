import type { Metadata } from 'next'

import Link from 'next/link'

import { available, lessons } from '@/lib/learn/catalog'



import { LessonCollection } from '@/components/learn/LessonCollection'



import { DrawingShelf } from '@/components/learn/DrawingShelf'
import { StoryShelf } from '@/components/learn/StoryShelf'
import { ClassroomBorder } from '@/components/learn/ClassroomBorder'

import { MeetGuides } from '@/components/learn/MeetGuides'

export const metadata: Metadata = {
  title: { absolute: 'Learn with Tanda: Free Stories and Money Lessons for Kids' },
  description: 'Free illustrated stories, short lessons on money and the internet, and draw-along videos with Tanda the tooth fairy. For children and the grown-ups who love them.',
  alternates: { canonical: 'https://sathian.ai/learn' },
  openGraph: {
    title: 'Learn with Tanda: Free Stories and Money Lessons for Kids',
    description: 'Free illustrated stories, money lessons and draw-along videos for families.',
    url: 'https://sathian.ai/learn',
    siteName: 'Sathian',
    images: [{ url: 'https://sathian.ai/learn-art/classroom-master.webp', alt: 'Tanda teaching a family about saving and digital money' }],
  },
}

export default function LearningBoard() {



  return <main className="learn-board learn-review learn-room family-surface">

    <div className="proof-family-wall" aria-hidden="true">{Array.from({length:20},(_,i)=><img key={i} src={`/proof-assets/proof-site-first-edition/collage-${i%8}.jpg`} alt="" />)}</div><nav className="learn-nav family-nav" aria-label="Learning navigation"><a href="https://sathian.ai">sathian.ai</a><a href="https://proof.sathian.ai">PROOF</a><a href="https://sathian.ai/learn" aria-current="page">Learn with Tanda</a></nav><MeetGuides />

    <ClassroomBorder><header className="learn-feed-heading learn-hero-first"><h1>Learn with Tanda</h1><p className="learn-feed-tagline">Big ideas made simple</p><a className="learn-hero-zoom" href="/learn-art/classroom-master.webp" target="_blank" rel="noreferrer" aria-label="View the complete classroom illustration in a new tab"><img className="learn-classroom-art" src="/learn-art/classroom-master.webp" alt="Tanda, Sathian and two children at a classroom board illustrating Dollars (USDC), Bitcoin and SOL, a digital vault screen, a public receiving address, a private key and physical Proof keepsakes." width="1672" height="941" fetchPriority="high" /></a><span className="learn-hero-zoom-note">Tap the illustration to enlarge.</span></header></ClassroomBorder>
    <div className="learn-room-section-line"><h2>More to explore</h2></div>
    <LessonCollection lessons={lessons} readyIds={lessons.filter(available).map(l => l.id)} />

    <StoryShelf />
    <DrawingShelf />

    <div className="learn-play-shelf"><a className="learn-play-card learn-play-planets" href="https://srikrishnan.work/planet-patterns"><div className="learn-play-planets-art"><img src="/learn-art/venus.png" alt="" loading="lazy" /><img src="/learn-art/earth.png" alt="" loading="lazy" /></div><div><p className="learn-resource-title">Planet Patterns</p><span>Try the interactive planet-drawing app.</span></div></a></div>


    <aside className="learn-adult-invitation" aria-label="Gift invitation for adults"><div><p>For grown-ups</p><a className="learn-proof-hub" href="https://proof.sathian.ai">Explore PROOF</a></div><a className="learn-button learn-gift-invitation" href="https://toothfairy.network/give/start">Be the Tooth Fairy</a></aside>


    <footer className="learn-footer"><a href="https://toothfairy.network/#home-faq">Product questions</a><a href="https://sathian.ai/privacy">Privacy</a><a href="mailto:info@toothfairy.network?subject=PROOF%20question%20or%20request">Questions or requests? Email us</a></footer>

  </main>

}
