import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const assetDir = join(root, "public", "toothfairy", "sample-toothlights")
const dataFile = join(root, "src", "data", "toothfairy", "sample-toothlights.ts")

const count = 50
const width = 1024
const height = 1280

const palettes = [
  { name: "moon chalk", paper: "#f7f0dc", wash: "#d9e8f4", ink: "#11304b", accent: "#f2c85b", glow: "#fff0a8", crayon: ["#294f9d", "#ff7d5f", "#65ad73", "#f0c456"] },
  { name: "porch light", paper: "#fff4d9", wash: "#e8d3bc", ink: "#3d2b38", accent: "#ff8a70", glow: "#ffd76a", crayon: ["#f05f73", "#2f8b78", "#476fc6", "#f5b847"] },
  { name: "roof song", paper: "#f2f6e8", wash: "#cde2d7", ink: "#17383c", accent: "#48b8a8", glow: "#e9ffe1", crayon: ["#38a39a", "#ffd76a", "#3558a5", "#d76757"] },
  { name: "birthday window", paper: "#fff7ef", wash: "#efd6e1", ink: "#30203f", accent: "#c56f9f", glow: "#ffe0f0", crayon: ["#cf6ca8", "#6e8ee8", "#f0c456", "#4ea36f"] },
  { name: "night pocket", paper: "#eef5fb", wash: "#c9d7ee", ink: "#14213d", accent: "#6c8ce6", glow: "#dff2ff", crayon: ["#2c5bd2", "#ea6a50", "#66b56f", "#f0c456"] },
]

const titles = [
  "Rocket Tooth",
  "Moon Tooth",
  "Rainbow Tooth",
  "Robot Tooth",
  "Pancake Tooth",
  "Pocket Tooth",
  "Castle Tooth",
  "Star Tooth",
  "Silly Tooth",
  "Soccer Tooth",
  "Kitchen Tooth",
  "Dragon Tooth",
  "Garden Tooth",
  "Snowy Tooth",
  "Birthday Tooth",
  "Bedtime Tooth",
  "Tiny Crown Tooth",
  "Space Tooth",
  "Lucky Tooth",
  "Cookie Tooth",
  "Treehouse Tooth",
  "Bus Stop Tooth",
  "Purple Tooth",
  "Dancing Tooth",
  "Lamp Tooth",
]

const prompts = [
  "My tooth came out and I yelled for everyone.",
  "It wiggled at breakfast and then it was free.",
  "I put it in a tiny cup so it would not run away.",
  "Dad said it was brave and I drew a rocket.",
  "I smiled in the mirror and there was a window.",
  "The tooth felt like a little pebble from my mouth.",
  "I wanted the Tooth Fairy to see my best drawing.",
  "It popped out when I was thinking about cookies.",
  "I made a moon because it happened at bedtime.",
  "My tooth was small but the story was big.",
  "I saved it in a napkin and checked it twice.",
  "The wiggly tooth finally gave up.",
  "I drew my tooth with a hat because it was funny.",
  "I told my grandma first because she likes teeth.",
  "The tooth came out before school and I was proud.",
  "I made a rainbow so the Tooth Fairy could find it.",
  "It was stuck, then it was not stuck anymore.",
  "I think my tooth wanted to go on an adventure.",
  "We put it on the table and it looked tiny.",
  "I made a star for the hole in my smile.",
  "The tooth fairy should know I was very brave.",
  "My smile has a door now.",
  "I lost it and then we found it by the sink.",
  "I wanted to keep the tooth and the funny part.",
  "It felt weird and exciting at the same time.",
  "My tooth came out while I was laughing.",
  "I made the tooth a house with a yellow roof.",
  "This tooth was wiggly for so many sleeps.",
  "The tooth came out and I felt older.",
  "I drew sparkles because it was a special day.",
  "My tooth hid in my hand until Mom saw it.",
  "I made a robot to guard it.",
  "The tooth looked like a tiny cloud.",
  "I put the tooth under a pillow and whispered.",
  "I drew a sun because I was happy.",
  "My tooth had a big day.",
  "I made a map so the fairy would not get lost.",
  "It came out after one last wiggle.",
  "I felt the hole with my tongue all day.",
  "The tooth was small and shiny.",
  "I wanted this memory to stay.",
  "My tooth made everybody clap.",
  "I drew myself smiling with one tooth gone.",
  "The tooth finally jumped out.",
  "I put a heart around it because I loved it.",
  "It was my first big kid tooth story.",
  "I made a castle for the tiny tooth.",
  "My tooth came out and I got very quiet.",
  "I drew the night because the tooth was ready.",
  "This is the tooth I want to remember.",
]

const motifs = [
  "rocket",
  "moon",
  "rainbow",
  "robot",
  "pancake",
  "pocket",
  "castle",
  "star",
  "smile",
  "soccer",
  "kitchen",
  "dragon",
  "garden",
  "snow",
  "birthday",
  "bed",
  "crown",
  "space",
  "clover",
  "cookie",
  "treehouse",
  "bus",
  "purple",
  "dance",
  "lamp",
]

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function pick(random, list) {
  return list[Math.floor(random() * list.length)]
}

function jitter(random, value, amount) {
  return value + (random() - 0.5) * amount
}

function crayonLine(random, x1, y1, x2, y2, color, widthValue = 9, repeats = 4) {
  const lines = []
  for (let i = 0; i < repeats; i += 1) {
    lines.push(
      `<path d="M ${jitter(random, x1, 10).toFixed(1)} ${jitter(random, y1, 10).toFixed(1)} C ${jitter(random, (x1 + x2) / 2, 52).toFixed(1)} ${jitter(random, y1, 40).toFixed(1)}, ${jitter(random, (x1 + x2) / 2, 52).toFixed(1)} ${jitter(random, y2, 40).toFixed(1)}, ${jitter(random, x2, 10).toFixed(1)} ${jitter(random, y2, 10).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${widthValue + random() * 4}" stroke-linecap="round" stroke-linejoin="round" opacity="${(0.34 + random() * 0.28).toFixed(2)}" />`,
    )
  }

  return lines.join("\n")
}

function scribble(random, color, cx, cy, radius, loops = 5) {
  const points = []
  for (let i = 0; i <= loops * 16; i += 1) {
    const angle = i * 0.45
    const r = radius * (0.48 + 0.46 * random())
    points.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`)
  }

  return `<polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="${7 + random() * 4}" stroke-linecap="round" stroke-linejoin="round" opacity="0.56" />`
}

function toothPath(random, cx, cy, scale) {
  const wobble = () => (random() - 0.5) * 18
  const leftRoot = 88 + random() * 24
  const rightRoot = 88 + random() * 24
  const p = (dx, dy) => `${(cx + (dx + wobble()) * scale).toFixed(1)} ${(cy + (dy + wobble()) * scale).toFixed(1)}`

  return [
    `M ${p(-82, -70)}`,
    `C ${p(-126, -34)}, ${p(-116, 46)}, ${p(-66, 70)}`,
    `C ${p(-48, leftRoot)}, ${p(-38, 146)}, ${p(-8, 100)}`,
    `C ${p(16, 148)}, ${p(46, rightRoot)}, ${p(66, 70)}`,
    `C ${p(118, 38)}, ${p(118, -40)}, ${p(76, -70)}`,
    `C ${p(32, -100)}, ${p(-34, -98)}, ${p(-82, -70)}`,
    "Z",
  ].join(" ")
}

function wrapWords(text, maxLength = 52) {
  const words = text.split(" ")
  const lines = []
  let line = ""
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxLength && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }

  if (line) lines.push(line)
  return lines.slice(0, 2)
}

function motifSvg(random, motif, palette) {
  const colorA = pick(random, palette.crayon)
  const colorB = pick(random, palette.crayon)
  const colorC = pick(random, palette.crayon)
  const x = 220 + random() * 92
  const y = 285 + random() * 82
  const pieces = []

  if (motif === "rocket") {
    pieces.push(crayonLine(random, x, y + 160, x + 78, y + 36, colorA, 8, 3))
    pieces.push(`<path d="M ${x + 78} ${y + 34} L ${x + 132} ${y + 116} L ${x + 45} ${y + 102} Z" fill="none" stroke="${colorB}" stroke-width="10" stroke-linejoin="round" opacity="0.72" />`)
    pieces.push(`<circle cx="${x + 82}" cy="${y + 83}" r="15" fill="none" stroke="${colorC}" stroke-width="8" opacity="0.7" />`)
  } else if (motif === "moon") {
    pieces.push(`<path d="M ${x + 82} ${y + 48} C ${x + 18} ${y + 80}, ${x + 18} ${y + 178}, ${x + 104} ${y + 204} C ${x + 76} ${y + 162}, ${x + 78} ${y + 100}, ${x + 132} ${y + 64} Z" fill="none" stroke="${colorA}" stroke-width="12" stroke-linejoin="round" opacity="0.74" />`)
  } else if (motif === "rainbow") {
    for (let i = 0; i < 4; i += 1) {
      pieces.push(`<path d="M ${x - 8 + i * 24} ${y + 178} C ${x + 34} ${y + 56}, ${x + 170} ${y + 56}, ${x + 214 - i * 18} ${y + 178}" fill="none" stroke="${palette.crayon[i % palette.crayon.length]}" stroke-width="12" stroke-linecap="round" opacity="0.62" />`)
    }
  } else if (motif === "robot") {
    pieces.push(`<rect x="${x + 28}" y="${y + 58}" width="128" height="118" rx="12" fill="none" stroke="${colorA}" stroke-width="10" opacity="0.7" />`)
    pieces.push(`<circle cx="${x + 67}" cy="${y + 104}" r="10" fill="${colorB}" opacity="0.72" /><circle cx="${x + 119}" cy="${y + 104}" r="10" fill="${colorB}" opacity="0.72" />`)
    pieces.push(crayonLine(random, x + 56, y + 146, x + 130, y + 146, colorC, 7, 2))
  } else if (motif === "castle" || motif === "treehouse") {
    pieces.push(`<path d="M ${x + 10} ${y + 186} L ${x + 10} ${y + 88} L ${x + 50} ${y + 50} L ${x + 90} ${y + 88} L ${x + 90} ${y + 186} M ${x + 90} ${y + 186} L ${x + 90} ${y + 112} L ${x + 146} ${y + 78} L ${x + 202} ${y + 112} L ${x + 202} ${y + 186}" fill="none" stroke="${colorA}" stroke-width="10" stroke-linejoin="round" opacity="0.72" />`)
    pieces.push(`<path d="M ${x + 72} ${y + 186} L ${x + 72} ${y + 145} Q ${x + 92} ${y + 122} ${x + 112} ${y + 145} L ${x + 112} ${y + 186}" fill="none" stroke="${colorB}" stroke-width="8" opacity="0.68" />`)
  } else if (motif === "soccer") {
    pieces.push(`<circle cx="${x + 98}" cy="${y + 114}" r="74" fill="none" stroke="${colorA}" stroke-width="10" opacity="0.72" />`)
    pieces.push(`<path d="M ${x + 98} ${y + 64} L ${x + 134} ${y + 102} L ${x + 118} ${y + 154} L ${x + 74} ${y + 154} L ${x + 58} ${y + 102} Z" fill="none" stroke="${colorB}" stroke-width="8" opacity="0.65" />`)
  } else if (motif === "dragon") {
    pieces.push(crayonLine(random, x + 20, y + 148, x + 192, y + 104, colorA, 11, 4))
    pieces.push(`<path d="M ${x + 110} ${y + 96} L ${x + 146} ${y + 54} L ${x + 152} ${y + 114}" fill="none" stroke="${colorB}" stroke-width="9" stroke-linejoin="round" opacity="0.7" />`)
    pieces.push(`<circle cx="${x + 196}" cy="${y + 102}" r="12" fill="${colorC}" opacity="0.78" />`)
  } else if (motif === "garden" || motif === "clover") {
    for (let i = 0; i < 4; i += 1) {
      const px = x + 38 + i * 38
      pieces.push(crayonLine(random, px, y + 190, px, y + 88 + random() * 36, colorA, 6, 2))
      pieces.push(`<circle cx="${px - 12}" cy="${y + 88 + random() * 44}" r="16" fill="none" stroke="${colorB}" stroke-width="7" opacity="0.66" />`)
      pieces.push(`<circle cx="${px + 13}" cy="${y + 86 + random() * 44}" r="16" fill="none" stroke="${colorC}" stroke-width="7" opacity="0.66" />`)
    }
  } else if (motif === "bed") {
    pieces.push(`<path d="M ${x + 10} ${y + 156} L ${x + 210} ${y + 156} L ${x + 210} ${y + 98} L ${x + 56} ${y + 98} L ${x + 56} ${y + 156} M ${x + 10} ${y + 88} L ${x + 10} ${y + 184}" fill="none" stroke="${colorA}" stroke-width="10" stroke-linejoin="round" opacity="0.7" />`)
    pieces.push(`<circle cx="${x + 76}" cy="${y + 82}" r="22" fill="none" stroke="${colorB}" stroke-width="8" opacity="0.64" />`)
  } else if (motif === "bus") {
    pieces.push(`<rect x="${x + 16}" y="${y + 82}" width="198" height="102" rx="18" fill="none" stroke="${colorA}" stroke-width="10" opacity="0.7" />`)
    pieces.push(`<circle cx="${x + 66}" cy="${y + 188}" r="17" fill="none" stroke="${colorB}" stroke-width="8" opacity="0.7" />`)
    pieces.push(`<circle cx="${x + 166}" cy="${y + 188}" r="17" fill="none" stroke="${colorB}" stroke-width="8" opacity="0.7" />`)
  } else if (motif === "lamp") {
    pieces.push(`<path d="M ${x + 104} ${y + 62} L ${x + 156} ${y + 140} L ${x + 52} ${y + 140} Z M ${x + 104} ${y + 140} L ${x + 104} ${y + 204}" fill="none" stroke="${colorA}" stroke-width="10" stroke-linejoin="round" opacity="0.72" />`)
    pieces.push(`<circle cx="${x + 104}" cy="${y + 104}" r="28" fill="${palette.glow}" opacity="0.28" />`)
  } else if (motif === "smile" || motif === "dance") {
    pieces.push(`<circle cx="${x + 102}" cy="${y + 106}" r="76" fill="none" stroke="${colorA}" stroke-width="10" opacity="0.72" />`)
    pieces.push(`<circle cx="${x + 76}" cy="${y + 92}" r="9" fill="${colorB}" opacity="0.78" /><circle cx="${x + 132}" cy="${y + 92}" r="9" fill="${colorB}" opacity="0.78" />`)
    pieces.push(`<path d="M ${x + 62} ${y + 126} Q ${x + 104} ${y + 166} ${x + 150} ${y + 126}" fill="none" stroke="${colorC}" stroke-width="9" stroke-linecap="round" opacity="0.68" />`)
  } else if (motif === "birthday" || motif === "cookie" || motif === "pancake") {
    pieces.push(`<ellipse cx="${x + 112}" cy="${y + 146}" rx="92" ry="42" fill="none" stroke="${colorA}" stroke-width="10" opacity="0.7" />`)
    pieces.push(`<path d="M ${x + 42} ${y + 116} C ${x + 78} ${y + 70}, ${x + 148} ${y + 70}, ${x + 188} ${y + 116}" fill="none" stroke="${colorB}" stroke-width="9" opacity="0.64" />`)
    pieces.push(scribble(random, colorC, x + 112, y + 116, 38, 2))
  } else {
    const starX = x + 110
    const starY = y + 120
    pieces.push(`<path d="M ${starX} ${starY - 82} L ${starX + 24} ${starY - 18} L ${starX + 92} ${starY - 18} L ${starX + 36} ${starY + 18} L ${starX + 58} ${starY + 82} L ${starX} ${starY + 42} L ${starX - 58} ${starY + 82} L ${starX - 36} ${starY + 18} L ${starX - 92} ${starY - 18} L ${starX - 24} ${starY - 18} Z" fill="none" stroke="${colorA}" stroke-width="10" stroke-linejoin="round" opacity="0.7" />`)
  }

  return pieces.join("\n")
}

function backgroundMarks(random, palette) {
  const marks = []
  for (let i = 0; i < 24; i += 1) {
    const color = pick(random, palette.crayon)
    const x = 96 + random() * 832
    const y = 150 + random() * 820
    if (random() > 0.46) {
      marks.push(crayonLine(random, x, y, x + (random() - 0.5) * 150, y + (random() - 0.5) * 120, color, 5 + random() * 4, 1))
    } else {
      marks.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(7 + random() * 18).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(4 + random() * 4).toFixed(1)}" opacity="${(0.18 + random() * 0.22).toFixed(2)}" />`)
    }
  }

  return marks.join("\n")
}

function makeSvg(index) {
  const seed = 41000 + index * 997
  const random = mulberry32(seed)
  const palette = palettes[index % palettes.length]
  const motif = motifs[index % motifs.length]
  const title = `${titles[index % titles.length]} ${Math.floor(index / titles.length) ? Math.floor(index / titles.length) + 1 : ""}`.trim()
  const story = prompts[index % prompts.length]
  const crayonA = pick(random, palette.crayon)
  const crayonB = pick(random, palette.crayon)
  const toothFill = index % 3 === 0 ? "#fffdf0" : index % 3 === 1 ? "#f9f2dc" : "#fbfbff"
  const toothStroke = pick(random, palette.crayon)
  const toothScale = 0.82 + random() * 0.16
  const toothX = 540 + (random() - 0.5) * 120
  const toothY = 560 + (random() - 0.5) * 110
  const moonX = 742 + random() * 120
  const moonY = 150 + random() * 80
  const storyLines = wrapWords(story)

  const tl = `TL-S${String(index + 1).padStart(3, "0")}`
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(`${tl} ${title}`)}">
  <defs>
    <radialGradient id="paperGlow" cx="50%" cy="38%" r="70%">
      <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.62" />
      <stop offset="48%" stop-color="${palette.wash}" stop-opacity="0.36" />
      <stop offset="100%" stop-color="${palette.paper}" stop-opacity="1" />
    </radialGradient>
    <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="${(0.012 + random() * 0.008).toFixed(4)}" numOctaves="4" seed="${seed}" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#paperGlow)" />
  <rect x="42" y="42" width="940" height="1196" rx="58" fill="none" stroke="${palette.ink}" stroke-opacity="0.14" stroke-width="4" />
  <circle cx="${moonX.toFixed(1)}" cy="${moonY.toFixed(1)}" r="${(40 + random() * 18).toFixed(1)}" fill="${palette.glow}" opacity="0.36" />
  <g filter="url(#rough)" opacity="0.92">
    ${backgroundMarks(random, palette)}
    ${motifSvg(random, motif, palette)}
    <path d="${toothPath(random, toothX, toothY, toothScale)}" fill="${toothFill}" stroke="${toothStroke}" stroke-width="14" stroke-linejoin="round" opacity="0.92" />
    <path d="${toothPath(random, toothX + 8, toothY + 4, toothScale * 0.78)}" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linejoin="round" opacity="0.12" />
    ${scribble(random, crayonA, 510 + random() * 120, 780 + random() * 90, 72 + random() * 42, 3)}
    ${crayonLine(random, 214, 936, 794, 888, crayonB, 10, 3)}
    ${crayonLine(random, 198, 988, 862, 1034, crayonA, 7, 2)}
  </g>
  <g>
    <rect x="96" y="88" width="188" height="52" rx="26" fill="${palette.ink}" opacity="0.78" />
    <text x="124" y="123" fill="${palette.glow}" font-family="Verdana, sans-serif" font-size="24" font-weight="900" letter-spacing="3">${tl}</text>
    <text x="96" y="1110" fill="${palette.ink}" font-family="Georgia, serif" font-size="56" font-weight="800">${escapeXml(title)}</text>
    ${storyLines.map((line, lineIndex) => `<text x="98" y="${1172 + lineIndex * 36}" fill="${palette.ink}" opacity="0.78" font-family="Verdana, sans-serif" font-size="30">${escapeXml(line)}</text>`).join("\n    ")}
    <text x="100" y="1218" fill="${palette.ink}" opacity="0.38" font-family="Verdana, sans-serif" font-size="20" font-weight="800" letter-spacing="3">SAMPLE TOOTHLIGHT - PROCEDURAL</text>
  </g>
</svg>
`

  return {
    id: `sample-toothlight-${String(index + 1).padStart(3, "0")}`,
    sampleNumber: index + 1,
    label: "Sample Toothlight",
    title,
    story,
    image: `/toothfairy/sample-toothlights/sample-toothlight-${String(index + 1).padStart(3, "0")}.svg`,
    alt: `${title} sample Toothlight with childlike crayon marks and a central tooth memory`,
    href: `/toothfairy/sample-toothlights/sample-toothlight-${String(index + 1).padStart(3, "0")}.svg`,
    seed,
    palette: palette.name,
    motif,
    svg,
  }
}

mkdirSync(assetDir, { recursive: true })

const samples = []
for (let index = 0; index < count; index += 1) {
  const sample = makeSvg(index)
  writeFileSync(join(assetDir, `sample-toothlight-${String(index + 1).padStart(3, "0")}.svg`), sample.svg)
  const { svg, ...data } = sample
  samples.push(data)
}

const dataSource = `export const sampleToothlights = ${JSON.stringify(samples, null, 2)} as const;

export type SampleToothlight = (typeof sampleToothlights)[number];
`

writeFileSync(dataFile, dataSource)

console.log(`Generated ${samples.length} sample Toothlights.`)
