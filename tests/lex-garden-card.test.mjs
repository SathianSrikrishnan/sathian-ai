import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [pageSource, homeClientSource] = await Promise.all([
  readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/home/HomeClient.tsx", import.meta.url), "utf8"),
]);

const homepageSource = `${pageSource}\n${homeClientSource}`;

test("the projects section presents Lex Rooftop Garden as a live visual project", () => {
  assert.match(homepageSource, /Lex Rooftop Garden/);
  assert.match(homepageSource, /garden\.sathian\.ai/);
  assert.match(homepageSource, /lex-rooftop-aerial\.jpg/);
  assert.match(homepageSource, /open\.toronto\.ca\/open-data-licence/);
});
