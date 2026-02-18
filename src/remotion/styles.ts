// Tooth Fairy Network V3.1 — Design System Constants
// Matches sathian.ai cosmic palette

export const COLORS = {
  bg: '#050510',
  nebula: '#7C3AED',
  aurora: '#06B6D4',
  stardust: '#F59E0B',
  plasma: '#EC4899',
  white: '#FFFFFF',
  dimWhite: 'rgba(255,255,255,0.6)',
  toothGlow: '#FCD34D',
  nodeGlow: 'rgba(6,182,212,0.6)',
  purpleGlow: 'rgba(124,58,237,0.5)',
  amberGlow: 'rgba(245,158,11,0.5)',
  cryptoGreen: '#10B981',
  verified: '#22C55E',
} as const;

export const FPS = 30;

// V3.1 Scene durations in frames (11 scenes — Scene 01 cut, open with fairy flying in)
export const SCENE_V3 = {
  // Veo video clips (all 5s)
  s01_fairyEnters: 150,      // 5s — NEW OPENING
  s02_fairyLifts: 150,       // 5s
  s03_fairyAscends: 150,     // 5s
  s04_fairyStation: 150,     // 5s — transformation
  s05_processing: 150,       // 5s
  s06_blockchainCode: 180,   // 6s — code + VERIFIED stamp
  s07_twoStreams: 150,       // 5s

  // Still scenes (extended for emotional breathing room)
  s08_parentNFT: 210,        // 7s — father holds keepsake
  s09_childAsset: 210,       // 7s — child in second home
  s10_finale: 240,           // 8s — let image breathe, no text
  s11_titleCard: 180,        // 6s — branding

  transition: 15,            // 0.5s fade between scenes
} as const;

// Total: sum of all scenes minus 10 transitions (11 scenes = 10 transitions)
export const TOTAL_FRAMES_V3 =
  SCENE_V3.s01_fairyEnters +
  SCENE_V3.s02_fairyLifts +
  SCENE_V3.s03_fairyAscends +
  SCENE_V3.s04_fairyStation +
  SCENE_V3.s05_processing +
  SCENE_V3.s06_blockchainCode +
  SCENE_V3.s07_twoStreams +
  SCENE_V3.s08_parentNFT +
  SCENE_V3.s09_childAsset +
  SCENE_V3.s10_finale +
  SCENE_V3.s11_titleCard -
  10 * SCENE_V3.transition; // 1920 - 150 = 1770 frames (59s)

export const SCENE = SCENE_V3;
export const TOTAL_FRAMES = TOTAL_FRAMES_V3;

// Deterministic "random" for positions (no Math.random — SSR safe)
export function seededPosition(seed: number): { x: number; y: number } {
  const x = ((seed * 9301 + 49297) % 233280) / 233280;
  const y = ((seed * 1103 + 27077) % 111953) / 111953;
  return { x: x * 100, y: y * 100 };
}

export function seededValue(seed: number, min: number, max: number): number {
  const v = ((seed * 9301 + 49297) % 233280) / 233280;
  return min + v * (max - min);
}
