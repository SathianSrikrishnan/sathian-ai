'use client'
import { useState } from 'react'
const drawings = [
 { name: 'Ember the Dragon', video: 'EjE5abtCRzI' },
 { name: 'Letter Robot', video: 'CD0_I67VlFc' },
 { name: 'Red from Descendants', video: 'ehTI_yPHlJA' },
 { name: 'Toby the Sea Turtle', video: 'PpOOZ5JOcyI' },
 { name: 'Arlo the Axolotl', video: '2pvtvVRGdWw' },
 { name: 'Fiona the Fox', video: 'f9cYTJ34AqI' },
]
export function DrawingShelf() {
 const [active, setActive] = useState<string | null>(null)
 return <section className="learn-drawing-shelf" aria-label="Draw with Tanda"><div className="learn-room-section-line"><p>Draw with Tanda</p></div><div className="learn-drawing-video-grid">{drawings.map(d => <article key={d.video}>{active === d.video ? <><iframe src={`https://www.youtube-nocookie.com/embed/${d.video}?rel=0&autoplay=1`} title={`Draw ${d.name} with Tanda`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /><p>{d.name}</p></> : <button type="button" className="learn-drawing-launch" onClick={() => setActive(d.video)} aria-label={`Play ${d.name} on YouTube`}><span aria-hidden="true">▶</span><strong>{d.name}</strong></button>}<a href={`https://www.youtube.com/watch?v=${d.video}`}>Open on YouTube</a></article>)}</div></section>
}
