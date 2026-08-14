# Sathian.ai release workflow

Last updated: 2026-08-14

## One active source

- Canonical website worktree: `C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release`
- Release branch: `main`
- Production site: `https://sathian.ai`
- Do not edit or deploy from `C:\Users\sathi\Projects\sathian-ai\main`.

## Publish a Draw with Tanda episode

1. Publish the approved master to the official Tooth Fairy Network YouTube channel.
2. Verify the public watch page and copy the real YouTube video ID.
3. Add or update one record in `src/content/site-releases.ts`.
4. Set `status: 'published'` only when the watch page is public and the publication date and video ID are known.
5. Run the release-channel test. The homepage, Draw with Tanda page, structured data, and site-agent memory all update from the same registry.

## What gets pushed to this site

The portfolio is a front door, not a copy of every project repository. Project work stays in its own canonical repository and deployment. Update `sathian.ai` only when the public-facing record changes.

| Change | Where it happens first | When Sathian.ai changes |
| --- | --- | --- |
| Project code, dashboard data, or internal workflow | The project's own canonical repository | No portfolio release unless its public URL, name, status, image, or summary changes. |
| Draw with Tanda episode | Character Studio and the TFN YouTube channel | After the episode is publicly verified, update the single release record. |
| Tooth Fairy Network product work | The TFN canonical repository | Update the portfolio only for a meaningful public milestone or new destination. |
| Writing | The reviewed article source or Studio publishing flow | Published writing is read by the site automatically; change homepage framing only when editorial priorities change. |
| Hackathon project | Its own source repository and public deployment | Update `/hackathons` when the name, evidence, live link, or project status changes. |
| Chatbot knowledge | Reviewed public profile, release registry, or build-note source | Release when the public answer should materially change. Never mirror private project context. |

## Same-day content checklist

Use this checklist when an article, web app, and YouTube episode are being released together:

1. **Article:** publish through the reviewed Studio/database flow, verify the public article URL, then update the newest-writing cards in `src/lib/public-profile.ts`. The writing page is database-backed, but newest-writing chatbot context is still reviewed source code until the content-publication unifier is built.
2. **Web app:** deploy it from its own repository, verify its public URL, then add or update its reviewed portfolio record in `src/content/site-projects.ts`.
3. **Draw with Tanda:** publish to the official YouTube channel, verify the video ID and watch page, then add or update the episode in `src/content/site-releases.ts`.
4. Run the release gate below, commit only the reviewed records, and push `main`.
5. Read the `Site Agent Quality` receipts. A green source gate alone is not enough; the protected-preview 10-case canary and browser verifier must also pass.
6. Deploy production only after explicit approval, then confirm the next daily three-case production receipt.

Projects and Draw with Tanda releases already generate public agent memory from their registries. Article-to-agent synchronization is the remaining manual step and the next automation milestone.

Every Sathian.ai production change follows the same path: update the canonical `main` worktree, test, commit, push, deploy, verify, and record the receipt. Ongoing work in another repository never auto-merges into the portfolio.

## Release gate

```powershell
# Source / context:
# Sathian.ai canonical production release worktree

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release"

# Commands:
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
npm run test:unit
npm run build
git diff --check
```

The two commit hashes must match before release work begins. Preserve unrelated dirty or untracked files and stage only the intended release.

## Production release

Production deployment requires Sathian's explicit approval for that release.

```powershell
# Source / context:
# Tested Sathian.ai release after explicit production approval

cd "C:\Users\sathi\Projects\sathian-ai\worktrees\hackathon-portfolio-release"

# Commands:
git push origin main
npx vercel --prod --yes
```

After deployment, verify `/`, `/projects/tooth-fairy-network/draw-with-tanda`, `/projects/clinicalguard`, `/writings`, `/hackathons`, `/robots.txt`, and `/sitemap.xml`. Update `ACTIVE-WORKTREE.md` with the production commit and deployment receipt.

## Measurement contract

GA4 and Vercel Analytics receive privacy-safe funnel events from `src/lib/site-analytics.ts`. They do not receive question text, contact details, filenames, or file contents. Use `docs/analytics/chatbar-measurement-exercise.md` for the post-release check.

The separate 08:00 Telegram analytics digest remains in the protected `codex/website-analytics-digest-20260719` worktree. Updating or deploying that Worker is a separate production release, not part of a website deploy.

## Automated Site Agent gate

GitHub workflow: [Site Agent Quality](https://github.com/SathianSrikrishnan/sathian-ai/actions/workflows/site-agent-quality.yml)

- Push or internal pull request: unit tests, 60-case offline evaluation, production build, frozen protected preview, 10-case live canary, and desktop/mobile browser proof.
- Daily at `13:17 UTC`: 60-case source gate plus exactly three production questions covering projects/web apps, writing, and the latest Draw with Tanda release.
- Manual dispatch: the same bounded production smoke or an explicitly selected full 10-case canary.
- Live runs cannot submit notes and stop at the first HTTP 429.
- GitHub retains privacy-safe receipts and browser screenshots for 30 days.

Setup and proof receipt: `docs/operations/2026-08-14-site-agent-quality-automation-receipt.md`.

## Cleanup rule

Do not delete a worktree merely because its branch is old. Remove it only after all three are true:

1. The worktree is clean.
2. Its commit is merged into `main`, or its unique work has been explicitly archived.
3. Sathian approves the exact removal list.
