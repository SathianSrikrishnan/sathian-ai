import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const headerSource = readFileSync('src/components/toothfairy/nav/tfn-header.tsx', 'utf8');
const footerSource = readFileSync('src/components/toothfairy/nav/tfn-footer.tsx', 'utf8');
const drawLayoutSource = readFileSync('src/app/toothfairy/app/draw/layout.tsx', 'utf8');
const canvasSource = readFileSync('src/components/toothfairy/app/drawing-canvas-v2.tsx', 'utf8');

test('draw flow hides the marketing header and footer chrome', () => {
  assert.match(drawLayoutSource, /\.tfn-header,\s*\.tfn-footer/);
  assert.match(drawLayoutSource, /display:\s*none\s*!important/);
  assert.doesNotMatch(headerSource, /usePathname/);
  assert.doesNotMatch(footerSource, /usePathname/);
});

test('draw canvas owns the viewport above site chrome', () => {
  assert.match(canvasSource, /zIndex:\s*80/);
  assert.match(canvasSource, /height:\s*['"]100dvh['"]/);
  assert.match(canvasSource, /overflow:\s*['"]hidden['"]/);
});

test('draw canvas uses viewport-height sizing instead of full page width', () => {
  assert.match(
    canvasSource,
    /width:\s*['"]min\(92vw, calc\(100dvh - 350px\), 720px\)['"]/
  );
});
