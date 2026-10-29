const fs=require('node:fs'),path=require('node:path')
const film=require('../../src/lib/learn/planets.json').find(f=>f.slug==='mercury-pluto')
const assert=(ok,message)=>{if(!ok)throw new Error(message)}
module.exports=async(context,base,folder)=>{
 const page=await context.newPage(),receipt=[]
 try{
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900})
   await page.goto(base+'/learn')
   const link=page.getByRole('link',{name:'Read about Mercury and Pluto',exact:true})
   await link.focus();await page.keyboard.press('Enter')
   await page.getByRole('heading',{name:'Mercury and Pluto: a pattern across generations',exact:true}).waitFor()
   assert(new URL(page.url()).pathname===film.article,'Planet card opens its companion article')
   assert(await page.locator('main article section').count()===8,'explanation, transcript and sources are readable sections')
   assert(await page.locator('main article a').count()===4,'four primary sources linked')
   assert((await page.locator('main article').innerText()).includes('not physical connections or orbital tracks'),'drawing distinction remains explicit')
   const video=page.locator('main>video')
   assert(await video.getAttribute('src')===film.src&&await video.getAttribute('preload')==='none','article has the same optional film without eager loading')
   assert(await video.locator('track').getAttribute('src')===film.captions,'same caption track')
   await video.evaluate(async v=>{v.muted=true;await v.play()})
   await page.waitForFunction(()=>document.querySelector('main>video').currentTime>.1)
   assert(await video.evaluate((v,d)=>Math.abs(v.duration-d)<.05,film.durationSeconds),'full exact episode plays')
   await video.evaluate(v=>v.pause())
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'article fits viewport')
   await page.screenshot({path:path.join(folder,`mercury-pluto-article-${width}.png`),fullPage:true})
   await page.getByRole('link',{name:'Back to Planet Patterns',exact:true}).last().click()
   await page.locator('#planet-heading').waitFor()
   assert(new URL(page.url()).pathname==='/learn'&&new URL(page.url()).hash==='#planet-heading','article returns to the Planet shelf')
   receipt.push({width,status:'passed',duration:film.durationSeconds})
  }
 }finally{fs.writeFileSync(path.join(folder,'mercury-pluto-article-receipt.json'),JSON.stringify(receipt,null,2));await page.close()}
}
