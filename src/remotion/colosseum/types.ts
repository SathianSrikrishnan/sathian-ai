export type ColosseumVideoKind = 'pitch' | 'technical';

export type ColosseumAssetSlot = {
  id: string;
  label: string;
  kind:
    | 'avatar'
    | 'screen-recording'
    | 'screenshot'
    | 'proof'
    | 'diagram'
    | 'audio';
  status: 'needed' | 'queued' | 'captured' | 'approved';
  path?: string;
  notes: string;
};

export type ColosseumScene = {
  id: string;
  title: string;
  durationSeconds: number;
  speaker: 'tanda' | 'sathian' | 'narrator';
  approval: 'outline' | 'needs-assets' | 'draft-ready' | 'approved';
  objective: string;
  narration: string;
  visualPlan: string;
  captureDirection: string;
  productionNotes: string[];
  slots: ColosseumAssetSlot[];
};

export type ColosseumStoryboard = {
  kind: ColosseumVideoKind;
  title: string;
  subtitle: string;
  targetSeconds: number;
  scenes: ColosseumScene[];
};

