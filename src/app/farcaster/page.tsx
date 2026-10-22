import type {Metadata} from 'next'

import Link from 'next/link'

import styles from './farcaster.module.css'

export const metadata:Metadata={title:'Run your own Farcaster server | Sathian',description:'A simple Farcaster setup experiment, with a small reading app and plain-English explanations.',alternates:{canonical:'https://sathian.ai/farcaster'},robots:{index:false,follow:false}}

export default function FarcasterProject(){return <>

  <p className="minimal-kicker">A PROJECT IN PROGRESS</p>

  <h1>Run your own<br />{' '}Farcaster server.</h1>

  <p className={styles.lead}>Read posts through your own server. I’m making the setup easier.</p>

  <div className={styles.choices}>

    <Link className={styles.choice} href="/farcaster/setup"><span>01</span><strong>Set up a server</strong><span>Requirements and steps →</span></Link>

    <Link className={styles.choice} href="/farcaster/library"><span>02</span><strong>Read the explanations</strong><span>Farcaster and Network School →</span></Link>

  </div>

  <aside className={styles.why}><h2>Why am I doing this?</h2><p>I’ve learned a lot from the Network School community. This is my way of giving something back: clear explanations and an easier way to run your own Farcaster server.</p></aside>

  <p className={styles.muted}>Test build. Looking for someone to try a fresh installation.</p>

  <div className={styles.sources}><a href="https://ns.com/about/">Network School</a></div>

</>}
