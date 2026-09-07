// Original demo sequence generated for this prototype. Not Yiruma's composition.
// MIDI numbers are pitches, not an imported MIDI asset. 16 bars, 4/4 at 96 BPM.
export const song = { id: 'little-lanterns-original-demo', title: 'Little Lanterns', bpm: 96, beats: 64, provenance: 'Original generated demo; no source score, MIDI or audio imported.' };
const phrases = [
  [[64,0,1],[67,1,0.5],[69,1.5,0.5],[67,2,1],[62,3,1]],
  [[60,0,1.5],[64,1.5,0.5],[62,2,1],[60,3,0.8]],
  [[65,0,1],[69,1,0.5],[72,1.5,0.5],[69,2,1],[67,3,1]],
  [[64,0,1.5],[62,1.5,0.5],[60,2,1.8]],
  [[64,0,0.5],[67,0.5,0.5],[72,1,1],[71,2,1],[67,3,1]],
  [[69,0,1],[65,1,1],[64,2,0.5],[62,2.5,0.5],[60,3,1]],
  [[62,0,1],[67,1,1],[69,2,0.5],[67,2.5,0.5],[65,3,1]],
  [[64,0,2],[60,2,1.7]],
  [[67,0,1],[64,1,0.5],[69,1.5,0.5],[72,2,1],[67,3,1]],
  [[64,0,1.5],[62,1.5,0.5],[60,2,1],[62,3,1]],
  [[65,0,1],[69,1,1],[67,2,0.5],[65,2.5,0.5],[64,3,1]],
  [[62,0,1.5],[64,1.5,0.5],[60,2,1.8]],
  [[69,0,1],[72,1,1],[71,2,0.5],[69,2.5,0.5],[67,3,1]],
  [[65,0,1],[64,1,1],[62,2,1],[67,3,1]],
  [[64,0,1.5],[62,1.5,0.5],[60,2,1],[64,3,1]],
  [[60,0,3.4]],
];
const bass = [[48,55],[45+12,52],[53,60],[48,55],[48,55],[53,57],[55,59],[48,55],[48,55],[57,52],[53,57],[48,55],[57,52],[55,59],[48,55],[48,55]];
export const notes = phrases.flatMap((bar, index) => [
  ...bar.map(([midi, beat, length]) => ({midi, beat:index*4+beat, length:length*0.9, hand:'melody'})),
  ...bass[index].map((midi, j) => ({midi,beat:index*4+j*2,length:1.7,hand:'harmony'})),
]).sort((a,b)=>a.beat-b.beat);
export const secondsPerBeat = 60/song.bpm;
export const duration = song.beats * secondsPerBeat;
export const noteName = midi => ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][midi%12]+(Math.floor(midi/12)-1);
export const frequency = midi => 440*2**((midi-69)/12);

// Short additive, decaying piano-like tone. No recordings or remote samples.
export function makeTone(context, destination, midi, start, hold, velocity=0.5) {
  const envelope=context.createGain();
  envelope.gain.setValueAtTime(0,start);
  envelope.gain.linearRampToValueAtTime(velocity*0.3,start+0.009);
  envelope.gain.exponentialRampToValueAtTime(velocity*0.13,start+Math.min(0.15,hold*0.6));
  envelope.gain.exponentialRampToValueAtTime(0.0001,start+hold+0.16);
  envelope.connect(destination);
  const partials=[1,2,3,4].map((multiple,index)=>{
    const oscillator=context.createOscillator();
    const partialGain=context.createGain();
    oscillator.type='sine';
    oscillator.frequency.value=frequency(midi)*multiple;
    partialGain.gain.value=[1,0.24,0.10,0.035][index];
    oscillator.connect(partialGain).connect(envelope);
    oscillator.start(start);
    oscillator.stop(start+hold+0.18);
    oscillator.onended=()=>{oscillator.disconnect();partialGain.disconnect();};
    return oscillator;
  });
  partials[0].addEventListener('ended',()=>envelope.disconnect());
  return () => {
    const now=context.currentTime;
    envelope.gain.cancelScheduledValues(now);
    envelope.gain.setTargetAtTime(0,now,0.006);
    partials.forEach(oscillator=>{try{oscillator.stop(now+0.025);}catch{}});
  };
}
