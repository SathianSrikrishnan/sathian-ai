import { Kalam, Patrick_Hand } from 'next/font/google'
import './learn.css'
import './review.css'
import './classroom.css'
const hand = Patrick_Hand({ subsets: ['latin'], weight: '400', variable: '--font-learn-hand', display: 'swap' })
const title = Kalam({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-learn-title', display: 'swap' })
export default function LearnLayout({ children }: { children: React.ReactNode }) { return <div className={`learn-shell ${hand.variable} ${title.variable}`}>{children}</div> }
