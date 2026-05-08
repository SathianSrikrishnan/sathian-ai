import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import * as ts from 'typescript';

const SCRATCH_VOICE_ID = 'TxGEqnHWrfWFTfGW9XjX';
const require = createRequire(import.meta.url);

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith('--')) continue;
  const key = arg.slice(2);
  const next = process.argv[index + 1];
  if (!next || next.startsWith('--')) {
    args.set(key, 'true');
  } else {
    args.set(key, next);
    index += 1;
  }
}

const repo = process.cwd();
const envPath = path.join(repo, '.env.local');
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

function envValue(name) {
  const match = envText.match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, 'm'));
  return (match?.[1] || process.env[name] || '').trim().replace(/^['"]|['"]$/g, '');
}

const apiKey = envValue('ELEVENLABS_API_KEY');
if (!apiKey) throw new Error('ELEVENLABS_API_KEY is missing from .env.local');

const voiceId =
  args.get('voice-id') ||
  envValue('TANDA_ELEVENLABS_VOICE_ID') ||
  envValue('ELEVENLABS_VOICE_ID') ||
  SCRATCH_VOICE_ID;

const kind = args.get('kind') || 'all';
const limitArg = args.get('limit') || 'all';
const limit = limitArg === 'all' ? Number.POSITIVE_INFINITY : Number(limitArg);
const outDir = path.join(
  repo,
  'public',
  'colosseum-frontier-2026',
  'audio',
  'elevenlabs',
);

fs.mkdirSync(outDir, { recursive: true });

const voiceoverPath = path.join(repo, 'src', 'remotion', 'colosseum', 'voiceover.ts');
const source = fs.readFileSync(voiceoverPath, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const sandbox = {
  exports: {},
  module: { exports: {} },
  require,
};
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(transpiled, sandbox, { filename: voiceoverPath });
const { voiceoverChunks } = sandbox.module.exports;

const selectedKinds =
  kind === 'all' ? ['pitch', 'technical'] : [kind].filter((item) => voiceoverChunks[item]);

if (selectedKinds.length === 0) {
  throw new Error(`Unknown kind: ${kind}`);
}

const generated = [];

for (const selectedKind of selectedKinds) {
  const chunks = voiceoverChunks[selectedKind].slice(0, limit);
  for (const chunk of chunks) {
    const filename = chunk.filename.endsWith('.mp3')
      ? chunk.filename
      : chunk.filename.replace(/\.[^.]+$/, '.mp3');
    const outputPath = path.join(outDir, filename);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: chunk.text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: chunk.speaker === 'tanda' ? 0.58 : 0.5,
            similarity_boost: 0.78,
            style: chunk.speaker === 'tanda' ? 0.42 : 0.25,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `ElevenLabs failed for ${chunk.id} (${response.status}): ${detail}`,
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    generated.push({
      id: chunk.id,
      filename,
      bytes: buffer.length,
    });
  }
}

console.log(JSON.stringify({ voiceId, generated }, null, 2));
