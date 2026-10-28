const fs=require('node:fs')
const path=require('node:path')
const assert=(ok,message)=>{if(!ok)throw new Error(message)}
async function inspectSolana(page,url,width,folder,label){
 await page.setViewportSize({width,height:1000})
 await page.goto(url+'/learn',{waitUntil:'domcontentloaded'})
 const card=page.locator('.learn-history-feed .topic-solana')
 await card.waitFor();await card.scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready)
 const state=await card.evaluate(card=>{
  const bounds=card.getBoundingClientRect()
  const notes=[...card.querySelectorAll('.learn-history-note')].map(note=>{const range=document.createRange();range.selectNodeContents(note);const r=range.getBoundingClientRect();return{text:note.textContent,whiteSpace:getComputedStyle(note).whiteSpace,fontSize:parseFloat(getComputedStyle(note).fontSize),left:r.left,right:r.right,bottom:r.bottom,inside:r.left>=bounds.left+4&&r.right<=bounds.right-4&&r.bottom<=bounds.bottom-4}})
  return{card:{left:bounds.left,right:bounds.right,bottom:bounds.bottom,width:bounds.width,height:bounds.height},notes,overflow:document.documentElement.scrollWidth>innerWidth+1}
 })
 await card.screenshot({path:path.join(folder,`${label}-solana-${width}.png`)})
 return state
}
async function inspectProof(page,url,width,folder,label){
 await page.setViewportSize({width,height:1000});await page.goto(url+'/proof',{waitUntil:'domcontentloaded'})
 const faq=page.locator('.proof-faq');const image=faq.locator('.faq-art img');await image.scrollIntoViewIfNeeded();await image.evaluate(i=>i.decode())
 const summary=faq.locator('summary').first();await summary.focus();await page.keyboard.press('Enter');assert(await faq.locator('details').first().getAttribute('open')!==null,'FAQ still opens by keyboard')
 const state=await faq.evaluate(faq=>{const image=faq.querySelector('.faq-art img'),grid=faq.querySelector('.faq-layout'),summary=faq.querySelector('summary'),body=faq.querySelector('details p'),r=image.getBoundingClientRect(),g=grid.getBoundingClientRect();return{artWidth:r.width,artHeight:r.height,artNaturalWidth:image.naturalWidth,gridWidth:g.width,artFraction:r.width/g.width,questionFont:parseFloat(getComputedStyle(summary).fontSize),questionWeight:Number(getComputedStyle(summary).fontWeight),bodyFont:parseFloat(getComputedStyle(body).fontSize),overflow:document.documentElement.scrollWidth>innerWidth+1}})
 await faq.screenshot({path:path.join(folder,`${label}-faq-${width}.png`)})
 const how=page.locator('.product-explainer');await how.scrollIntoViewIfNeeded()
 state.heading=await how.locator('h2').evaluate(h=>({text:h.textContent,weight:Number(getComputedStyle(h).fontWeight)}))
 state.steps=await how.locator('h3').evaluateAll(headings=>headings.map(h=>{const p=h.parentElement.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(h);const r=range.getBoundingClientRect();return{weight:Number(getComputedStyle(h).fontWeight),inside:r.left>=p.left-1&&r.right<=p.right+1}}))
 await how.screenshot({path:path.join(folder,`${label}-how-${width}.png`)})
 return state
}
module.exports=async function verifyLegibility(context,base,folder){
 const page=await context.newPage();const receipt={baseline:[],candidate:[],notes:'Read-only baseline and protected candidate; no form submissions, video playback or navigation changes.'}
 try{
  for(const width of [320,390,768,1440]){
   const baselineSolana=await inspectSolana(page,'https://sathian.ai',width,folder,'before')
   const baselineProof=await inspectProof(page,'https://sathian.ai',width,folder,'before')
   receipt.baseline.push({width,solana:baselineSolana,proof:baselineProof})
   const solana=await inspectSolana(page,base,width,folder,'after')
   assert(!solana.overflow&&solana.notes.length===2&&solana.notes.every(n=>n.inside&&n.whiteSpace==='normal'&&n.fontSize>=16),`${width}: complete Solana context must fit inside the card`)
   const proof=await inspectProof(page,base,width,folder,'after')
   assert(!proof.overflow&&proof.questionFont>=19&&proof.questionWeight>=600&&proof.bodyFont>=17&&proof.heading.weight>=600&&proof.steps.every(s=>s.inside&&s.weight>=600),`${width}: readable headings and questions without overflow`)
   assert(Math.abs(proof.artWidth/proof.artHeight-1.5)<.02,'FAQ artwork retains original aspect ratio')
   if(width===1440)assert(proof.artWidth>=400&&proof.artFraction>=.4&&proof.artFraction<=.6&&proof.artWidth>baselineProof.artWidth*1.25,'FAQ artwork materially enlarged alongside questions')
   if(width<=900)assert(proof.artFraction>.95,'narrow FAQ artwork uses the available width')
   receipt.candidate.push({width,solana,proof})
  }
  receipt.status='passed'
 }catch(error){receipt.status='failed';receipt.error=error.message;throw error}finally{fs.writeFileSync(path.join(folder,'legibility-receipt.json'),JSON.stringify(receipt,null,2));await page.close()}
}
