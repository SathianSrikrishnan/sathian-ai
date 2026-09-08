import {song as original,notes as originalNotes} from './music.js';
import {canonNotes,canonBeats} from './canon-score.js';
const canon={id:'canon',kind:'piano',title:'Canon in D',composer:'Johann Pachelbel',bpm:55,beats:canonBeats,key:'D MAJOR',badge:'GRAND PIANO',minMidi:36,maxMidi:88,notes:canonNotes,credit:'Complete four-voice score, rendered on grand piano.'};
const little={...original,id:'little-lanterns',kind:'piano',composer:'CCAC original',key:'C MAJOR',badge:'ORIGINAL',minMidi:48,maxMidi:72,notes:originalNotes,credit:'Our original melody, now on grand piano.'};
export const songs=[canon,{id:'river',kind:'video',title:'River Flows in You',composer:'Yiruma · performed by Kassia',videoId:'owl5oyzchKk'},little];
for(const s of songs)if(s.kind==='piano'){s.secondsPerBeat=60/s.bpm;s.duration=s.beats*s.secondsPerBeat;}
export const getSong=id=>songs.find(s=>s.id===id)||canon;
