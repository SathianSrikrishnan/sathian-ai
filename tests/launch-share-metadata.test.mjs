import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const toothfairyLayout = readFileSync('src/app/toothfairy/layout.tsx', 'utf8');
const keepsakeLayout = readFileSync(
  'src/app/toothfairy/keepsake/[id]/layout.tsx',
  'utf8'
);
const keepsakeOgImage = readFileSync(
  'src/app/toothfairy/keepsake/[id]/opengraph-image.tsx',
  'utf8'
);

test('Tooth Fairy root share metadata points to a real OG image route', () => {
  assert.match(toothfairyLayout, /metadataBase:\s*new URL\(['"]https:\/\/toothfairy\.network['"]\)/);
  assert.match(toothfairyLayout, /url:\s*['"]\/toothfairy\/opengraph-image['"]/);
  assert.match(toothfairyLayout, /twitter:\s*{/);
  assert.match(toothfairyLayout, /card:\s*['"]summary_large_image['"]/);
  assert.ok(existsSync('src/app/toothfairy/opengraph-image.tsx'));
});

test('keepsake pages generate child-specific share metadata', () => {
  assert.match(keepsakeLayout, /generateMetadata/);
  assert.match(keepsakeLayout, /getKeepsakeData/);
  assert.match(keepsakeLayout, /\$\{childName\}'s tooth memory/);
  assert.match(
    keepsakeLayout,
    /const imageUrl = `\/toothfairy\/keepsake\/\$\{params\.id\}\/opengraph-image`/
  );
  assert.match(keepsakeLayout, /twitter:\s*{/);
  assert.match(keepsakeLayout, /summary_large_image/);
});

test('keepsake OG image avoids unsupported color syntax that can blank cards', () => {
  assert.doesNotMatch(keepsakeOgImage, /oklch\(/);
  assert.match(keepsakeOgImage, /#[0-9A-Fa-f]{6}/);
});
