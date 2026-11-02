# Campaign CSS delivery

`src/app/globals.css` remains the complete, canonical source. Do not delete old page or interaction styles to improve a landing-page score.

`npm run styles:generate` derives `marketing-critical.css` from the home, Village, root shell, chat and404 dependency graph. Class-state selectors and functional/negative selectors remain conservative. All selectors without classes, shared tokens, media conditions, keyframes and Tailwind utilities remain available. Generated rules retain their original order.

Every secondary top-level UI route imports `secondary-surfaces.css` before its route-specific CSS. This file retains all original custom rules in their original order. Secondary routes may download some duplicated shared rules on a cold visit; their original visual cascade is preserved. No route URL, auth boundary, tracking, content or financial behavior changes.

`npm run styles:verify` fails if generated files drift or a new secondary UI route lacks its full stylesheet. The source budget is13KB gzip. Postbuild checks the actual home and Village HTML stylesheet references and enforces25KB total gzip CSS on each. These are deterministic delivery budgets, not a promise of any Lighthouse score.

After changing a campaign dependency or canonical CSS, regenerate and review the output. Compare computed styles and desktop/mobile screenshots; exercise chat, navigation, form mocks and secondary pages. Required hosted checks remain unchanged.

For public acceptance across operating systems, set `PUBLIC_MARKETING_BUILD=true` when running `tests/browser/marketing_performance_check.cjs`. The test identifies the served chat code by its stable accessible input label and verifies absence before intent and presence after opening. CI defaults to the exact local frozen-build chunk manifest. This avoids treating Windows versus Linux bundle hashes as a product failure.

Secondary navigation waits for a click rather than speculatively fetching its full CSS. The primary Village link retains prefetching. Browser checks identify any premature secondary stylesheet response using its non-visual custom-property marker.
