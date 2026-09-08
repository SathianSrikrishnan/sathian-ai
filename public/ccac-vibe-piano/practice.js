import {getSong} from './songs.js?v=20260908-1';
import {noteName} from './music.js';
import {loadPiano,pianoVoice} from './piano-audio.js';
import {parseMidi,lessonNotes,makeGroups,encodeWav} from './practice-core.js';
const $=id=>document.getElementById(id),canvas=$('roll'),ctx=canvas.getContext('2d'),audio=new Audio();
audio.preload='auto';audio.preservesPitch=true;
let source,notes=[],groups=[],groupIndex=0,hits=new Set(),mode='idle',position=0,version=0,renderedVersion=-1,objectUrl,preparing=false,streak=0,positions=new Map(),keys=new Map(),minMidi=48,maxMidi=72,renderedPeak=0;
const shortcuts={a:60,w:61,s:62,e:63,d:64,f:65,t:66,g:67,y:68,h:69,u:70,j:71,k:72};
const black=m=>[1,3,6,8,10].includes(m%12);
const status=text=>$('status').textContent=text;
const fail=error=>{$('error').textContent=error.message||String(error);$('error').hidden=false;};
function pauseVideo(){const frame=$('video').querySelector('iframe');frame?.contentWindow.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}),'https://www.youtube-nocookie.com');}
$('load-video').addEventListener('click',()=>{
 stop();const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/owl5oyzchKk?playsinline=1&rel=0&autoplay=1&enablejsapi=1&origin='+encodeURIComponent(location.origin);frame.title='River Flows in You — performance by Kassia';frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;$('video').replaceChildren(frame);
});
function builtIn(id){const s=getSong(id);return {title:s.title,duration:s.duration,notes:s.notes.map(n=>({midi:n.midi,start:n.beat*s.secondsPerBeat,duration:n.length*s.secondsPerBeat,velocity:n.velocity??.65})),warnings:[],builtin:true};}
function stop(){audio.pause();mode='idle';$('listen').textContent='▶ Listen';}
function buildKeyboard(){
 const pitches=notes.map(n=>n.midi);minMidi=Math.max(21,Math.floor((Math.min(...pitches,60)-3)/12)*12);maxMidi=Math.min(108,Math.ceil((Math.max(...pitches,72)+1)/12)*12);if(maxMidi-minMidi<24)maxMidi=Math.min(108,minMidi+24);
 const whiteCount=Array.from({length:maxMidi-minMidi+1},(_,i)=>minMidi+i).filter(m=>!black(m)).length,width=whiteCount*36;
 $('piano-world').style.width=Math.max(width,$('piano-scroll').clientWidth)+'px';$('keyboard').replaceChildren();positions=new Map();keys=new Map();let white=0;
 for(let midi=minMidi;midi<=maxMidi;midi++){
  const isBlack=black(midi),w=100/whiteCount,left=(white-(isBlack?.31:0))*w,key=document.createElement('button');
  key.type='button';key.className='key'+(isBlack?' black':'');key.dataset.midi=midi;key.style.width=(isBlack?w*.62:w)+'%';if(isBlack)key.style.left=left+'%';else white++;
  key.setAttribute('aria-label','Play '+noteName(midi));key.setAttribute('aria-pressed','false');key.textContent=noteName(midi);const shortcut=Object.keys(shortcuts).find(k=>shortcuts[k]===midi);if(shortcut){const small=document.createElement('small');small.textContent=shortcut.toUpperCase();key.append(small);}
  key.addEventListener('click',()=>press(midi));$('keyboard').append(key);positions.set(midi,{left,width:isBlack?w*.62:w});keys.set(midi,key);
 }
}
function rebuild(){
 stop();version++;renderedVersion=-1;position=0;groupIndex=0;hits.clear();streak=0;$('error').hidden=true;
 const start=Math.max(0,Math.min(Number($('phrase-start').value)||0,Math.max(0,source.duration-.1)));$('phrase-start').value=String(Math.round(start*10)/10);$('phrase-start').max=String(Math.ceil(source.duration));
 notes=lessonNotes(source.notes,start,Number($('phrase-length').value),$('hand').value,Number($('split').value));groups=makeGroups(notes);
 buildKeyboard();status(notes.length?'Choose Listen or Follow the notes.':'No notes here. Choose another phrase or Both parts.');$('progress').textContent=`0 / ${groups.length}`;$('listen').disabled=!notes.length;$('follow').disabled=!notes.length;draw();
}
function setSource(s){source=s;$('exercise-title').textContent=s.title;$('source-status').textContent=s.builtin?(s.title==='Little Lanterns'?'Original CCAC practice demo':'Pachelbel · complete Canon score'):`Local MIDI · ${s.notes.length.toLocaleString()} notes · ${Math.ceil(s.duration)} seconds`;$('phrase-start').value='0';rebuild();if(s.warnings.length)status(s.warnings.join(' '));}
for(const id of ['phrase-start','phrase-length','hand','split'])$(id).addEventListener('change',rebuild);
$('exercise').addEventListener('change',()=>{if($('exercise').value!=='imported')setSource(builtIn($('exercise').value));});
$('midi-file').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{if(file.size>1024*1024)throw Error('Choose a MIDI smaller than 1 MB.');const imported=parseMidi(await file.arrayBuffer(),file.name);let option=$('exercise').querySelector('[value="imported"]');if(!option){option=document.createElement('option');option.value='imported';$('exercise').append(option);}option.textContent=imported.title+' · your MIDI';$('exercise').value='imported';setSource(imported);}catch(error){fail(error);}finally{e.target.value='';}
});
async function prepareAudio(){
 if(renderedVersion===version)return;
 const ownVersion=version,Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!Offline)throw Error('This browser cannot prepare a piano exercise. Try a current Chrome, Edge or Safari browser.');
 const duration=Math.max(...notes.map(n=>n.start+n.duration))+.7,rate=22050,offline=new Offline(1,Math.ceil(duration*rate),rate);
 status('Preparing your piano phrase…');await loadPiano(offline);if(ownVersion!==version)return false;
 for(const n of notes)pianoVoice(offline,offline.destination,n.midi,n.start,n.duration,(n.velocity??.65)*.65);
 const rendered=await offline.startRendering();if(ownVersion!==version)return false;const samples=rendered.getChannelData(0);let peak=0;for(const s of samples)peak=Math.max(peak,Math.abs(s));renderedPeak=peak;const gain=peak?.85/peak:1;for(let i=0;i<samples.length;i++)samples[i]*=gain;
 if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(new Blob([encodeWav(samples,rate)],{type:'audio/wav'}));audio.src=objectUrl;renderedVersion=ownVersion;return true;
}
$('listen').addEventListener('click',async()=>{
 if(mode==='listen'){position=audio.currentTime;stop();status('Paused. Listen starts the phrase again.');return;}
 if(preparing||!notes.length)return;stop();preparing=true;const ownVersion=version;$('listen').disabled=true;$('follow').disabled=true;$('error').hidden=true;
 try{pauseVideo();if(await prepareAudio()===false)return;if(ownVersion!==version)return;audio.currentTime=0;audio.playbackRate=Number($('speed').value);audio.volume=Number($('volume').value)/100;audio.muted=false;await audio.play();if(ownVersion!==version){audio.pause();return;}mode='listen';$('listen').textContent='Ⅱ Pause';status('Listen to the phrase.');}catch(error){stop();fail(error);status('Audio needs attention.');}finally{preparing=false;$('listen').disabled=!notes.length;$('follow').disabled=!notes.length;}
});
audio.addEventListener('ended',()=>{if(mode!=='listen')return;if($('loop').checked){audio.currentTime=0;audio.play().catch(fail);}else{stop();status('Phrase complete. Try Follow the notes.');}});
$('speed').addEventListener('change',()=>{audio.playbackRate=Number($('speed').value);});$('volume').addEventListener('input',()=>{audio.volume=Number($('volume').value)/100;});
function follow(){stop();if(!groups.length)return;pauseVideo();mode='follow';groupIndex=0;streak=0;hits.clear();showTarget();}
function showTarget(){
 const group=groups[groupIndex];if(!group){mode='complete';status('Phrase complete! You found every note.');$('progress').textContent=`${groups.length} / ${groups.length}`;draw();return;}
 position=Math.max(0,group.start);status('Find '+[...new Set(group.notes.map(n=>noteName(n.midi)))].join(' + '));$('progress').textContent=`${groupIndex} / ${groups.length}`;
 const p=positions.get(group.notes[0].midi),world=$('piano-world').clientWidth,scroller=$('piano-scroll'),left=p.left/100*world;if(left<scroller.scrollLeft||left>scroller.scrollLeft+scroller.clientWidth-40)scroller.scrollLeft=Math.max(0,left-scroller.clientWidth/2);draw();
}
function soundKey(midi){
 const roots=[36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93],root=roots.sort((a,b)=>Math.abs(a-midi)-Math.abs(b-midi))[0],name=({0:'C',3:'Ds',6:'Fs',9:'A'}[root%12])+(Math.floor(root/12)-1);
 const note=new Audio(new URL('./samples/'+name+'.mp3',import.meta.url));note.preservesPitch=false;note.playbackRate=2**((midi-root)/12);note.volume=.5*Number($('volume').value)/100;note.play().catch(fail);setTimeout(()=>{note.pause();note.removeAttribute('src');note.load();},900);
}
function press(midi){
 soundKey(midi);if(mode!=='follow')return;
 const expected=new Set(groups[groupIndex].notes.map(n=>n.midi));
 if(!expected.has(midi)){status('Try a glowing key — take your time.');keys.get(midi)?.classList.add('wrong');setTimeout(()=>keys.get(midi)?.classList.remove('wrong'),250);return;}
 hits.add(midi);if([...expected].every(n=>hits.has(n))){groupIndex++;streak++;hits.clear();showTarget();}else{status('Good. Find '+[...expected].filter(n=>!hits.has(n)).map(noteName).join(' + '));draw();}
}
$('follow').addEventListener('click',follow);$('reset').addEventListener('click',()=>{if(mode==='follow'||mode==='complete')follow();else{stop();position=0;status('Ready to listen again.');draw();}});
for(const [id,direction] of [['previous',-1],['next',1]])$(id).addEventListener('click',()=>{$('phrase-start').value=String(Math.max(0,Number($('phrase-start').value)+direction*Number($('phrase-length').value)));rebuild();});
document.addEventListener('keydown',event=>{if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target.matches('input,select,textarea'))return;const midi=shortcuts[event.key.toLowerCase()];if(midi!==undefined&&keys.has(midi)){event.preventDefault();press(midi);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();status('Paused while away.');}});
function draw(){
 const width=$('piano-world').clientWidth,height=canvas.clientHeight;if(canvas.width!==width)canvas.width=width;if(canvas.height!==height)canvas.height=height;
 ctx.fillStyle='#243d39';ctx.fillRect(0,0,width,height);for(const [midi,p] of positions)if(!black(midi)){ctx.strokeStyle='#3b5149';ctx.beginPath();ctx.moveTo(p.left/100*width,0);ctx.lineTo(p.left/100*width,height);ctx.stroke();}
 const active=new Set(mode==='follow'?groups[groupIndex]?.notes.map(n=>n.midi):mode==='listen'?notes.filter(n=>n.start<=position&&n.start+n.duration>position).map(n=>n.midi):[]);
 const px=height/4;for(const n of notes){if(n.start>position+4||n.start+n.duration<position)continue;const p=positions.get(n.midi),y=height-(n.start-position)*px,h=Math.max(10,Math.min(height,n.duration*px));ctx.fillStyle=n.midi>=Number($('split').value)?'#ff9477':'#89c6af';ctx.fillRect(p.left/100*width+2,y-h,p.width/100*width-4,h-2);if(h>19){ctx.fillStyle='#243d39';ctx.font='10px system-ui';ctx.fillText(noteName(n.midi),p.left/100*width+4,y-6);}}
 for(const [midi,key] of keys){key.classList.toggle('target',active.has(midi));key.classList.toggle('hit',hits.has(midi));key.setAttribute('aria-pressed',String(active.has(midi)));}
}
function frame(){if(mode==='listen'){position=audio.currentTime;draw();}requestAnimationFrame(frame);}requestAnimationFrame(frame);new ResizeObserver(()=>{buildKeyboard();draw();}).observe($('piano-scroll'));
window.practiceDiagnostics=()=>({title:source.title,mode,position,notes:notes.length,groups:groups.length,groupIndex,expected:mode==='follow'?groups[groupIndex]?.notes.map(n=>n.midi)||[]:[],media:{paused:audio.paused,muted:audio.muted,readyState:audio.readyState,volume:audio.volume,rate:audio.playbackRate,renderedPeak},localImport:!source.builtin});
setSource(builtIn('little-lanterns'));
