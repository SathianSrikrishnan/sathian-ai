import { song, notes, secondsPerBeat, duration, noteName, makeTone } from './music.js';

const $ = id => document.getElementById(id);
const keyboard=$('keyboard'), roll=$('roll');
const whites=[], positions=new Map(), keys=new Map();
const shortcutMap={a:60,w:61,s:62,e:63,d:64,f:65,t:66,g:67,y:68,h:69,u:70,j:71,k:72};
let whiteIndex=0;
for(let midi=48;midi<=72;midi++) {
  const black=[1,3,6,8,10].includes(midi%12);
  const button=document.createElement('button');
  button.type='button';button.className=`piano-key ${black?'black':'white'}`;
  button.dataset.midi=midi;button.setAttribute('aria-label',`Play ${noteName(midi)}`);
  button.setAttribute('aria-pressed','false');
  const name=document.createElement('span');name.textContent=noteName(midi);button.append(name);
  const shortcut=Object.keys(shortcutMap).find(k=>shortcutMap[k]===midi);
  if(shortcut){const help=document.createElement('small');help.textContent=shortcut.toUpperCase();button.append(help);}
  const left=black ? (whiteIndex/15*100-2.075) : (whiteIndex/15*100);
  if(black)button.style.left=`${left}%`;
  else {whiteIndex++;whites.push(midi);}
  positions.set(midi,{left,width:black?4.15:100/15});keys.set(midi,button);keyboard.append(button);
}
whites.forEach(()=>{const lane=document.createElement('div');lane.className='lane';$('lanes').append(lane);});
const falling=notes.map(note=>{
  const element=document.createElement('div'),pos=positions.get(note.midi);
  element.className=`falling-note ${note.hand}`;
  element.style.left=`${pos.left+0.6}%`;element.style.width=`${pos.width-1.2}%`;
  element.textContent=noteName(note.midi);$('falling-notes').append(element);
  return {note,element};
});

let context,master,analyser,contextStart=0,position=0,speed=1,playing=false,busy=false,voices=[],lastVisibleNote;
const manual=new Map();
const audioError=$('audio-error');
const fmt=seconds=>`${Math.floor(seconds/60)}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;
$('duration').textContent=fmt(duration);$('seek').max=duration;

function audibleTime(){
  if(!context)return 0;
  const stamp=context.getOutputTimestamp?.();
  // Align display with the device's rendered output clock where supported.
  if(stamp?.performanceTime>0&&stamp.contextTime>0){
    return Math.min(context.currentTime,stamp.contextTime+Math.max(0,performance.now()-stamp.performanceTime)/1000);
  }
  return Math.max(0,context.currentTime-(context.outputLatency||context.baseLatency||0));
}
function currentPosition(){return playing?Math.min(duration,Math.max(position,(audibleTime()-contextStart)*speed)):position;}
async function ensureAudio(){
  if(!context){
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)throw new Error('This browser does not support Web Audio. Try a current browser.');
    context=new Audio({latencyHint:'interactive'});
    master=context.createGain();master.gain.value=Number($('volume').value)/100;
    analyser=context.createAnalyser();analyser.fftSize=2048;
    master.connect(analyser);analyser.connect(context.destination);
    context.onstatechange=()=>{if(playing&&context.state!=='running')pause('Audio interrupted · press play to continue');};
  }
  if(context.state!=='running')await context.resume();
  if(context.state!=='running')throw new Error('Sound could not start. Press play again to enable audio.');
  audioError.hidden=true;
}
function stopScheduled(){voices.forEach(stop=>stop());voices=[];}
function schedule(){
  contextStart=context.currentTime+0.09-position/speed;
  for(const note of notes){
    const start=note.beat*secondsPerBeat,end=(note.beat+note.length)*secondsPerBeat;
    if(end<=position)continue;
    const remaining=end-Math.max(position,start);
    voices.push(makeTone(context,master,note.midi,contextStart+Math.max(position,start)/speed,remaining/speed,note.hand==='melody'?0.7:0.35));
  }
}
function updateTransport(message){
  $('play').innerHTML=playing?'<span aria-hidden="true">Ⅱ</span> Pause':'<span aria-hidden="true">▶</span> '+(position>=duration?'Play again':position>0?'Resume':'Play demo');
  $('instrument').classList.toggle('is-playing',playing);
  $('transport-status').textContent=message||(playing?'Playing':position>=duration?'Finished':position>0?'Paused':'Ready');
  $('roll-caption').innerHTML=position>=duration?'Finished <span>♫</span>':playing?'':'Press play <span>↓</span>';
}
async function play(){
  if(busy||playing)return;
  busy=true;
  try{
    await ensureAudio();
    if(document.hidden)return;
    if(position>=duration)position=0;
    stopScheduled();schedule();playing=true;updateTransport();
  }catch(error){audioError.textContent=error.message;audioError.hidden=false;updateTransport('Sound needs attention');}
  finally{busy=false;}
}
function pause(message){
  if(playing)position=currentPosition();
  playing=false;stopScheduled();updateTransport(message);render();
}
function setPosition(next){
  const resume=playing;pause();position=Math.min(duration,Math.max(0,next));
  updateTransport();render();if(resume&&position<duration)void play();
}
$('play').addEventListener('click',()=>playing?pause():void play());
$('replay').addEventListener('click',()=>{pause();position=0;void play();});
$('seek').addEventListener('input',e=>setPosition(Number(e.target.value)));
$('speed').addEventListener('change',e=>{const resume=playing;pause();speed=Number(e.target.value);document.querySelector('.tempo-badge strong').textContent=Math.round(song.bpm*speed);if(resume)void play();});
$('volume').addEventListener('input',e=>{if(master)master.gain.setTargetAtTime(Number(e.target.value)/100,context.currentTime,0.02);});
$('labels').addEventListener('change',e=>$('instrument').classList.toggle('hide-labels',!e.target.checked));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function applyMotion(){ $('instrument').classList.toggle('hide-motion',!$('motion').checked); }
$('motion').checked=!reduced.matches;applyMotion();$('motion').addEventListener('change',applyMotion);
reduced.addEventListener('change',e=>{if(e.matches){$('motion').checked=false;applyMotion();}});

function render(){
  const now=currentPosition(),beat=now/secondsPerBeat,active=new Map();
  const visiblePiano=$('piano-scroll');
  $('roll-caption').style.left=`${visiblePiano.scrollLeft}px`;
  $('roll-caption').style.width=`${visiblePiano.clientWidth}px`;
  const outputStarted=playing&&audibleTime()>=contextStart+position/speed;
  if(outputStarted)for(const note of notes)if(beat>=note.beat&&beat<note.beat+note.length)active.set(note.midi,note.hand);
  for(const [midi] of manual)active.set(midi,'manual');
  for(const [midi,key] of keys){
    const hand=active.get(midi);if(hand)key.dataset.active=hand;else delete key.dataset.active;
    key.setAttribute('aria-pressed',String(Boolean(hand)));
  }
  // The same score time feeds the roll and the highlighted keys.
  const horizon=4;const pixelsPerSecond=roll.clientHeight/horizon;
  for(const {note,element} of falling){
    const start=note.beat*secondsPerBeat,end=(note.beat+note.length)*secondsPerBeat;
    const visible=end>=now&&start<=now+horizon;
    element.hidden=!visible;
    if(visible){
      element.style.height=`${Math.max(9,(end-start)*pixelsPerSecond)}px`;
      element.style.transform=`translateY(${(now-start)*pixelsPerSecond}px)`;
      element.classList.toggle('active',outputStarted&&start<=now&&end>now);
    }
  }
  const currentMelody=[...active].find(([,hand])=>hand==='melody')?.[0];
  if(playing&&currentMelody&&currentMelody!==lastVisibleNote){
    const scroller=$('piano-scroll'),key=keys.get(currentMelody);
    const left=key.offsetLeft,right=left+key.offsetWidth;
    if(left<scroller.scrollLeft||right>scroller.scrollLeft+scroller.clientWidth){scroller.scrollLeft=Math.max(0,left-scroller.clientWidth/2);}
    lastVisibleNote=currentMelody;
  }
  $('seek').value=now;$('seek').setAttribute('aria-valuetext',`${Math.floor(now)} of ${duration} seconds`);$('elapsed').textContent=fmt(now);
  if(playing&&now>=duration){position=duration;playing=false;stopScheduled();updateTransport();}
}
function frame(){render();requestAnimationFrame(frame);}requestAnimationFrame(frame);

async function manualDown(midi){
  const existing=manual.get(midi);
  if(existing&&!existing.releaseTimer)return;
  if(existing){clearTimeout(existing.releaseTimer);existing.stop?.();manual.delete(midi);}
  const token={stop:null,started:performance.now(),releaseTimer:null,released:false};manual.set(midi,token);render();
  try{
    await ensureAudio();if(manual.get(midi)!==token)return;
    token.started=performance.now();
    token.stop=makeTone(context,master,midi,context.currentTime+0.006,1.8,0.65);
    if(token.released)manualUp(midi);
  }
  catch(error){manual.delete(midi);audioError.textContent=error.message;audioError.hidden=false;}
}
function manualUp(midi,immediate=false){
  const token=manual.get(midi);if(!token)return;
  if(!token.stop&&!immediate){token.released=true;return;}
  const remaining=160-(performance.now()-token.started);
  // A quick tap should ring briefly, rather than becoming an inaudible click.
  if(!immediate&&remaining>0){
    if(!token.releaseTimer)token.releaseTimer=setTimeout(()=>manualUp(midi,true),remaining);
    return;
  }
  clearTimeout(token.releaseTimer);token.stop?.();manual.delete(midi);render();
}
function clearManual(){for(const midi of manual.keys())manualUp(midi,true);}
for(const [midi,key] of keys){
  key.addEventListener('pointerdown',event=>{event.preventDefault();key.focus({preventScroll:true});key.setPointerCapture(event.pointerId);void manualDown(midi);});
  key.addEventListener('pointerup',()=>manualUp(midi));key.addEventListener('pointercancel',()=>manualUp(midi));key.addEventListener('lostpointercapture',()=>manualUp(midi));
  key.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();if(!event.repeat)void manualDown(midi);}});
  key.addEventListener('keyup',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();manualUp(midi);}});
  // Assistive technology may activate via click without a pointer/keydown event.
  key.addEventListener('click',event=>{if(event.detail===0&&!manual.has(midi)){void manualDown(midi);setTimeout(()=>manualUp(midi),400);}});
}
document.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.target.matches('input,select,textarea,[contenteditable]'))return;
  const midi=shortcutMap[event.key.toLowerCase()];
  if(midi){event.preventDefault();if(!event.repeat)void manualDown(midi);}
});
document.addEventListener('keyup',event=>{const midi=shortcutMap[event.key.toLowerCase()];if(midi)manualUp(midi);});
window.addEventListener('blur',clearManual);
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearManual();if(playing)pause('Paused while away · resume when ready');}});

// Read-only diagnostics for repeatable local browser verification; no user data.
window.pianoDiagnostics=()=>{
  let rms=0,peak=0;
  if(analyser){const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);for(const value of samples){rms+=value*value;peak=Math.max(peak,Math.abs(value));}rms=Math.sqrt(rms/samples.length);}
  return {songId:song.id,playing,position:currentPosition(),duration,speed,audioState:context?.state??'not-started',rms,peak,scheduledVoices:voices.length,manualNotes:[...manual.keys()],activeKeys:[...keys].filter(([,key])=>key.dataset.active).map(([midi,key])=>({midi,hand:key.dataset.active})),outputLatency:context?.outputLatency??null};
};
