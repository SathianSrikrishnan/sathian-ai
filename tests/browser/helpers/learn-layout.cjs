const assert = (ok, message) => { if (!ok) throw new Error(message) }
module.exports = async function verifyLearnLayout(page, width) {
  const cards = page.locator('.learn-solana-lessons .learn-picture-lesson')
  assert(await cards.count() === 2, 'two Solana cards share one lesson grid')
  const boxes = await cards.evaluateAll(elements => elements.map(e => { const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height} }))
  assert(Math.abs(boxes[0].width-boxes[1].width)<1, 'Solana cards have matching widths')
  if (width>700) assert(Math.abs(boxes[0].y-boxes[1].y)<1, 'Solana cards share a desktop row')
  else assert(boxes[1].y >= boxes[0].y+boxes[0].height, 'Solana cards stack without overlap on mobile')
  for (const video of await page.locator('.learn-solana-lessons video').all()) {
    const state=await video.evaluate(v=>{const r=v.getBoundingClientRect();return {width:r.width,height:r.height,preload:v.preload,paused:v.paused,autoplay:v.autoplay,fit:getComputedStyle(v).objectFit}})
    assert(Math.abs(state.width/state.height-16/9)<0.02, 'Solana media preserves a 16:9 frame')
    assert(state.preload==='none' && state.paused && !state.autoplay, 'Solana videos remain quiet until play')
    assert(state.fit==='contain', 'Solana media is not cropped')
    assert(await video.locator('track[kind="captions"]').count()===1, 'Solana captions retained')
  }
  for (const note of await page.locator('.learn-solana-lessons .learn-history-note').all()) {
    assert(await note.evaluate(e => e.scrollWidth <= e.clientWidth + 1), 'historical labels wrap within the card')
  }
  const labels=await page.locator('nav[aria-label="Learning navigation"] a').allTextContents()
  assert(JSON.stringify(labels)===JSON.stringify(['Home','Proof','Learn','Write']), 'Learn navigation follows the shared order')
  assert(await page.locator('link[rel="canonical"]').getAttribute('href')==='https://sathian.ai/learn', 'Learn canonical retained')
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1), 'Learn fits viewport')
}
