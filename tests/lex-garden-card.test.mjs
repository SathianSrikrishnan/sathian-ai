import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(
  new URL("../src/app/page.tsx", import.meta.url),
  "utf8",
);

test("the projects section presents Lex Rooftop Garden as a live visual project", () => {
  assert.match(pageSource, /Lex Rooftop Garden/);
  assert.match(pageSource, /garden\.sathian\.ai/);
  assert.match(pageSource, /lex-rooftop-aerial\.jpg/);
  assert.match(pageSource, /open\.toronto\.ca\/open-data-licence/);
});
