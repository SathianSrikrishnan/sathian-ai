import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const appPage = readFileSync('src/app/toothfairy/app/page.tsx', 'utf8');
const mintRoute = readFileSync('src/app/api/toothfairy/mint/route.ts', 'utf8');

test('Magic Studio hosted images are sent to mint as imageUrl', () => {
  assert.match(appPage, /const imageUrl = compressedPreview/);
  assert.match(appPage, /compressedPreview\.startsWith\("data:"\)\s*\?\s*undefined\s*:\s*compressedPreview/);
  assert.match(appPage, /imageUrl,/);
});

test('mint route uploads hosted image URLs instead of placeholder metadata', () => {
  assert.match(mintRoute, /imageUrl/);
  assert.match(mintRoute, /fetchRemoteImage/);
  assert.match(mintRoute, /new URL\(imageUrl\)/);
  assert.match(mintRoute, /artImageBuffer/);
  assert.match(mintRoute, /uploadMetadata\(\s*artImageBuffer/);
  assert.match(mintRoute, /remoteImage\.mimeType/);
});
