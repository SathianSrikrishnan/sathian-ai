import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Tooth Fairy Network — Choose Your Tradition',
  description: '13 traditions. 13 characters. 5 continents. Pick your culture and begin the magic.',
}

export default function StoryPage() {
  redirect('/toothfairy/stories')
}
