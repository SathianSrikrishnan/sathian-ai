import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const posePackPage = readFileSync('src/app/animation/tanda-pose-pack/page.tsx', 'utf8');

test('draft pose-pack page does not bundle the public directory into a function', () => {
  assert.doesNotMatch(posePackPage, /from ['"]node:fs['"]/);
  assert.doesNotMatch(posePackPage, /from ['"]node:path['"]/);
  assert.doesNotMatch(posePackPage, /fs\.existsSync/);
  assert.doesNotMatch(posePackPage, /dynamic = ['"]force-dynamic['"]/);
  assert.doesNotMatch(posePackPage, /runtime = ['"]nodejs['"]/);
});
