'use client';

import { useEffect, useRef, useState } from 'react';
import { C } from './tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChainOfTeethProps {
  onDepositClick?: () => void;
  onStoriesClick?: () => void;
}

interface Star {
  x: number; y: number; r: number; alpha: number;
  twinkle: boolean; twinkleSpeed: number; twinkleOffset: number;
  drift: number; depth: number; glow: boolean;
}

interface Card {
  baseX: number; baseY: number;
  x: number; y: number;
  w: number; h: number;
  scale: number; alphaMax: number; alpha: number; depthT: number;
  row: number; col: number; index: number;
  artCanvas: HTMLCanvasElement;
  name: string; title: string; detail: string; date: string;
  cardType: string; borderColor: string;
  tilt: number; bobSpeed: number; bobAmp: number; bobOffset: number;
  swaySpeed: number; swayAmp: number; swayOffset: number;
  parallaxMult: number; flashAlpha: number;
}

interface Thread {
  from: Card; to: Card;
  alpha: number;
  pulses: Pulse[];
}

interface Pulse {
  pos: number; speed: number; brightness: number;
}

interface EmptySlot {
  x: number; y: number; w: number; h: number; scale: number; row: number; col: number;
}

interface Spark {
  x: number; y: number; vx: number; vy: number;
  life: number; decay: number; size: number;
}

interface Sparkle {
  x: number; y: number; alpha: number; size: number; color: string;
}

interface Fairy {
  active: boolean;
  phase: 'idle' | 'flyUp' | 'place' | 'flyDown';
  x: number; y: number;
  targetSlot: EmptySlot | null;
  progress: number;
  wingAngle: number;
  sparkles: Sparkle[];
  pauseTimer: number;
  startX: number; startY: number;
  index: number;
  _restartAt: number;
  carryingCard: boolean;
  hasCoin: boolean;
}

interface Camera {
  x: number; y: number; zoom: number;
  focusCardIndex: number;
  emptySlotX: number; emptySlotY: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Luna','Max','Aria','Leo','Mia','Finn','Ivy','Noah','Zoe','Eli',
  'Lily','Owen','Ruby','Jack','Nora','Sam','Ella','Ben','Isla','Liam',
  'Sophie','Cole','Maya','Theo','Ava','Kai','Rosie','Gus','Clara','Jude',
  'Olive','Felix','Wren','Miles','Iris','Hugo','Poppy','Ezra','Cora','Remi',
  'Pearl','Otto','Sage','Kit','Vera','Nash','Faye','Dean','Nell','Beau',
  'Hazel','Dash','Opal','Rex','Belle','Cruz','Alma','Hank','Eve','Briar',
  'Gemma','Ace','Flora','Reid','June','Bear','Hope','Tate','Dawn','West',
  'Alice','Rhys','Mabel','Pax','Esme','Lane','Thea','Cade','Lux','Rowan',
  'Penny','Silas','Mae','Jett','Stella','Brooks','Daisy','Soren','Maren','Cy'
];
const LAST_INITIALS = 'ABCDEFGHJKLMNPRSTW';

const KEEPSAKE_TITLES = [
  "First Lost Tooth", "Brave Little Tooth", "Wiggly Tooth Day", "Tooth #3",
  "The Big One", "Baby Tooth Goodbye", "Birthday Tooth", "School Day Tooth",
  "Sleepover Tooth", "Holiday Tooth", "Brave Day", "Morning Surprise",
  "Tooth #5", "The Wobbler", "Under the Pillow", "Big Kid Tooth",
  "Recess Tooth", "Pizza Night Tooth", "Bedtime Surprise", "Camping Tooth"
];

const KEEPSAKE_DETAILS = [
  "Mom's Note", "Dad's Gift — $25", "Grandma — $10", "Uncle James — $50",
  "Auntie Kim — $20", "Grandpa — $15", "Family Gift", "Tooth Fairy Magic",
  "Birthday Bonus — $30", "Love from Mom & Dad", "Nana's Surprise — $20",
  "Dad's Promise", "Grandma's Gift — $10", "Uncle John — $50",
  "Mom & Dad — $15", "Tooth Fairy Reward", "Special Delivery — $25",
  "Grammy — $20", "Pop-Pop — $10", "Family Love — $35"
];

const WARM_PALETTES = [
  ['#FF8C42','#FFD166','#EF476F','#06D6A0'],
  ['#F4845F','#F7B267','#7EC8E3','#D4A5A5'],
  ['#E8A87C','#D8E2DC','#85CDCA','#C38D9E'],
  ['#FFB7B2','#FFDAC1','#B5EAD7','#C7CEEA'],
  ['#F67280','#C06C84','#6C5B7B','#355C7D'],
  ['#FDCB6E','#E17055','#00B894','#0984E3'],
  ['#FF6B6B','#FEC89A','#95D5B2','#8ECAE6'],
  ['#FFB5A7','#FCD5CE','#D8E2DC','#CCD5AE'],
];

const SKIN_COLORS = ['#FFDAB9','#F5D0C5','#DEB887','#FFE4C4','#FFCBA4','#D2A679','#C68E5B','#8D5524','#A0522D'];
const HAIR_COLORS = ['#4A3728','#8B6B4A','#2C1810','#D4A574','#1A1A2E','#C0392B','#E67E22','#2E1A0E'];

const FAIRY_STYLES = [
  { hair: '#D4A574', dress1: '#2AB5A0', dress2: '#5adace', glowColor: 'rgba(240,196,86,0.6)', glowR: 'rgba(240,196,86,0)' },
  { hair: '#A0522D', dress1: '#9B7FBF', dress2: '#C4A8E0', glowColor: 'rgba(90,218,206,0.6)', glowR: 'rgba(90,218,206,0)' },
  { hair: '#1A1A2E', dress1: '#7ECDA0', dress2: '#B5EAD7', glowColor: 'rgba(240,196,86,0.5)', glowR: 'rgba(240,196,86,0)' }
];

const DEPTH_ROWS = 18;
const CARD_BASE_W = 80;
const CARD_BASE_H = 108;
const FAIRY_COUNT = 3;
const STAR_COUNT = 650;

const TIMELINE = {
  holdEnd: 0.5,
  fairyEnter: 0.5,
  fairyArrive: 2.0,
  mintEnd: 3.5,
  pauseEnd: 4.0,
  zoomStart: 4.0,
  zoomEnd: 10.0,
  titleFade: 10.0,
  ctaFade: 11.0
};

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function rand(a: number, b: number) { return a + Math.random() * (b - a); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function hashIdx(i: number) { return ((i * 2654435761) >>> 0) / 4294967296; }
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

function childName(i: number) {
  const fn = FIRST_NAMES[Math.floor(hashIdx(i + 500) * FIRST_NAMES.length)];
  const li = LAST_INITIALS[Math.floor(hashIdx(i + 800) * LAST_INITIALS.length)];
  return fn + ' ' + li + '.';
}
function keepsakeTitle(i: number) {
  return KEEPSAKE_TITLES[Math.floor(hashIdx(i + 1200) * KEEPSAKE_TITLES.length)];
}
function keepsakeDetail(i: number) {
  return KEEPSAKE_DETAILS[Math.floor(hashIdx(i + 1500) * KEEPSAKE_DETAILS.length)];
}
function childDate(i: number) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = months[Math.floor(hashIdx(i + 300) * 12)];
  const y = hashIdx(i + 400) < 0.3 ? '2024' : (hashIdx(i + 400) < 0.7 ? '2025' : '2026');
  return m + ' ' + y;
}
function getCardType(index: number) {
  const r = hashIdx(index + 999);
  if (r < 0.30) return 'portrait';
  if (r < 0.50) return 'tooth';
  if (r < 0.70) return 'artwork';
  if (r < 0.90) return 'note';
  return 'photo';
}

// ─── Card art generation ──────────────────────────────────────────────────────

function drawMiniStar(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  c.fillStyle = color;
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.4;
    c.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
  }
  c.closePath();
  c.fill();
}

function generateCardArt(index: number, artW: number, artH: number): HTMLCanvasElement {
  const offscreen = document.createElement('canvas');
  offscreen.width = artW;
  offscreen.height = artH;
  const c = offscreen.getContext('2d')!;

  const palette = WARM_PALETTES[Math.floor(hashIdx(index + 100) * WARM_PALETTES.length)];
  const type = getCardType(index);

  c.fillStyle = '#FFF8F0';
  c.fillRect(0, 0, artW, artH);

  let seed = index * 7919;
  function srand() { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; }

  switch (type) {
    case 'portrait': {
      c.fillStyle = palette[Math.floor(srand() * palette.length)] + '25';
      c.fillRect(0, 0, artW, artH);
      const headR = artW * 0.22;
      const headX = artW * 0.5 + (srand() - 0.5) * artW * 0.08;
      const headY = artH * 0.45;
      const skinCol = SKIN_COLORS[Math.floor(srand() * SKIN_COLORS.length)];
      c.fillStyle = palette[Math.floor(srand() * palette.length)] + '60';
      c.beginPath();
      c.ellipse(headX, headY + headR * 1.8, headR * 1.2, headR * 0.8, 0, Math.PI, 0);
      c.fill();
      c.fillStyle = skinCol;
      c.beginPath();
      c.arc(headX, headY, headR, 0, Math.PI * 2);
      c.fill();
      const eyeSpacing = headR * 0.35;
      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.ellipse(headX - eyeSpacing, headY - headR * 0.1, headR * 0.12, headR * 0.09, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.ellipse(headX + eyeSpacing, headY - headR * 0.1, headR * 0.12, headR * 0.09, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#4A3728';
      c.beginPath();
      c.arc(headX - eyeSpacing, headY - headR * 0.1, headR * 0.07, 0, Math.PI * 2);
      c.arc(headX + eyeSpacing, headY - headR * 0.1, headR * 0.07, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#C0392B';
      c.lineWidth = headR * 0.06;
      c.lineCap = 'round';
      c.beginPath();
      c.arc(headX, headY + headR * 0.05, headR * 0.3, 0.15 * Math.PI, 0.85 * Math.PI);
      c.stroke();
      c.fillStyle = '#FFB6C180';
      c.beginPath();
      c.arc(headX - eyeSpacing * 1.3, headY + headR * 0.15, headR * 0.12, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(headX + eyeSpacing * 1.3, headY + headR * 0.15, headR * 0.12, 0, Math.PI * 2);
      c.fill();
      const hairCol = HAIR_COLORS[Math.floor(srand() * HAIR_COLORS.length)];
      const hairStyle = Math.floor(srand() * 3);
      c.fillStyle = hairCol;
      if (hairStyle === 0) {
        c.strokeStyle = hairCol + 'C0';
        c.lineWidth = headR * 0.12;
        for (let h = 0; h < 7; h++) {
          const hx = headX + (h - 3) * headR * 0.2;
          c.beginPath();
          c.moveTo(hx, headY - headR * 0.7);
          c.quadraticCurveTo(hx + (srand()-0.5)*headR*0.3, headY - headR * 1.2, hx + (srand()-0.5)*headR*0.4, headY - headR * 0.95);
          c.stroke();
        }
      } else if (hairStyle === 1) {
        c.beginPath();
        c.arc(headX, headY - headR * 0.15, headR * 1.05, -Math.PI * 0.9, -Math.PI * 0.1);
        c.fill();
        c.beginPath();
        c.moveTo(headX - headR * 1.0, headY);
        c.quadraticCurveTo(headX - headR * 1.1, headY + headR * 1.2, headX - headR * 0.6, headY + headR * 1.5);
        c.lineTo(headX - headR * 0.8, headY);
        c.fill();
        c.beginPath();
        c.moveTo(headX + headR * 1.0, headY);
        c.quadraticCurveTo(headX + headR * 1.1, headY + headR * 1.2, headX + headR * 0.6, headY + headR * 1.5);
        c.lineTo(headX + headR * 0.8, headY);
        c.fill();
      } else {
        for (let h = 0; h < 9; h++) {
          const angle = -Math.PI * 0.85 + (h / 8) * Math.PI * 0.7;
          const cx2 = headX + Math.cos(angle) * headR * 1.0;
          const cy2 = headY + Math.sin(angle) * headR * 0.85 - headR * 0.15;
          c.beginPath();
          c.arc(cx2, cy2, headR * 0.25, 0, Math.PI * 2);
          c.fill();
        }
      }
      for (let s = 0; s < 4; s++) {
        drawMiniStar(c, srand() * artW, srand() * artH, 2 + srand()*3, palette[Math.floor(srand()*palette.length)] + 'B0');
      }
      break;
    }
    case 'tooth': {
      c.fillStyle = palette[3] + '20';
      c.fillRect(0, 0, artW, artH);
      const tx = artW * 0.5, ty = artH * 0.4, ts = artW * 0.25;
      c.fillStyle = '#FFFFFF';
      c.strokeStyle = '#E0D5C5';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(tx - ts, ty - ts * 0.2);
      c.quadraticCurveTo(tx - ts, ty - ts * 1.0, tx - ts * 0.3, ty - ts * 1.1);
      c.quadraticCurveTo(tx, ty - ts * 1.3, tx + ts * 0.3, ty - ts * 1.1);
      c.quadraticCurveTo(tx + ts, ty - ts * 1.0, tx + ts, ty - ts * 0.2);
      c.quadraticCurveTo(tx + ts * 0.8, ty + ts * 0.6, tx + ts * 0.4, ty + ts * 1.0);
      c.quadraticCurveTo(tx + ts * 0.1, ty + ts * 0.5, tx, ty + ts * 0.7);
      c.quadraticCurveTo(tx - ts * 0.1, ty + ts * 0.5, tx - ts * 0.4, ty + ts * 1.0);
      c.quadraticCurveTo(tx - ts * 0.8, ty + ts * 0.6, tx - ts, ty - ts * 0.2);
      c.closePath();
      c.fill(); c.stroke();
      c.fillStyle = '#FFB6C140';
      c.beginPath();
      c.arc(tx - ts * 0.2, ty - ts * 0.3, ts * 0.15, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#4A3728';
      c.beginPath();
      c.arc(tx - ts * 0.25, ty - ts * 0.5, ts * 0.06, 0, Math.PI * 2);
      c.arc(tx + ts * 0.25, ty - ts * 0.5, ts * 0.06, 0, Math.PI * 2);
      c.fill();
      for (let s = 0; s < 10; s++) {
        const angle = (s / 10) * Math.PI * 2 + srand() * 0.3;
        const dist = ts * 1.4 + srand() * ts * 0.4;
        drawMiniStar(c, tx + Math.cos(angle)*dist, ty + Math.sin(angle)*dist, 2 + srand()*2, '#FFD700C0');
      }
      break;
    }
    case 'artwork': {
      c.fillStyle = palette[3] + '18';
      c.fillRect(0, 0, artW, artH);
      const artType = srand();
      if (artType < 0.33) {
        for (let s = 0; s < 4 + Math.floor(srand() * 3); s++) {
          c.strokeStyle = palette[Math.floor(srand() * palette.length)] + 'B0';
          c.lineWidth = 4 + srand() * 8;
          c.lineCap = 'round';
          c.lineJoin = 'round';
          c.beginPath();
          let sx = srand() * artW, sy = srand() * artH;
          c.moveTo(sx, sy);
          for (let p = 0; p < 4; p++) {
            sx += (srand() - 0.5) * artW * 0.5;
            sy += (srand() - 0.5) * artH * 0.4;
            c.lineTo(clamp(sx, 0, artW), clamp(sy, 0, artH));
          }
          c.stroke();
        }
      } else if (artType < 0.66) {
        c.fillStyle = palette[0] + 'A0';
        c.fillRect(artW * 0.25, artH * 0.45, artW * 0.5, artH * 0.45);
        c.fillStyle = palette[2] + 'A0';
        c.beginPath();
        c.moveTo(artW * 0.15, artH * 0.45);
        c.lineTo(artW * 0.5, artH * 0.15);
        c.lineTo(artW * 0.85, artH * 0.45);
        c.fill();
        c.fillStyle = palette[1] + 'B0';
        c.fillRect(artW * 0.4, artH * 0.6, artW * 0.2, artH * 0.3);
        c.fillStyle = '#FDCB6E';
        c.beginPath();
        c.arc(artW * 0.82, artH * 0.13, artW * 0.09, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#FDCB6E80';
        c.lineWidth = 1.5;
        for (let r2 = 0; r2 < 8; r2++) {
          const a = (r2 / 8) * Math.PI * 2;
          c.beginPath();
          c.moveTo(artW * 0.82 + Math.cos(a) * artW * 0.11, artH * 0.13 + Math.sin(a) * artW * 0.11);
          c.lineTo(artW * 0.82 + Math.cos(a) * artW * 0.15, artH * 0.13 + Math.sin(a) * artW * 0.15);
          c.stroke();
        }
      } else {
        const rainbowColors = ['#FF6B6B','#FF8C42','#FFD166','#06D6A0','#0984E3','#6C5B7B','#C06C84'];
        for (let i = 0; i < 7; i++) {
          c.strokeStyle = rainbowColors[i] + '80';
          c.lineWidth = artH * 0.06;
          c.beginPath();
          c.arc(artW * 0.5, artH * 0.85, artW * (0.45 - i * 0.04), Math.PI, 0);
          c.stroke();
        }
      }
      break;
    }
    case 'note': {
      c.fillStyle = '#FFFDF7';
      c.fillRect(0, 0, artW, artH);
      c.strokeStyle = '#E8E0D8';
      c.lineWidth = 0.5;
      for (let l = 0; l < 6; l++) {
        const ly = artH * 0.15 + l * artH * 0.13;
        c.beginPath();
        c.moveTo(artW * 0.08, ly);
        c.lineTo(artW * 0.92, ly);
        c.stroke();
      }
      const inkColors = ['#3A3025','#4A4035','#2C2418'];
      c.lineCap = 'round';
      for (let l = 0; l < 5; l++) {
        const ly = artH * 0.18 + l * artH * 0.13;
        const lineW = artW * (l === 0 ? 0.35 : 0.4 + srand() * 0.35);
        const startX = artW * 0.1;
        c.strokeStyle = inkColors[Math.floor(srand() * inkColors.length)] + (l === 0 ? 'E0' : '70');
        c.lineWidth = l === 0 ? 2.2 : (0.8 + srand() * 0.6);
        c.beginPath();
        c.moveTo(startX, ly);
        let cx2 = startX;
        while (cx2 < startX + lineW) {
          const step = l === 0 ? (4 + srand() * 6) : (2 + srand() * 4);
          cx2 += step;
          const waveAmp = l === 0 ? 1.5 : 1.0;
          const cy2 = ly + (srand() - 0.5) * waveAmp + Math.sin(cx2 * 0.05) * 0.5;
          c.lineTo(Math.min(cx2, startX + lineW), cy2);
        }
        c.stroke();
      }
      break;
    }
    case 'photo': {
      const grad = c.createLinearGradient(0, 0, artW, artH);
      grad.addColorStop(0, palette[0] + 'A0');
      grad.addColorStop(0.5, palette[1] + '80');
      grad.addColorStop(1, palette[2] + '60');
      c.fillStyle = '#FFFFFF';
      c.fillRect(0, 0, artW, artH);
      const border = artW * 0.06;
      c.fillStyle = grad;
      c.fillRect(border, border, artW - border*2, artH - border*2);
      c.globalAlpha = 0.4;
      c.fillStyle = palette[3];
      c.beginPath();
      c.arc(artW * 0.4 + srand() * artW * 0.2, artH * 0.5, artW * 0.2, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
      break;
    }
  }

  return offscreen;
}

// ─── The Component ────────────────────────────────────────────────────────────

export default function ChainOfTeeth({ onDepositClick, onStoriesClick }: ChainOfTeethProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    W: number; H: number; dpr: number;
    mouseX: number; mouseY: number;
    targetMouseX: number; targetMouseY: number;
    camera: Camera;
    stars: Star[];
    cards: Card[];
    horizontalThreads: Thread[];
    verticalThreads: Thread[];
    emptySlots: EmptySlot[];
    junctionSparks: Spark[];
    introFairy: { active: boolean; x: number; y: number; progress: number; wingAngle: number; sparkles: Sparkle[]; };
    fairies: Fairy[];
    startTime: number | null;
    textShown: boolean;
    zoomOutComplete: boolean;
    fairyStartTime: number;
    counterValue: number;
    lastCounterIncrement: number;
    rafId: number;
    initialized: boolean;
  } | null>(null);

  const [showText, setShowText] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [counterValue, setCounterValue] = useState(12847);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    // ── Init state ──
    const state = {
      W: window.innerWidth,
      H: window.innerHeight,
      dpr: window.devicePixelRatio || 1,
      mouseX: 0.5, mouseY: 0.5,
      targetMouseX: 0.5, targetMouseY: 0.5,
      camera: { x: 0, y: 0, zoom: 8, focusCardIndex: -1, emptySlotX: 0, emptySlotY: 0 } as Camera,
      stars: [] as Star[],
      cards: [] as Card[],
      horizontalThreads: [] as Thread[],
      verticalThreads: [] as Thread[],
      emptySlots: [] as EmptySlot[],
      junctionSparks: [] as Spark[],
      introFairy: { active: false, x: 0, y: 0, progress: 0, wingAngle: 0, sparkles: [] as Sparkle[] },
      fairies: [] as Fairy[],
      startTime: null as number | null,
      textShown: false,
      zoomOutComplete: false,
      fairyStartTime: 0,
      counterValue: 12847,
      lastCounterIncrement: 0,
      rafId: 0,
      initialized: false,
    };
    stateRef.current = state;

    // ── Resize ──
    function resize() {
      state.dpr = window.devicePixelRatio || 1;
      state.W = window.innerWidth;
      state.H = window.innerHeight;
      canvas!.width = state.W * state.dpr;
      canvas!.height = state.H * state.dpr;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    }
    resize();

    // ── Stars ──
    for (let i = 0; i < STAR_COUNT; i++) {
      const yBias = Math.pow(Math.random(), 0.6);
      state.stars.push({
        x: Math.random() * 1.6 - 0.3,
        y: yBias * 1.3 - 0.15,
        r: rand(0.2, 3.2),
        alpha: rand(0.06, 0.75),
        twinkle: Math.random() < 0.35,
        twinkleSpeed: rand(0.4, 2.0),
        twinkleOffset: Math.random() * Math.PI * 2,
        drift: rand(-0.00001, 0.00001),
        depth: rand(0.15, 1),
        glow: Math.random() < 0.15
      });
    }

    // ── Cards ──
    function generateCards() {
      state.cards.length = 0;
      state.horizontalThreads.length = 0;
      state.verticalThreads.length = 0;
      state.emptySlots.length = 0;

      const worldHeight = 1800;
      const worldTop = -worldHeight / 2;
      let cardIndex = 0;

      for (let row = 0; row < DEPTH_ROWS; row++) {
        const depthT = row / (DEPTH_ROWS - 1);
        const perspT = Math.pow(depthT, 1.4);
        const rowY = worldTop + depthT * worldHeight;
        const scale = lerp(0.28, 1.0, perspT);
        const alphaMax = lerp(0.38, 1.0, perspT);
        const cardW = CARD_BASE_W * scale;
        const cardH = CARD_BASE_H * scale;
        const rowCols = Math.floor(lerp(38, 22, perspT));
        const spacing = cardW * 1.15;
        const totalRowWidth = rowCols * spacing;
        const startX = -totalRowWidth / 2;
        const rowCards: Card[] = [];

        for (let col = 0; col < rowCols; col++) {
          const baseX = startX + col * spacing;
          const baseY = rowY;
          const jitterX = (hashIdx(cardIndex * 3 + 1) - 0.5) * 20 * scale;
          const jitterY = (hashIdx(cardIndex * 3 + 2) - 0.5) * 14 * scale;

          if (hashIdx(cardIndex + 7777) < 0.05 && row > 1 && row < DEPTH_ROWS - 1) {
            state.emptySlots.push({ x: baseX + jitterX, y: baseY + jitterY, w: cardW, h: cardH, scale, row, col });
            cardIndex++;
            continue;
          }

          const artPixelW = Math.round(cardW * 1.5);
          const artPixelH = Math.round(cardH * 0.60 * 1.5);
          const artCanvas = generateCardArt(cardIndex, artPixelW, artPixelH);
          const ctype = getCardType(cardIndex);
          const tintPalette = WARM_PALETTES[Math.floor(hashIdx(cardIndex + 100) * WARM_PALETTES.length)];
          const borderColor = tintPalette[0];

          const card: Card = {
            baseX: baseX + jitterX,
            baseY: baseY + jitterY,
            x: baseX + jitterX,
            y: baseY + jitterY,
            w: cardW, h: cardH,
            scale, alphaMax,
            alpha: 1,
            depthT: perspT,
            row, col,
            index: cardIndex,
            artCanvas,
            name: childName(cardIndex),
            title: keepsakeTitle(cardIndex),
            detail: keepsakeDetail(cardIndex),
            date: childDate(cardIndex),
            cardType: ctype,
            borderColor,
            tilt: (hashIdx(cardIndex * 5 + 3) - 0.5) * 0.07,
            bobSpeed: rand(0.25, 0.55),
            bobAmp: rand(1.5, 4) * scale,
            bobOffset: Math.random() * Math.PI * 2,
            swaySpeed: rand(0.12, 0.3),
            swayAmp: rand(1, 3) * scale,
            swayOffset: Math.random() * Math.PI * 2,
            parallaxMult: lerp(2, 22, perspT),
            flashAlpha: 0
          };

          state.cards.push(card);
          rowCards.push(card);
          cardIndex++;
        }

        for (let c2 = 0; c2 < rowCards.length - 1; c2++) {
          state.horizontalThreads.push({ from: rowCards[c2], to: rowCards[c2 + 1], alpha: 1, pulses: [] });
        }
      }

      for (let row = 0; row < DEPTH_ROWS - 1; row++) {
        const thisRowCards = state.cards.filter(c2 => c2.row === row);
        const nextRowCards = state.cards.filter(c2 => c2.row === row + 1);
        for (let i = 0; i < thisRowCards.length; i += 2) {
          const card = thisRowCards[i];
          let bestDist = Infinity, bestCard: Card | null = null;
          for (const nc of nextRowCards) {
            const dx = Math.abs(card.baseX - nc.baseX);
            if (dx < bestDist) { bestDist = dx; bestCard = nc; }
          }
          if (bestCard) {
            state.verticalThreads.push({ from: card, to: bestCard, alpha: 1, pulses: [] });
          }
        }
      }

      const allThreads = [...state.horizontalThreads, ...state.verticalThreads];
      for (const thread of allThreads) {
        const pulseCount = 1 + Math.floor(Math.random() * 3);
        for (let p = 0; p < pulseCount; p++) {
          thread.pulses.push({ pos: Math.random(), speed: 0.15 + Math.random() * 0.35, brightness: 0.5 + Math.random() * 0.5 });
        }
      }

      const centerCards = state.cards.filter(c2 => c2.row >= 5 && c2.row <= 8 && Math.abs(c2.baseX) < 200);
      if (centerCards.length > 0) {
        const focusCard = centerCards[Math.floor(centerCards.length / 2)];
        state.camera.focusCardIndex = state.cards.indexOf(focusCard);
        state.camera.x = focusCard.baseX;
        state.camera.y = focusCard.baseY;

        let nearestSlot: EmptySlot | null = null, nearestDist = Infinity;
        for (const slot of state.emptySlots) {
          const dx = slot.x - focusCard.baseX;
          const dy = slot.y - focusCard.baseY;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < nearestDist) { nearestDist = d; nearestSlot = slot; }
        }
        if (!nearestSlot || nearestDist > 200) {
          state.camera.emptySlotX = focusCard.baseX + focusCard.w * 1.5;
          state.camera.emptySlotY = focusCard.baseY + (Math.random() - 0.5) * 20;
        } else {
          state.camera.emptySlotX = nearestSlot.x;
          state.camera.emptySlotY = nearestSlot.y;
        }
      }
    }

    generateCards();

    // ── Fairies ──
    function createFairy(index: number): Fairy {
      return {
        active: false, phase: 'idle',
        x: 0, y: 0,
        targetSlot: null,
        progress: 0,
        wingAngle: rand(0, Math.PI * 2),
        sparkles: [],
        pauseTimer: 0,
        startX: 0, startY: 0,
        index,
        _restartAt: 0,
        carryingCard: true,
        hasCoin: false
      };
    }
    for (let i = 0; i < FAIRY_COUNT; i++) state.fairies.push(createFairy(i));

    // ── Draw helpers ──
    function applyCameraTransform() {
      ctx.save();
      ctx.translate(state.W / 2, state.H / 2);
      ctx.scale(state.camera.zoom, state.camera.zoom);
      ctx.translate(-state.camera.x, -state.camera.y);
    }

    function restoreCameraTransform() { ctx.restore(); }

    function emitJunctionSpark(x: number, y: number) {
      const count = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 1.2;
        state.junctionSparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, decay: 0.02 + Math.random() * 0.03, size: 0.5 + Math.random() * 1.5 });
      }
    }

    function drawKeepsakeCard(card: Card, alpha: number) {
      if (alpha < 0.02) return;
      const { x, y, w, h, scale, artCanvas, name, title, detail, date, tilt, borderColor } = card;
      const screenX = (x - state.camera.x) * state.camera.zoom + state.W / 2;
      const screenY = (y - state.camera.y) * state.camera.zoom + state.H / 2;
      const screenW = w * state.camera.zoom;
      const screenH = h * state.camera.zoom;
      if (screenX + screenW < -50 || screenX - screenW > state.W + 50 || screenY + screenH < -50 || screenY - screenH > state.H + 50) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      ctx.globalAlpha = alpha;
      const r = 6 * scale;
      ctx.shadowColor = 'rgba(240,196,86,0.12)';
      ctx.shadowBlur = 10 * scale;
      ctx.shadowOffsetY = 3 * scale;
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h, r);
      ctx.fillStyle = '#FFF8F0';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h, r);
      ctx.strokeStyle = (borderColor || '#E0D5C5') + '50';
      ctx.lineWidth = 1 * scale;
      ctx.stroke();

      const artH2 = h * 0.60;
      const artY = -h/2;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-w/2 + 1, artY + 1, w - 2, artH2 - 1, [r, r, 0, 0]);
      ctx.clip();
      ctx.drawImage(artCanvas, -w/2 + 1, artY + 1, w - 2, artH2 - 1);
      const topShadow = ctx.createLinearGradient(0, artY, 0, artY + artH2 * 0.2);
      topShadow.addColorStop(0, 'rgba(0,0,0,0.08)');
      topShadow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topShadow;
      ctx.fillRect(-w/2, artY, w, artH2 * 0.2);
      ctx.restore();

      ctx.strokeStyle = 'rgba(180,160,140,0.25)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-w/2 + 6 * scale, artY + artH2 + 2);
      ctx.lineTo(w/2 - 6 * scale, artY + artH2 + 2);
      ctx.stroke();

      const textStartY = artY + artH2 + 4;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      if (scale > 0.35) {
        const titleFontSize = Math.max(5, Math.round(7.5 * scale));
        ctx.font = `700 ${titleFontSize}px Georgia, serif`;
        ctx.fillStyle = '#4A3A2A';
        const shortName = name.split(' ')[0];
        const cardTitle = shortName + "'s " + (title || "Tooth");
        ctx.fillText(cardTitle, 0, textStartY, w - 8);
        if (scale > 0.45) {
          const detailFontSize = Math.max(4, Math.round(5.5 * scale));
          ctx.font = `${detailFontSize}px Georgia, serif`;
          ctx.fillStyle = '#8A7A6A';
          ctx.fillText(detail || '', 0, textStartY + titleFontSize + 2, w - 8);
          if (scale > 0.55) {
            const dateFontSize = Math.max(3.5, Math.round(4.5 * scale));
            ctx.font = `${dateFontSize}px Georgia, serif`;
            ctx.fillStyle = '#B0A090';
            ctx.fillText(date || '', 0, textStartY + titleFontSize + Math.max(4, Math.round(5.5 * scale)) + 5, w - 8);
          }
        }
      }

      if (card.flashAlpha > 0.01) {
        ctx.globalAlpha = card.flashAlpha;
        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.8);
        grd.addColorStop(0, '#FFD700');
        grd.addColorStop(0.5, 'rgba(255,215,0,0.3)');
        grd.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(-w, -h, w*2, h*2);
      }

      ctx.restore();
    }

    function drawGoldenThread(thread: Thread, baseAlpha: number) {
      const { from, to } = thread;
      const alpha = baseAlpha * Math.min(from.alphaMax || 1, to.alphaMax || 1);
      if (alpha < 0.02) return;
      const minX = Math.min(from.x, to.x);
      const maxX = Math.max(from.x, to.x);
      const minY = Math.min(from.y, to.y);
      const maxY = Math.max(from.y, to.y);
      const viewLeft = state.camera.x - (state.W / 2) / state.camera.zoom - 50;
      const viewRight = state.camera.x + (state.W / 2) / state.camera.zoom + 50;
      const viewTop = state.camera.y - (state.H / 2) / state.camera.zoom - 50;
      const viewBottom = state.camera.y + (state.H / 2) / state.camera.zoom + 50;
      if (maxX < viewLeft || minX > viewRight || maxY < viewTop || minY > viewBottom) return;

      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const perpX = -dy / (dist || 1) * dist * 0.06;
      const perpY = dx / (dist || 1) * dist * 0.06;
      const droopY = Math.abs(dx) > Math.abs(dy) ? dist * 0.03 : 0;
      const cpx = mx + perpX * (hashIdx(from.index * 17 + to.index) - 0.5);
      const cpy = my + perpY * (hashIdx(from.index * 13 + to.index) - 0.5) + droopY;

      const avgX = (from.x + to.x) / 2;
      const avgY = (from.y + to.y) / 2;
      const distFromCenter = Math.sqrt(avgX * avgX + avgY * avgY);
      const nearBoost = clamp(1 - distFromCenter / 1200, 0, 1);
      const threadAlpha = 0.35 + nearBoost * 0.5;

      ctx.save();
      ctx.globalAlpha = alpha * threadAlpha * 0.25;
      ctx.strokeStyle = '#f0c456';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
      ctx.stroke();

      ctx.globalAlpha = alpha * threadAlpha * 0.45;
      ctx.strokeStyle = '#f0c456';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
      ctx.stroke();

      ctx.globalAlpha = alpha * threadAlpha * 0.9;
      ctx.strokeStyle = '#f0c456';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#f0c456';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      const time = performance.now() / 1000;
      const pulseWave = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 1.5 + (from.index || 0) * 0.7));
      ctx.globalAlpha = alpha * threadAlpha * 0.2 * pulseWave;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
      ctx.stroke();

      for (const pulse of thread.pulses) {
        const pt = pulse.pos;
        const px = (1-pt)*(1-pt)*from.x + 2*(1-pt)*pt*cpx + pt*pt*to.x;
        const py2 = (1-pt)*(1-pt)*from.y + 2*(1-pt)*pt*cpy + pt*pt*to.y;
        ctx.globalAlpha = alpha * pulse.brightness * 0.9;
        const grd = ctx.createRadialGradient(px, py2, 0, px, py2, 6);
        grd.addColorStop(0, '#FFFFFF');
        grd.addColorStop(0.2, '#FFD700');
        grd.addColorStop(0.5, 'rgba(255,215,0,0.5)');
        grd.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(px, py2, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function drawFairyCharacter(x: number, y: number, wingAngle: number, alpha: number, carrying: string | null, styleIndex: number, fairyScale: number) {
      if (alpha < 0.02) return;
      const s = FAIRY_STYLES[styleIndex % 3];
      const sz = fairyScale || 1;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(sz, sz);
      ctx.globalAlpha = alpha;

      const glowR = 25;
      const grd = ctx.createRadialGradient(0, -2, 3, 0, -2, glowR);
      grd.addColorStop(0, s.glowColor);
      grd.addColorStop(0.5, s.glowColor.replace(/[\d.]+\)$/, '0.15)'));
      grd.addColorStop(1, s.glowR);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, -2, glowR, 0, Math.PI * 2);
      ctx.fill();

      const wf = Math.sin(wingAngle) * 0.4 + 0.6;
      ctx.globalAlpha = alpha * 0.45;

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.strokeStyle = s.dress1 + '60';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.ellipse(-9 * wf, -8, 10 * wf, 5, -0.25, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.ellipse(-7 * wf, -9, 6 * wf, 3, -0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.strokeStyle = s.dress1 + '60';
      ctx.beginPath();
      ctx.ellipse(9 * wf, -8, 10 * wf, 5, 0.25, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.ellipse(7 * wf, -9, 6 * wf, 3, 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#FFDAB9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-2, 8); ctx.lineTo(-3, 13);
      ctx.moveTo(2, 8); ctx.lineTo(3, 13);
      ctx.stroke();

      const dressGrad = ctx.createLinearGradient(0, -2, 0, 9);
      dressGrad.addColorStop(0, s.dress1);
      dressGrad.addColorStop(1, s.dress2);
      ctx.fillStyle = dressGrad;
      ctx.beginPath();
      ctx.moveTo(-2, -2);
      ctx.quadraticCurveTo(-6, 4, -5, 9);
      ctx.lineTo(5, 9);
      ctx.quadraticCurveTo(6, 4, 2, -2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#FFDAB9';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4, 1);
      ctx.quadraticCurveTo(-6, 5, -3, 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4, 1);
      ctx.quadraticCurveTo(6, 5, 3, 8);
      ctx.stroke();

      ctx.fillStyle = '#FFDAB9';
      ctx.beginPath();
      ctx.arc(0, -6, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = s.hair;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, -7.5, 4.5, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-3, -9); ctx.quadraticCurveTo(-5, -11, -4, -12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -10); ctx.quadraticCurveTo(1, -12, 0, -13);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(3, -9); ctx.quadraticCurveTo(5, -11, 4, -12);
      ctx.stroke();

      ctx.fillStyle = '#2C1810';
      ctx.beginPath();
      ctx.arc(-1.5, -6, 0.7, 0, Math.PI * 2);
      ctx.arc(1.5, -6, 0.7, 0, Math.PI * 2);
      ctx.fill();

      if (carrying === 'card') {
        ctx.globalAlpha = alpha * 0.85;
        ctx.beginPath();
        ctx.roundRect(-5, 11, 10, 13, 1.5);
        ctx.fillStyle = '#FFF8F0';
        ctx.strokeStyle = '#E0D5C5';
        ctx.lineWidth = 0.5;
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = s.dress1 + '80';
        ctx.fillRect(-3, 13, 6, 5);
        ctx.fillStyle = 'rgba(90,70,50,0.3)';
        ctx.fillRect(-3, 20, 6, 0.8);
        ctx.fillRect(-3, 21.5, 4, 0.8);
      } else if (carrying === 'coin') {
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = '#f0c456';
        ctx.shadowColor = '#f0c456';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 14, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(-1.5, 12.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }

    function drawSparkle(x: number, y: number, alpha: number, size: number, color: string) {
      if (alpha < 0.02) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color || '#f0c456';
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function startFairyRun(fairy: Fairy) {
      fairy.active = true;
      fairy.phase = 'flyUp';
      fairy.progress = 0;
      fairy.pauseTimer = 0;
      fairy.carryingCard = true;
      fairy.hasCoin = false;
      fairy.sparkles = [];
      if (state.emptySlots.length > 0) {
        fairy.targetSlot = state.emptySlots[Math.floor(Math.random() * state.emptySlots.length)];
      } else {
        const randomCard = state.cards[Math.floor(Math.random() * state.cards.length)];
        fairy.targetSlot = { x: randomCard.x + randomCard.w, y: randomCard.y, w: randomCard.w, h: randomCard.h, scale: randomCard.scale, row: randomCard.row, col: randomCard.col };
      }
      const viewBottom = state.camera.y + (state.H / 2) / state.camera.zoom;
      fairy.startX = fairy.targetSlot.x + (Math.random() - 0.5) * 300;
      fairy.startY = viewBottom + 80 / state.camera.zoom;
      fairy.x = fairy.startX;
      fairy.y = fairy.startY;
    }

    function fairyArcPos(startX: number, startY: number, endX: number, endY: number, progress: number, goingUp: boolean) {
      const eased = goingUp
        ? 1 - Math.pow(1 - progress, 2.2)
        : Math.pow(progress, 2.2);
      const cpOffX = (endX - startX) * (goingUp ? -0.15 : 0.15);
      const cpY = Math.min(startY, endY) - Math.abs(endY - startY) * 0.12;
      const midX = (startX + endX) / 2 + cpOffX;
      const t = eased;
      const x = (1-t)*(1-t)*startX + 2*(1-t)*t*midX + t*t*endX;
      const y = (1-t)*(1-t)*startY + 2*(1-t)*t*cpY + t*t*endY;
      const weave = Math.sin(progress * Math.PI * 2) * 8 * (1 - Math.abs(progress - 0.5) * 2);
      return { x: x + weave, y };
    }

    // ── Animation loop ──
    function animate(now: number) {
      if (!state.startTime) state.startTime = now;
      const elapsed = (now - state.startTime) * 0.001;
      const t = elapsed;

      state.mouseX = lerp(state.mouseX, state.targetMouseX, 0.04);
      state.mouseY = lerp(state.mouseY, state.targetMouseY, 0.04);

      const { W, H } = state;
      ctx.clearRect(0, 0, W, H);

      // Background
      const bgGrd = ctx.createRadialGradient(W*0.5, H*0.35, 0, W*0.5, H*0.5, Math.max(W,H)*0.75);
      bgGrd.addColorStop(0, '#141a3a');
      bgGrd.addColorStop(1, '#0d1228');
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, W, H);

      // Camera zoom animation
      const focusCard = state.cards[state.camera.focusCardIndex];
      let zoomProgress = 0;
      if (t < TIMELINE.zoomStart) {
        state.camera.zoom = 8;
        if (focusCard) { state.camera.x = focusCard.baseX; state.camera.y = focusCard.baseY; }
      } else if (t < TIMELINE.zoomEnd) {
        zoomProgress = (t - TIMELINE.zoomStart) / (TIMELINE.zoomEnd - TIMELINE.zoomStart);
        const eased = easeOutCubic(zoomProgress);
        state.camera.zoom = lerp(8, 1, eased);
        if (focusCard) {
          state.camera.x = lerp(focusCard.baseX, 0, eased);
          state.camera.y = lerp(focusCard.baseY, 0, eased);
        }
      } else {
        state.camera.zoom = 1;
        state.camera.x = 0;
        state.camera.y = 0;
        if (!state.zoomOutComplete) state.zoomOutComplete = true;
      }

      const parallaxActive = state.zoomOutComplete;
      const parallaxX = parallaxActive ? (state.mouseX - 0.5) * 2 : 0;
      const parallaxY = parallaxActive ? (state.mouseY - 0.5) * 2 : 0;

      // Stars
      const starAlphaMultiplier = t < TIMELINE.zoomStart ? 0.12
        : t < TIMELINE.zoomEnd ? lerp(0.12, 1, easeOutCubic((t - TIMELINE.zoomStart) / (TIMELINE.zoomEnd - TIMELINE.zoomStart))) : 1;

      for (const s of state.stars) {
        s.x += s.drift;
        if (s.x > 1.3) s.x = -0.15;
        if (s.x < -0.2) s.x = 1.25;
        const px = s.x * W + parallaxX * s.depth * 5;
        const py = s.y * H + parallaxY * s.depth * 5;
        let a = s.alpha * starAlphaMultiplier;
        if (s.twinkle) a *= 0.4 + 0.6 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = '#fff';
        if (s.glow && s.r > 1.5) {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, s.r * 3);
          grd.addColorStop(0, 'rgba(255,255,255,0.5)');
          grd.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px, py, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
        }
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Update cards
      for (const card of state.cards) {
        const bob = Math.sin(t * card.bobSpeed + card.bobOffset) * card.bobAmp;
        const sway = Math.sin(t * card.swaySpeed + card.swayOffset) * card.swayAmp;
        card.x = card.baseX + sway + parallaxX * card.parallaxMult;
        card.y = card.baseY + bob + parallaxY * card.parallaxMult;
        if (card.flashAlpha > 0) card.flashAlpha *= 0.94;
      }

      // Update energy pulses
      const dt = 0.016;
      const allThreads = [...state.horizontalThreads, ...state.verticalThreads];
      for (const thread of allThreads) {
        for (const pulse of thread.pulses) {
          pulse.pos += pulse.speed * dt;
          if (pulse.pos > 1) {
            pulse.pos -= 1;
            if (Math.random() < 0.06) emitJunctionSpark(thread.to.x, thread.to.y);
          }
        }
      }

      // Update junction sparks
      for (let i = state.junctionSparks.length - 1; i >= 0; i--) {
        const sp = state.junctionSparks[i];
        sp.x += sp.vx; sp.y += sp.vy;
        sp.life -= sp.decay;
        if (sp.life <= 0) state.junctionSparks.splice(i, 1);
      }

      // Camera transform
      applyCameraTransform();

      // Draw threads
      for (const thread of state.verticalThreads) drawGoldenThread(thread, 0.35);
      for (const thread of state.horizontalThreads) drawGoldenThread(thread, 0.6);

      // Junction sparks (world space)
      for (const sp of state.junctionSparks) {
        ctx.globalAlpha = sp.life * 0.8;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw cards
      for (const card of state.cards) drawKeepsakeCard(card, card.alphaMax);

      // Intro fairy sequence
      if (t >= TIMELINE.fairyEnter && t < TIMELINE.pauseEnd && focusCard) {
        const slotX = state.camera.emptySlotX;
        const slotY = state.camera.emptySlotY;
        state.introFairy.wingAngle += 0.35;

        if (t < TIMELINE.fairyArrive) {
          const flyProgress = (t - TIMELINE.fairyEnter) / (TIMELINE.fairyArrive - TIMELINE.fairyEnter);
          const eased2 = 1 - Math.pow(1 - flyProgress, 2);
          const viewRight = state.camera.x + (W / 2) / state.camera.zoom;
          const startFX = viewRight + 30 / state.camera.zoom;
          const startFY = slotY + 40 / state.camera.zoom;
          const fx = lerp(startFX, slotX, eased2);
          const fy = lerp(startFY, slotY - 15, eased2);
          if (Math.random() < 0.6) {
            state.introFairy.sparkles.push({ x: fx + rand(-3, 3), y: fy + rand(3, 10), alpha: 0.9, size: rand(0.8, 2.5) / state.camera.zoom, color: Math.random() < 0.7 ? '#5adace' : '#f0c456' });
          }
          const fairyScale = 1.0 / state.camera.zoom * 3;
          drawFairyCharacter(fx, fy, state.introFairy.wingAngle, 1, 'card', 0, fairyScale);
        } else if (t < TIMELINE.mintEnd) {
          const mintProgress = (t - TIMELINE.fairyArrive) / (TIMELINE.mintEnd - TIMELINE.fairyArrive);
          const fairyScale = 1.0 / state.camera.zoom * 3;
          drawFairyCharacter(slotX, slotY - 20 / state.camera.zoom, state.introFairy.wingAngle, 1,
            mintProgress < 0.2 ? 'card' : (mintProgress > 0.7 ? 'coin' : null), 0, fairyScale);

          const flashIntensity = mintProgress < 0.3 ? mintProgress / 0.3 : 1 - ((mintProgress - 0.3) / 0.7);
          ctx.save();
          ctx.globalAlpha = flashIntensity * 0.7;
          const burstR = (20 + mintProgress * 40) / state.camera.zoom;
          const grd = ctx.createRadialGradient(slotX, slotY, 0, slotX, slotY, burstR);
          grd.addColorStop(0, '#FFD700');
          grd.addColorStop(0.4, 'rgba(255,215,0,0.4)');
          grd.addColorStop(1, 'rgba(255,215,0,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(slotX, slotY, burstR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (mintProgress < 0.5 && Math.random() < 0.7) {
            const angle = Math.random() * Math.PI * 2;
            const dist2 = rand(5, 30) / state.camera.zoom;
            state.introFairy.sparkles.push({ x: slotX + Math.cos(angle) * dist2, y: slotY + Math.sin(angle) * dist2, alpha: 1.0, size: rand(1, 3) / state.camera.zoom, color: '#FFD700' });
          }

          if (mintProgress > 0.2) {
            const cardAlpha = (mintProgress - 0.2) / 0.8;
            const fakeCard: Card = {
              x: slotX, y: slotY,
              w: focusCard.w, h: focusCard.h,
              scale: focusCard.scale,
              artCanvas: focusCard.artCanvas,
              name: "Noah T.", title: "First Lost Tooth",
              detail: "Grandma's Gift — $10", date: 'Apr 2026',
              tilt: 0.02, borderColor: '#FFD700',
              flashAlpha: (1 - mintProgress) * 0.6,
              baseX: slotX, baseY: slotY, alpha: 1,
              alphaMax: focusCard.alphaMax, depthT: focusCard.depthT,
              row: focusCard.row, col: focusCard.col, index: focusCard.index,
              cardType: 'portrait', bobSpeed: 0, bobAmp: 0, bobOffset: 0,
              swaySpeed: 0, swayAmp: 0, swayOffset: 0, parallaxMult: 0
            };
            drawKeepsakeCard(fakeCard, cardAlpha * focusCard.alphaMax);
          }

          if (mintProgress > 0.4) {
            const threadAlpha = (mintProgress - 0.4) / 0.6;
            ctx.save();
            ctx.globalAlpha = threadAlpha * 0.5;
            ctx.strokeStyle = '#f0c456';
            ctx.lineWidth = 1;
            ctx.shadowColor = '#f0c456';
            ctx.shadowBlur = 4;
            ctx.beginPath();
            const threadLen = threadAlpha;
            const tx2 = lerp(slotX, focusCard.x, threadLen);
            const ty2 = lerp(slotY, focusCard.y, threadLen);
            ctx.moveTo(slotX, slotY);
            const cmx = (slotX + tx2) / 2;
            const cmy = (slotY + ty2) / 2 - 10;
            ctx.quadraticCurveTo(cmx, cmy, tx2, ty2);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.restore();
          }
        }

        for (let si = state.introFairy.sparkles.length - 1; si >= 0; si--) {
          const sp = state.introFairy.sparkles[si];
          sp.alpha -= 0.012;
          sp.y += 0.2 / state.camera.zoom;
          if (sp.alpha <= 0) { state.introFairy.sparkles.splice(si, 1); continue; }
          drawSparkle(sp.x, sp.y, sp.alpha, sp.size, sp.color);
        }
      }

      // Running fairies
      if (state.zoomOutComplete) {
        for (let fi = 0; fi < state.fairies.length; fi++) {
          const fairy = state.fairies[fi];
          if (!fairy.active && fairy.phase === 'idle' && fairy._restartAt === 0) {
            fairy._restartAt = now + fi * 3000;
          }
          if (!fairy.active && fairy._restartAt > 0 && now > fairy._restartAt) {
            fairy._restartAt = 0;
            startFairyRun(fairy);
          }
          if (!fairy.active) continue;
          fairy.wingAngle += 0.3;
          const slot = fairy.targetSlot;
          if (!slot) continue;

          switch (fairy.phase) {
            case 'flyUp': {
              fairy.progress += 0.006;
              if (fairy.progress >= 1) { fairy.progress = 1; fairy.phase = 'place'; fairy.pauseTimer = 0; }
              const pos = fairyArcPos(fairy.startX, fairy.startY, slot.x, slot.y, fairy.progress, true);
              fairy.x = pos.x; fairy.y = pos.y;
              if (Math.random() < 0.5) {
                fairy.sparkles.push({ x: fairy.x + rand(-3, 3), y: fairy.y + rand(5, 12), alpha: 0.8, size: rand(0.8, 2), color: Math.random() < 0.6 ? '#5adace' : '#f0c456' });
              }
              drawFairyCharacter(fairy.x, fairy.y, fairy.wingAngle, 1, 'card', fairy.index, 1);
              break;
            }
            case 'place': {
              fairy.pauseTimer += dt;
              fairy.x = slot.x; fairy.y = slot.y - 20;
              if (fairy.pauseTimer < 0.5) {
                drawFairyCharacter(fairy.x, fairy.y, fairy.wingAngle, 1, 'card', fairy.index, 1);
              } else if (fairy.pauseTimer < 1.5) {
                const burstP = (fairy.pauseTimer - 0.5) / 1.0;
                drawFairyCharacter(fairy.x, fairy.y, fairy.wingAngle, 1, null, fairy.index, 1);
                const flashI = burstP < 0.3 ? burstP / 0.3 : 1 - ((burstP - 0.3) / 0.7);
                ctx.save();
                ctx.globalAlpha = flashI * 0.5;
                const br = 15 + burstP * 25;
                const grd = ctx.createRadialGradient(slot.x, slot.y, 0, slot.x, slot.y, br);
                grd.addColorStop(0, '#FFD700');
                grd.addColorStop(0.4, 'rgba(255,215,0,0.3)');
                grd.addColorStop(1, 'rgba(255,215,0,0)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(slot.x, slot.y, br, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                if (burstP < 0.4 && Math.random() < 0.6) {
                  const angle = Math.random() * Math.PI * 2;
                  fairy.sparkles.push({ x: slot.x + Math.cos(angle) * rand(5, 20), y: slot.y + Math.sin(angle) * rand(5, 20), alpha: 1.0, size: rand(1, 2.5), color: '#FFD700' });
                }
              } else if (fairy.pauseTimer < 2.0) {
                drawFairyCharacter(fairy.x, fairy.y, fairy.wingAngle, 1, null, fairy.index, 1);
                const coinAlpha = (fairy.pauseTimer - 1.5) / 0.5;
                ctx.save();
                ctx.globalAlpha = coinAlpha * 0.9;
                ctx.fillStyle = '#f0c456';
                ctx.shadowColor = '#f0c456';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(slot.x, slot.y - 5, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.restore();
              } else {
                fairy.phase = 'flyDown';
                fairy.progress = 0;
                fairy.hasCoin = true;
              }
              break;
            }
            case 'flyDown': {
              fairy.progress += 0.006;
              if (fairy.progress >= 1) {
                fairy.active = false;
                fairy.phase = 'idle';
                fairy._restartAt = now + 1500 + Math.random() * 2000;
                continue;
              }
              const viewBottom2 = state.camera.y + (H / 2) / state.camera.zoom;
              const exitY = viewBottom2 + 80 / state.camera.zoom;
              const exitX = slot.x + (fairy.index - 1) * 100;
              const pos2 = fairyArcPos(slot.x, slot.y, exitX, exitY, fairy.progress, false);
              fairy.x = pos2.x; fairy.y = pos2.y;
              if (Math.random() < 0.4) {
                fairy.sparkles.push({ x: fairy.x + rand(-3, 3), y: fairy.y + rand(5, 12), alpha: 0.7, size: rand(0.8, 2), color: '#f0c456' });
              }
              drawFairyCharacter(fairy.x, fairy.y, fairy.wingAngle, 1 - fairy.progress * 0.3, 'coin', fairy.index, 1);
              break;
            }
          }

          for (let si = fairy.sparkles.length - 1; si >= 0; si--) {
            const sp = fairy.sparkles[si];
            sp.alpha -= 0.015;
            sp.y += 0.15;
            if (sp.alpha <= 0) { fairy.sparkles.splice(si, 1); continue; }
            drawSparkle(sp.x, sp.y, sp.alpha, sp.size, sp.color);
          }
        }
      }

      restoreCameraTransform();

      // Show UI text
      if (t >= TIMELINE.titleFade && !state.textShown) {
        state.textShown = true;
        setShowText(true);
        setShowCta(true);
        setShowCounter(true);
        state.fairyStartTime = now;
      }

      // Counter increment
      if (state.zoomOutComplete) {
        if (now - state.lastCounterIncrement > 3500 + Math.random() * 3000) {
          state.counterValue++;
          state.lastCounterIncrement = now;
          setCounterValue(state.counterValue);
        }
      }

      state.rafId = requestAnimationFrame(animate);
    }

    state.rafId = requestAnimationFrame(animate);

    // ── Event listeners ──
    function handleMouseMove(e: MouseEvent) {
      if (!stateRef.current) return;
      stateRef.current.targetMouseX = e.clientX / stateRef.current.W;
      stateRef.current.targetMouseY = e.clientY / stateRef.current.H;
    }
    function handleTouchMove(e: TouchEvent) {
      if (!stateRef.current) return;
      stateRef.current.targetMouseX = e.touches[0].clientX / stateRef.current.W;
      stateRef.current.targetMouseY = e.touches[0].clientY / stateRef.current.H;
    }
    function handleResize() {
      if (!stateRef.current || !canvas) return;
      stateRef.current.dpr = window.devicePixelRatio || 1;
      stateRef.current.W = window.innerWidth;
      stateRef.current.H = window.innerHeight;
      canvas.width = stateRef.current.W * stateRef.current.dpr;
      canvas.height = stateRef.current.H * stateRef.current.dpr;
      ctx.setTransform(stateRef.current.dpr, 0, 0, stateRef.current.dpr, 0, 0);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(state.rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0d1228' }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(6,8,20,0.8) 100%)'
        }}
      />

      {/* Title overlay */}
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(28px, 4.5vw, 58px)',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 0 40px rgba(240,196,86,0.4), 0 0 80px rgba(240,196,86,0.15), 0 2px 20px rgba(0,0,0,0.8)',
            opacity: showText ? 0.9 : 0,
            transform: showText ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1.8s ease, transform 1.8s ease',
            textAlign: 'center',
            padding: '20px 48px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: 'rgba(13,18,40,0.75)',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(240,196,86,0.15)',
          }}
        >
          Welcome to the Tooth Fairy Network
        </div>
        <div
          style={{
            fontSize: 'clamp(14px, 1.8vw, 22px)',
            fontWeight: 400,
            color: C.gold,
            marginTop: '12px',
            opacity: showText ? 0.9 : 0,
            transform: showText ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 1.8s ease 0.5s, transform 1.8s ease 0.5s',
            textAlign: 'center',
            padding: '8px 28px',
            letterSpacing: '0.08em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: 'rgba(13,18,40,0.6)',
            borderRadius: '10px',
            backdropFilter: 'blur(8px)',
          }}
        >
          Deposit your tooth. Join the chain. Yours forever.
        </div>
      </div>

      {/* CTA buttons */}
      <div
        style={{
          position: 'fixed',
          bottom: 'clamp(24px, 5vh, 52px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          opacity: showCta ? 1 : 0,
          transition: 'opacity 1.8s ease 1s',
          pointerEvents: showCta ? 'auto' : 'none',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onDepositClick}
          style={{
            display: 'inline-block',
            padding: '14px 34px',
            fontSize: 'clamp(13px, 1.5vw, 17px)',
            fontWeight: 600,
            color: '#1a1630',
            background: 'linear-gradient(135deg, #f0c456, #f5d97a, #f0c456)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(240,196,86,0.3), 0 4px 15px rgba(0,0,0,0.3)',
            animation: 'ctaPulse 3s ease-in-out infinite',
            letterSpacing: '0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Deposit Your First Tooth
        </button>
        <button
          onClick={onStoriesClick}
          style={{
            display: 'inline-block',
            padding: '14px 34px',
            fontSize: 'clamp(13px, 1.5vw, 17px)',
            fontWeight: 600,
            color: C.gold,
            background: 'transparent',
            border: `1.5px solid rgba(240,196,86,0.5)`,
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(240,196,86,0.15)',
            letterSpacing: '0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Read the Stories
        </button>
      </div>

      {/* Counter */}
      <div
        style={{
          position: 'fixed',
          bottom: 'clamp(24px, 4vh, 40px)',
          left: '24px',
          zIndex: 3,
          color: C.gold,
          opacity: showCounter ? 0.85 : 0,
          transition: 'opacity 1.8s ease 1.5s',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: 'clamp(12px, 1.3vw, 16px)',
          fontWeight: 500,
          pointerEvents: 'none',
          textShadow: '0 0 12px rgba(240,196,86,0.3), 0 2px 8px rgba(0,0,0,0.6)',
          letterSpacing: '0.03em',
          background: 'rgba(13,18,40,0.5)',
          padding: '8px 16px',
          borderRadius: '8px',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span style={{ display: 'inline-block', animation: 'counterSparkle 2s ease-in-out infinite' }}>🦷</span>
        {' '}{counterValue.toLocaleString()} unique teeth deposited
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(240,196,86,0.3), 0 4px 15px rgba(0,0,0,0.3); transform: scale(1); }
          50% { box-shadow: 0 0 50px rgba(240,196,86,0.5), 0 4px 20px rgba(0,0,0,0.3); transform: scale(1.03); }
        }
        @keyframes counterSparkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
