import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const resultPage = readFileSync('src/app/toothfairy/app/draw/result/page.tsx', 'utf8');
const appPage = readFileSync('src/app/toothfairy/app/page.tsx', 'utf8');

test('keeping a Magic Studio result stores a main-app handoff state', () => {
  assert.match(resultPage, /const FLOW_STORAGE_KEY = ['"]tfn-flow-state['"]/);
  assert.match(resultPage, /localStorage\.setItem\(\s*FLOW_STORAGE_KEY,\s*JSON\.stringify/);
  assert.match(resultPage, /previewImage:\s*finalImage/);
  assert.match(resultPage, /fromMagicStudio:\s*true/);
  assert.match(resultPage, /step:\s*['"]setup['"]/);
});

test('main app treats Magic Studio artwork as already-created art', () => {
  assert.match(appPage, /const FINAL_DRAWING_KEY = ['"]toothfairy-final-drawing['"]/);
  assert.match(appPage, /setMagicArtworkReady\(true\)/);
  assert.match(appPage, /state\?\.fromMagicStudio/);
  assert.match(appPage, /magicArtworkReady\s*\?\s*setStep\(["']tell["']\)\s*:\s*setStep\(["']create["']\)/);
});

test('main app uses a simplified details page after Magic Studio', () => {
  assert.match(appPage, /magicArtworkReady \? "Keepsake details" : "Begin"/);
  assert.match(appPage, /magicArtworkReady \? "Who is this keepsake for\?" : "Save the tooth moment\."/);
  assert.match(appPage, /!magicArtworkReady && <ProductPromiseCard \/>/);
  assert.match(appPage, /Optional child photo/);
  assert.match(appPage, /This is optional and can be added later/);
});

test('auth redirects preserve the Magic Studio handoff', () => {
  assert.match(appPage, /fromMagicStudio:\s*magicArtworkReady/);
  assert.match(appPage, /previewImage/);
});
