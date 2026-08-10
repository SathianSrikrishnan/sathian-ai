# Chat-First Site Relaunch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current broad personal-site homepage with the approved minimal, chat-first three-page system, preserve the existing live site-agent component, and publish truthful project links and official Tooth Fairy Network artwork.

**Architecture:** Keep the existing Next.js App Router, article database, site agent, analytics, API routes, and separate TFN/Studio host routing intact. Replace the human-facing presentation layer with one shared cream-and-ink visual system for Home, Hackathons, and Writing. Retired human pages redirect into the new front door; machine and product routes remain available but unlisted.

**Tech Stack:** Next.js 14 App Router, React 18, existing next/font families, existing ChatWidget portal, Vitest, Vercel.

## Approved site map

| Current surface | New destination | Release action |
| --- | --- | --- |
| `/` | Home | Rebuild as chat-first single scroll: agent, featured work, Solana visual, writing, quiet project archive. |
| `/hackathons` | Hackathons | Keep as a main page; rename Quote Coverage Ledger presentation to AutoQuote Automator and preserve the evidence-backed metrics and live demo. |
| `/writings` | Writing | Keep as a main page with the existing published article URLs and editorial list. |
| `/about` | Home | Remove from human navigation and redirect to `/`. |
| `/automation` | Home | Redirect to `/#agent`; the public site agent becomes the single automation/contact doorway. |
| `/agents` | Agent index | Preserve, unlisted from human navigation. |
| `/links` | Link-in-bio utility | Preserve, unlisted from human navigation. |
| `/btc-atlas` | BTC Cultural Atlas | Preserve the route and link to the canonical live property from the project archive. |
| `/writings/*` | Individual essays | Preserve every public article URL. |
| `/toothfairy/*` and `toothfairy.network` | Tooth Fairy Network product | Preserve untouched; use its official v34 hero poster on sathian.ai. |
| `/studio/*` and `studio.sathian.ai` | Studio | Preserve untouched and unlisted. |
| `/animation/*`, `/voice/*`, API/admin utilities | Internal/product utilities | Preserve untouched and unlisted.

## Task 1: Lock the new public contract in tests

**Files:**
- Modify: `tests/unit/homepage-relaunch.test.ts`
- Modify: `tests/unit/hackathon-portfolio.test.ts`
- Modify: `tests/unit/site-agent-first-editorial.test.ts`

1. Assert that human navigation contains only Home, Hackathons, and Writing.
2. Assert that Home begins with the existing `home-agent-slot`, features Tooth Fairy Network and AutoQuote Automator, includes the Solana observatory, Writing, and the four-item project archive.
3. Assert that Hackathons presents AutoQuote Automator before AgentTab, Tooth Fairy Network, and ClinicalGuard while preserving evidence metrics and strongest proof links.
4. Assert that About and Automation redirect to the new front door.
5. Run the focused tests and confirm the assertions fail for the current implementation.

## Task 2: Build the shared minimal shell

**Files:**
- Modify: `src/components/SiteNav.tsx`
- Modify: `src/app/globals.css`

1. Reduce the desktop and mobile nav to Home, Hackathons, and Writing.
2. Add route-aware active styling without altering the separate TFN navigation.
3. Add a namespaced `minimal-site-*` CSS layer that matches the approved cream paper, black-brown header/footer, rust accent, serif headings, compact mono labels, thin rules, and responsive grids.
4. Preserve all existing chat widget markup, behavior, API wiring, and the current live workshop treatment.

## Task 3: Rebuild the Home page

**Files:**
- Modify: `src/components/home/HomeClient.tsx`
- Add: `public/projects/autoquote-automator-dashboard.png`
- Add: `public/projects/solana-ecosystem-observatory.png`

1. Lead with “The fastest way to reach me is to ask.” and render the unchanged live ChatWidget into `home-agent-slot`.
2. Feature Tooth Fairy Network using `/toothfairy/animation/tfn-tanda-hero-integrated-poster-v34.webp` and the official gold Toothlight mark.
3. Feature AutoQuote Automator using a captured screenshot of the verified public dashboard and its existing production link.
4. Add the source-backed Solana Ecosystem Observatory screenshot and a public snapshot link, while clearly distinguishing network health from adoption claims.
5. Add three writing links and a quiet archive for Lex Rooftop Garden, BTC Cultural Atlas, AgentTab, and ClinicalGuard.
6. Remove the About and newsletter sections from Home.

## Task 4: Refine Hackathons, Writing, and redirects

**Files:**
- Modify: `src/app/hackathons/page.tsx`
- Modify: `src/app/writings/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/automation/page.tsx`

1. Apply the shared minimal page shell to Hackathons and Writing.
2. Rename the featured public presentation to AutoQuote Automator; retain the truthful `15 families / 16 routes`, `44 fields / 43 available`, and `16 routes / 0 premiums` state.
3. Preserve all earlier-submission proof links.
4. Change Writing’s framing to “Writing to understand.” and add a working “Ask the site agent” action.
5. Redirect About to `/` and Automation to `/#agent`.

## Task 5: Verify the tested build

1. Run the focused tests to green.
2. Run the complete unit suite.
3. Run lint/type verification and `npm run build`.
4. Start the local site, verify Home/Hackathons/Writing on desktop and mobile in the selected in-app browser, inspect console warnings/errors, and exercise navigation plus the chat input/reopen state.
5. Compare same-viewport implementation screenshots with the approved mockups in a combined visual input, resolve visible P0/P1/P2 issues, and record `design-qa.md` with `final result: passed`.

## Task 6: Release production

1. Commit only the approved relaunch files and preserve unrelated untracked audit screenshots.
2. Push the exact tested commit to `origin/main`.
3. Deploy the linked Vercel project to production.
4. Verify `https://sathian.ai`, `/hackathons`, `/writings`, the site-agent surface, and outbound project links.
5. Record the final deployment receipt and return the production link.
