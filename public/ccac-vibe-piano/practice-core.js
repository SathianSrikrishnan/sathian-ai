// Standard MIDI format 0/1 -> seconds. Local-only, bounded parsing.
export function parseMidi(buffer,title='Imported MIDI'){
 if(buffer.byteLength>1024*1024)throw Error('Choose a MIDI file smaller than 1 MB.');
 const bytes=new Uint8Array(buffer),view=new DataView(buffer);let p=0,limit=bytes.length,events=0;
 const need=n=>{if(p+n>limit)throw Error('MIDI is truncated or has an invalid track length.');};
 const u8=()=>{need(1);return bytes[p++];},u16=()=>{need(2);const n=view.getUint16(p);p+=2;return n;},u32=()=>{need(4);const n=view.getUint32(p);p+=4;return n;};
 const text=n=>{need(n);const s=new TextDecoder().decode(bytes.subarray(p,p+n));p+=n;return s;};
 const vlq=()=>{let n=0;for(let i=0;i<4;i++){const b=u8();n=n*128+(b&127);if(!(b&128))return n;}throw Error('Invalid MIDI variable-length number.');};
 if(text(4)!=='MThd')throw Error('Choose a Standard MIDI (.mid) file.');
 const header=u32(),format=u16(),tracks=u16(),ppq=u16();
 if(header<6||format>1||!tracks||tracks>64||!ppq||(ppq&0x8000))throw Error('Use a format 0 or 1 MIDI with musical beat timing and at most 64 tracks.');
 need(header-6);p+=header-6;const raw=[],tempos=[{tick:0,us:500000}],warnings=[];
 for(let track=0;track<tracks;track++){
  limit=bytes.length;if(text(4)!=='MTrk')throw Error('MIDI track header missing.');const length=u32();need(length);limit=p+length;
  let tick=0,running=0;const active=new Map(),pedal=new Set(),sustained=new Map();
  const finish=(key,end)=>{const list=active.get(key);if(!list?.length)return;const n=list.shift();n.end=end;raw.push(n);if(!list.length)active.delete(key);};
  while(p<limit){
   if(++events>100000)throw Error('This MIDI has too many events for this practice prototype.');
   tick+=vlq();let status=u8();if(status<128){p--;status=running;}else if(status<240)running=status;
   if(status===255){running=0;const type=u8(),n=vlq();need(n);if(type===81&&n===3){const us=bytes[p]*65536+bytes[p+1]*256+bytes[p+2];if(!us)throw Error('Invalid MIDI tempo.');tempos.push({tick,us});}p+=n;continue;}
   if(status===240||status===247){running=0;const n=vlq();need(n);p+=n;continue;}
   if(status<128||status>=240)throw Error('Invalid MIDI event status.');
   const kind=status>>4,channel=status&15,a=u8(),b=(kind===12||kind===13)?0:u8();if(a>127||b>127)throw Error('Invalid MIDI note data.');
   if(channel===9)continue;const key=channel+':'+a;
   if(kind===9&&b){const list=active.get(key)||[];list.push({midi:a,tick,velocity:b/127,track});active.set(key,list);}
   if(kind===8||(kind===9&&!b)){
    if(pedal.has(channel)){const list=active.get(key);if(list?.length){const held=sustained.get(channel)||[];held.push(list.shift());sustained.set(channel,held);if(!list.length)active.delete(key);}}
    else finish(key,tick);
   }
   if(kind===11&&a===64){if(b>=64)pedal.add(channel);else{pedal.delete(channel);for(const n of sustained.get(channel)||[])raw.push({...n,end:tick});sustained.delete(channel);}}
  }
  for(const list of [...active.values(),...sustained.values()])for(const n of list){raw.push({...n,end:Math.max(tick,n.tick+ppq/4)});warnings.push('Some held notes ended at the track boundary.');}
 }
 if(!raw.length||raw.length>10000)throw Error('Choose a MIDI with 1–10,000 non-percussion notes.');
 tempos.sort((a,b)=>a.tick-b.tick);let elapsed=0,lastTick=0,lastUs=500000;
 for(const t of tempos){elapsed+=(t.tick-lastTick)*lastUs/ppq/1e6;t.seconds=elapsed;lastTick=t.tick;lastUs=t.us;}
 const seconds=tick=>{let lo=0,hi=tempos.length-1;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(tempos[mid].tick<=tick)lo=mid;else hi=mid-1;}const t=tempos[lo];return t.seconds+(tick-t.tick)*t.us/ppq/1e6;};
 const notes=raw.filter(n=>n.end>n.tick).map(n=>({midi:n.midi,start:seconds(n.tick),duration:seconds(n.end)-seconds(n.tick),velocity:n.velocity,track:n.track})).sort((a,b)=>a.start-b.start||a.midi-b.midi);
 if(notes.some(n=>n.midi<21||n.midi>108))throw Error('This MIDI has notes outside the piano range A0–C8. Transpose or edit those notes before importing.');
 const duration=Math.max(...notes.map(n=>n.start+n.duration));if(!Number.isFinite(duration)||duration>1200)throw Error('Choose a MIDI shorter than 20 minutes.');
 return {title:title.replace(/\.midi?$/i,''),notes,duration,warnings:[...new Set(warnings)]};
}
export function lessonNotes(notes,start,length,hand='both',split=60){
 return notes.filter(n=>n.start<start+length&&n.start+n.duration>start&&(hand==='both'||(hand==='upper'?n.midi>=split:n.midi<split))).map(n=>({...n,start:Math.max(0,n.start-start),duration:Math.min(start+length,n.start+n.duration)-Math.max(start,n.start)}));
}
export function makeGroups(notes){const groups=[];for(const n of [...notes].sort((a,b)=>a.start-b.start)){let g=groups.at(-1);if(!g||n.start-g.start>.035){g={start:n.start,notes:[]};groups.push(g);}g.notes.push(n);}return groups;}
export function encodeWav(samples,rate){
 const buffer=new ArrayBuffer(44+samples.length*2),v=new DataView(buffer);const text=(at,s)=>{for(let i=0;i<s.length;i++)v.setUint8(at+i,s.charCodeAt(i));};
 text(0,'RIFF');v.setUint32(4,36+samples.length*2,true);text(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,samples.length*2,true);
 samples.forEach((s,i)=>{const n=Number.isFinite(s)?Math.max(-1,Math.min(1,s)):0;v.setInt16(44+i*2,n<0?n*32768:n*32767,true);});return buffer;
}
