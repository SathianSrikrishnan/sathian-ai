import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(repoRoot, 'public', 'story-assets', 'viking-origin', '_proofs')
const model = 'gemini-3.1-flash-image-preview'

const refs = {
  adultTanda: join(repoRoot, 'public', 'story-assets', 'refs', 'ref-01-tanda.jpg'),
  fatherRef: join(repoRoot, 'public', 'story-assets', 'refs', 'ref-03-father.jpg'),
  fatherFrame: join(repoRoot, 'public', 'story-assets', 'viking-origin', 'vo-02-father.png'),
  promiseFrame: join(repoRoot, 'public', 'story-assets', 'viking-origin', 'vo-08-promise.png'),
  villageFrame: join(repoRoot, 'public', 'story-assets', 'viking-origin', 'vo-01-village.png'),
  triptychMood: 'C:\\Users\\sathi\\kai\\context\\projects\\active\\tfn-art\\frames\\story-01\\f14-triptych.png',
}

const generated = {
  youngTanda: join(outDir, 's2-ref-young-tanda-full.png'),
  father: join(outDir, 's2-ref-father-shipbuilder.png'),
  boy: join(outDir, 's2-ref-boy-across-water.png'),
  shipyard: join(outDir, 's2-ref-shipyard-world.png'),
}

const jobs = [
  {
    id: 'young-tanda',
    output: generated.youngTanda,
    aspectRatio: '9:16',
    refs: [refs.adultTanda, refs.promiseFrame],
    prompt: `Create a full-body character reference of Young Tanda at age seven, before she has wings. She has warm brown eyes, chestnut-brown wavy hair with the same family resemblance as the supplied adult Tanda reference, a small gap where one front tooth has just come out, and a direct, stubborn, curious expression. She wears a practical rust-brown wool tunic dress over a cream underlayer, simple leather belt, scuffed child-sized boots, and small traces of wood dust from the shipyard.

She stands in a relaxed neutral pose on a simple warm gray studio floor, hands visible, body fully in frame, with enough space around her for use as a character reference. Use the current TFN soft cinematic 3D storybook style from the supplied references: warm expressive face, natural textile detail, subtle painterly softness in the lighting, and gentle amber highlights. The image is clean and text-free.`
  },
  {
    id: 'young-tanda-expressions',
    output: join(outDir, 's2-ref-young-tanda-expressions.png'),
    aspectRatio: '16:9',
    refs: [generated.youngTanda, refs.adultTanda],
    prompt: `Create an expression sheet for the same Young Tanda character, age seven, preserving her chestnut wavy hair, warm brown eyes, missing front tooth, rust wool tunic, and childlike proportions. Show four bust portraits side by side on one clean warm neutral background: proud helper, annoyed patience, secretly worried, and gap-toothed wonder.

Each expression should be clear enough for a parent and child to read instantly. Keep the same soft cinematic 3D storybook character style as the TFN references, with warm skin shading, soft catchlights in the eyes, and natural wool texture. The image is clean and text-free, with no labels above the portraits.`
  },
  {
    id: 'father-shipbuilder',
    output: generated.father,
    aspectRatio: '9:16',
    refs: [refs.fatherRef, refs.fatherFrame],
    prompt: `Create a full-body character reference of Tanda's father, preserving the face, warmth, broad build, kind eyes, brown hair and beard quality, leather work vest, cream wool shirt, and shipbuilder presence from the supplied father references. He is a maker first: rope-callused hands, practical leather bracers, shipwright tools at his belt, wool trousers, sturdy boots, and wood dust on his hands. He should feel strong but gentle, with the kind of adult who kneels to a child's eye level.

Update the tooth-carrying detail: instead of a bare tooth on a string, he has a tiny carved oak tooth-keeper, shaped like a curved ship rib, tucked into a small inside-chest pouch near his heart. It may be visible only as a small carved object in his open palm or partly tucked into the vest. He stands in a simple shipyard reference pose, full body centered, in the current TFN soft cinematic 3D storybook style with amber shipyard light and slate-blue sea shadows. The image is clean and text-free.`
  },
  {
    id: 'boy-across-water',
    output: generated.boy,
    aspectRatio: '9:16',
    refs: [generated.youngTanda, generated.father],
    prompt: `Create a full-body character reference of the boy across the water, age seven or eight, from another northern coastal village. He has wind-tossed dark blond hair, wary eyes, a practical patched wool tunic in muted blue-gray, short cloak, bare cold ankles, and hands that look like he has been helping repair boats. He is frightened but not pitiful: his posture says he might run, but his face says he is trying to be brave.

Place him on a simple neutral studio background with a faint suggestion of cold shore light. Preserve the same soft cinematic 3D storybook style as the approved Story 2 references, with readable child emotion, natural wool and leather textures, and gentle sea-blue shadows. The image is clean and text-free.`
  },
  {
    id: 'shipyard-world',
    output: generated.shipyard,
    aspectRatio: '9:16',
    refs: [refs.villageFrame, refs.fatherFrame, refs.triptychMood].filter(existsSync),
    prompt: `Create a vertical environment reference for a Viking-age coastal shipyard where Tanda's childhood story begins. Curved oak ship ribs rise from the beach beside rough planks, rope coils, hand tools, pine pitch pots, a small fire, stacked wool blankets, and a cold slate-blue sea beyond. The place feels handmade and working, not royal or ceremonial.

Frame the shipyard as a mobile storybook establishing image, with a clear path through the foreground where a small child could walk and warm amber light catching the oak. Use the same current TFN soft cinematic 3D storybook visual style as the supplied Viking-origin references, with a touch of painterly softness in fog and sky. The image is clean and text-free.`
  },
]

function loadApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
  const envPath = join(homedir(), '.nano-banana', '.env')
  if (!existsSync(envPath)) return ''
  const line = readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .find(value => value.trim().startsWith('GEMINI_API_KEY='))
  return line ? line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '') : ''
}

function mimeType(filePath) {
  const ext = extname(filePath).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  return 'image/png'
}

function imagePart(filePath) {
  const data = readFileSync(filePath).toString('base64')
  return { inlineData: { data, mimeType: mimeType(filePath) } }
}

async function generate(job, apiKey) {
  for (const ref of job.refs) {
    if (!existsSync(ref)) throw new Error(`Missing reference for ${job.id}: ${ref}`)
  }

  const parts = [
    ...job.refs.map(imagePart),
    { text: job.prompt },
  ]

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      imageConfig: {
        aspectRatio: job.aspectRatio,
        imageSize: '2K',
      },
    },
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Gemini request failed for ${job.id}: ${response.status} ${response.statusText}\n${text.slice(0, 1200)}`)
  }

  const json = JSON.parse(text)
  const partsOut = json.candidates?.[0]?.content?.parts || []
  const image = partsOut.find(part => part.inlineData?.data || part.inline_data?.data)
  if (!image) {
    throw new Error(`No image returned for ${job.id}. Response: ${text.slice(0, 1200)}`)
  }

  const inlineData = image.inlineData || image.inline_data
  mkdirSync(dirname(job.output), { recursive: true })
  writeFileSync(job.output, Buffer.from(inlineData.data, 'base64'))
  console.log(`${job.id}: ${job.output}`)
}

const apiKey = loadApiKey()
if (!apiKey) {
  console.error('GEMINI_API_KEY was not found in the environment or ~/.nano-banana/.env')
  process.exit(1)
}

const onlyArg = process.argv.find(arg => arg.startsWith('--only='))
const only = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',').map(value => value.trim())) : null
const selected = only ? jobs.filter(job => only.has(job.id)) : jobs

if (selected.length === 0) {
  console.error(`No matching jobs. Available: ${jobs.map(job => job.id).join(', ')}`)
  process.exit(1)
}

console.log(`Generating ${selected.length} Story 2 Gate 1 proof image${selected.length === 1 ? '' : 's'}...`)
console.log(`Output folder: ${outDir}`)

for (const job of selected) {
  console.log(`Starting ${job.id} with ${job.refs.map(ref => basename(ref)).join(', ')}`)
  await generate(job, apiKey)
}
