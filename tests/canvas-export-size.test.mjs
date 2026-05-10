import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const exportSource = readFileSync('src/lib/toothfairy/canvas-export.ts', 'utf8');

test('canvas export falls back to bounded JPEG for complex photo-backed art', () => {
  assert.match(exportSource, /MAX_EXPORT_BYTES\s*=\s*2_000_000/);
  assert.match(exportSource, /toDataURL\('image\/jpeg',\s*quality\)/);
  assert.match(exportSource, /while\s*\(\s*sizeBytes\s*>\s*MAX_EXPORT_BYTES/);
});
