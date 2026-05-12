import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';

const requiredAssets = [
  'public/story-assets/tanda/v2/s1-frame-02-dinner-late.png',
  'public/story-assets/tanda/v2/s1-frame-07-tandas-route.png',
  'public/story-assets/viking-origin/v2/s2-frame-02-shipyard.png',
  'public/story-assets/viking-origin/v2/s2-frame-04-pitch-v4.png',
  'public/story-assets/ratoncito-perez/v2/rp3-frame-02-wobble-merienda.png',
  'public/story-assets/ratoncito-perez/v2/rp3-frame-10-tanda-arrives.png',
];

test('launch story reader image assets are present for the first trilogy', () => {
  for (const asset of requiredAssets) {
    assert.ok(existsSync(asset), `${asset} should be deployed with the app`);
  }
});
