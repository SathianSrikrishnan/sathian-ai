import StorySelector from '@/components/toothfairy/story/StorySelector'
import tanda from '@/data/stories/tanda'
import ratoncitoPerez from '@/data/stories/ratoncito-perez'
import finland from '@/data/stories/finland'
import northAfrica from '@/data/stories/north-africa'
import jamaica from '@/data/stories/jamaica'
import korea from '@/data/stories/korea'
import romania from '@/data/stories/romania'
import japan from '@/data/stories/japan'
import ethiopia from '@/data/stories/ethiopia'
import cherokee from '@/data/stories/cherokee'
import ireland from '@/data/stories/ireland'
import italy from '@/data/stories/italy'
import babylonia from '@/data/stories/babylonia'

// Tanda first (newest build), then the 12 original traditions.
const STORIES = [
  tanda,
  ratoncitoPerez,
  finland,
  northAfrica,
  jamaica,
  korea,
  romania,
  japan,
  ethiopia,
  cherokee,
  ireland,
  italy,
  babylonia,
]

export const metadata = {
  title: 'Stories | Tooth Fairy Network',
  description: 'Every culture has a tooth tradition. A hummingbird fairy in America. A mouse in Spain. A magpie in Korea. Start with the origin — Tanda.',
}

export default function StoriesPage() {
  return <StorySelector stories={STORIES} simple />
}
