const {chromium}=require('playwright'),fs=require('fs'),assert=require('assert/strict');
const base=process.env.MOBILE_BASE||'http://127.0.0.1:4322/ccac',label=process.env.MOBILE_LABEL||'candidate';
(async()=>{const browser=await chromium.launch({headless:true}),proof=[];fs.mkdirSync('tmp/ccac-mobile-proof',{recursive:true});try{
 for(const [width,height] of [[360,780],[384,832],[412,915],[832,384],[915,412],[1280,1000]]){
 const p=await browser.newPage({viewport:{width,height},isMobile:width<1000,hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const song of ['river','canon','fur-elise','little-lanterns']){
 await p.goto(base+'?song='+song,{waitUntil:'domcontentloaded'});await p.locator('[data-song="'+song+'"][aria-current]').waitFor();
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 if(song==='river'){
 await p.locator('#river-load').click();await p.locator('#river-screen iframe').waitFor();
 const box=await p.locator('#river-screen iframe').boundingBox();assert.ok(box.width<=width&&box.x>=0&&box.x+box.width<=width+1);
 }else{
 const geometry=await p.evaluate(()=>{const s=document.querySelector('#piano-scroll'),k=[...document.querySelectorAll('.piano-key.white')],a=k[0].getBoundingClientRect(),z=k.at(-1).getBoundingClientRect();return{viewport:innerWidth,visible:s.clientWidth,total:s.scrollWidth,first:a.left,last:z.right};});
 if(width<1000){assert.ok(geometry.total<=geometry.visible+1,JSON.stringify(geometry));assert.ok(geometry.first>=0&&geometry.last<=width,JSON.stringify(geometry));}
 await p.getByRole('button',{name:'Play',exact:true}).click();await p.waitForFunction(()=>window.pianoDiagnostics().position>.35);
 assert.equal(await p.evaluate(()=>window.pianoDiagnostics().media.error),null);
 const moving=await p.evaluate(async()=>{const e=document.querySelector('.falling-note:not([hidden])'),a=e.style.transform;await new Promise(r=>setTimeout(r,120));return a!==e.style.transform});assert.ok(moving);
 await p.getByRole('button',{name:'Pause',exact:true}).click();
 if(width<1000){await p.getByRole('button',{name:'Larger keys',exact:true}).click();assert.ok(await p.locator('#piano-scroll').evaluate(e=>e.scrollWidth>e.clientWidth));await p.locator('#piano-scroll').evaluate(e=>e.scrollLeft=e.scrollWidth);assert.ok(await p.locator('#piano-scroll').evaluate(e=>e.scrollLeft>0));await p.getByRole('button',{name:'Show full piano',exact:true}).click();assert.equal(await p.locator('#piano-scroll').evaluate(e=>e.scrollLeft),0);}
 proof.push({width,height,song,...geometry});
 }
 if(width===384||width===832||width===1280)await p.screenshot({path:`tmp/ccac-mobile-proof/${label}-${width}-${song}.png`,fullPage:true});
 }assert.deepEqual(errors,[]);await p.close();console.log(width+' passed');
 }fs.writeFileSync(`tmp/ccac-mobile-proof/${label}.json`,JSON.stringify(proof,null,2));}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
