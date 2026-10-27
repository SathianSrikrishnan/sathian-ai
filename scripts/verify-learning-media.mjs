import fs from 'node:fs'
import crypto from 'node:crypto'
const lessons=JSON.parse(fs.readFileSync('src/lib/learn/lessons.json','utf8'))
const editorial=JSON.parse(fs.readFileSync('src/lib/learn/editorial-readiness.json','utf8'))
const missing=[], mismatch=[], held=[], readiness={};let checked=0
for(const lesson of lessons){const clips=[...(lesson.watch?[lesson.watch]:[]),...lesson.chapters.flatMap(c=>Object.values(c.clips))];readiness[lesson.id]=clips.length>0;for(const clip of clips){const p='public'+clip.src;if(!fs.existsSync(p)){missing.push(clip.src);readiness[lesson.id]=false;continue}checked++;if(clip.sha256&&crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==clip.sha256){mismatch.push(clip.src);readiness[lesson.id]=false}}}
for(const [id,review] of Object.entries(editorial)){if(review.status==='factual-review-needed'||review.publicReleaseApproved===false){held.push({id,status:review.status,reason:review.reason});if(review.status==='factual-review-needed')readiness[id]=false}}
// Build-time facts, not runtime filesystem checks: Vercel serves public files from its CDN.
fs.writeFileSync('src/lib/learn/availability.json',JSON.stringify(readiness,null,2)+'\n')
const result={checked,missing,mismatch,held,releaseReady:missing.length===0&&mismatch.length===0&&held.length===0};console.log(JSON.stringify(result,null,2));if(!result.releaseReady&&!process.argv.includes('--allow-incomplete'))process.exitCode=1
