// Yamaha C5 samples: Alexander Holm, Salamander Grand Piano, CC BY 3.0.
const sampleNames=['C2','Ds2','Fs2','A2','C3','Ds3','Fs3','A3','C4','Ds4','Fs4','A4','C5','Ds5','Fs5','A5','C6','Ds6','Fs6','A6'];
const midiOf=name=>({C:0,Ds:3,Fs:6,A:9}[name.slice(0,-1)]+12*(Number(name.at(-1))+1));
let buffers=new Map(),loading;
export async function loadPiano(context){
  if(buffers.size===sampleNames.length)return;
  if(!loading)loading=Promise.all(sampleNames.map(async name=>{
    const response=await fetch(new URL('./samples/'+name+'.mp3',import.meta.url));
    if(!response.ok)throw Error('Piano sound could not load. Check your connection and press Play again.');
    return [midiOf(name),await context.decodeAudioData(await response.arrayBuffer())];
  })).then(entries=>{buffers=new Map(entries);}).catch(error=>{loading=null;throw error;});
  await loading;
}
export function pianoVoice(context,destination,midi,start,hold,velocity=.65){
  const root=[...buffers.keys()].sort((a,b)=>Math.abs(a-midi)-Math.abs(b-midi))[0];
  if(root===undefined)throw Error('Piano sound is not ready. Press Play again.');
  const source=context.createBufferSource(),gain=context.createGain();
  source.buffer=buffers.get(root);source.playbackRate.value=2**((midi-root)/12);
  const level=velocity*.58,release=Math.min(.6,Math.max(.18,hold*.25));
  gain.gain.setValueAtTime(level,start);gain.gain.setValueAtTime(level,start+hold);
  gain.gain.exponentialRampToValueAtTime(.0001,start+hold+release);
  source.connect(gain).connect(destination);source.start(start);source.stop(start+hold+release+.02);
  let ended=false;
  source.onended=()=>{ended=true;source.disconnect();gain.disconnect();};
  return ()=>{if(ended)return;const now=context.currentTime;gain.gain.cancelScheduledValues(now);gain.gain.setValueAtTime(0,now);try{source.stop(now+.025);}catch{}};
}
export const pianoSampleCount=()=>buffers.size;
