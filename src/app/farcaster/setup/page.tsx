import type {Metadata} from 'next'

import Link from 'next/link'

import styles from '../farcaster.module.css'

export const metadata:Metadata={title:'Farcaster setup | Sathian',description:'Check the computer requirements and the current state of the Farcaster setup.',alternates:{canonical:'https://sathian.ai/farcaster/setup'},openGraph:{title:'Run your own Farcaster server',description:'Open-source setup guide. Looking for one independent tester. Windows or Ubuntu; 16 GB RAM and 2 TB free disk.',url:'https://sathian.ai/farcaster/setup',type:'website',images:[{url:'https://sathian.ai/farcaster/social-card',width:1200,height:630,alt:'Run your own Farcaster server. One independent tester wanted.'}]},twitter:{card:'summary_large_image',title:'Run your own Farcaster server',description:'Open-source setup guide. One independent tester wanted.',images:['https://sathian.ai/farcaster/social-card']},robots:{index:false,follow:false}}

export default function FarcasterSetup(){return <>

  <p className="minimal-kicker">SETUP</p><h1>Set up your server.</h1>

  <p className={styles.lead}>The server runs on your computer. Start with the test build below.</p>

  <section className={styles.section}><h2>Before you start</h2><ul className={styles.requirements}><li>4 CPU cores</li><li>16 GB RAM available</li><li>2 TB free disk space</li><li>Reliable internet</li></ul><p className={styles.muted}>Prefer an SSD. Expect a large download and several hours of setup. Electricity and internet usage are yours.</p></section>

  <section className={styles.section}><h2>Windows</h2><p>Windows 11 x64, <a href="https://nodejs.org/">Node.js 24</a> and <a href="https://learn.microsoft.com/windows/wsl/install">current WSL2</a> are needed.</p>

  <div className={styles.actions}><a className={styles.primary} href="/downloads/farcaster-quickstart-test.zip" download>Download the test build</a></div>

  <p className={styles.muted}><a href="https://github.com/SathianSrikrishnan/farcaster-client-quickstart">View the code</a> · <a href="https://github.com/SathianSrikrishnan/farcaster-client-quickstart/issues/new?template=independent-test.md">Report your test</a></p>

  <ol><li>Extract the ZIP and open <strong>Start.cmd</strong>.</li><li>Choose a new data folder. In the local page, press <strong>Set up server</strong>.</li><li>When ready, press <strong>Open the app</strong>.</li></ol>

  <p className={styles.notice}>Fresh installation still needs independent verification. This is a test build, not a finished release.</p>

  <details><summary>Three commands / Linux</summary><p>The bundled QUICKSTART.md covers Windows and Ubuntu 24.04 x64, restart/resume and optional posting. Windows may ask for administrator approval or a restart. Linux may ask for sudo.</p><pre><code>{'# Source / context: extracted test build\ncd "C:\\FarcasterQuickstart"\n\n# Commands:\nnode scripts/quickstart.mjs computer --data "D:\\FarcasterNode" --install\nnode scripts/quickstart.mjs node --start\nnode scripts/quickstart.mjs app'}</code></pre><p className={styles.muted}>Choose your actual data disk. For Linux, use an absolute folder such as /mnt/data/farcaster. No cloud computer is ordered.</p></details>

  <h2>Want to test posting?</h2><p>Reading needs no account or wallet. For posting tests, this kit uses a separate Farcaster account with storage and MetaMask access to its account wallet. A second phone is not required by Farcaster. Phone-only signing is not supported by this kit.</p><p className={styles.muted}>You approve the app’s access, try a post, follow and like, then remove access. Never paste a recovery phrase into this website or app.</p>

  </section>

  <section className={styles.section}><h2>On a Mac?</h2><p>This test build does not support macOS yet. Windows 11 x64 and Ubuntu 24.04 x64 are the current installation paths; both still need a fresh independent installation test.</p></section>

  {process.env.NODE_ENV==='development'&&<section className={styles.section}><h2>Already running here</h2><div className={styles.actions}><a className={styles.primary} href="http://127.0.0.1:3424/">Open local setup</a><a href="http://127.0.0.1:3422/">Read posts</a></div><p className={styles.muted}>These two links work on this computer only.</p></section>}

  <p className={styles.section}><Link href="/farcaster/library">What does a node actually do?</Link></p>

</>}
