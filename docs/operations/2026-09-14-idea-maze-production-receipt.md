# Idea Maze writing discovery and agent release

Owner explicitly requested correction of the incomplete article release: homepage summary/image/quicklink and latest-writing chatbot context were missing. Existing publication/deployment approval applies to this repair.

- Live site: https://sathian.ai/ ; article https://sathian.ai/writings/building-in-public-is-an-idea-maze ; Substack https://sathians.substack.com/p/building-in-public-is-an-idea-maze .
- Exact production commit: `49e5180fbebdf237e4a0901413cb44b581d33cb7`.
- Deployment: `dpl_5RNwWiim2SnvrVromLZauphGeYYe`, https://sathian-op4wr7smb-sathiansrikrishnans-projects.vercel.app . Promoted successfully under the existing team scope after READY.
- Rollback: `dpl_Aqk8AocEpeJXBh3Sq1oZMDKD9q1o`, prior production58dafb7.

The reviewed `src/content/latest-writing.ts` record now feeds homepage feature and public agent context. Approved paper/brass image is included in this exact Git commit. Latest-writing intent returns the newest essay and article action instead of a general index or unrelated video. Older features remain.

Full local `release:verify` passed:432 tests,60/60 offline evaluation, critical dependency gate, production build, public-page/security/mobile checks and actual sound playback. Frozen GitHub [Site Agent Quality34916232256](https://github.com/SathianSrikrishnan/sathian-ai/actions/runs/34916232256) passed including protected10-case canary and browser/sound verifiers. No unrelated dirty/untracked files were staged. Deployment was created from exact Git source, correct repo1201344996, with autoAssignCustomDomains:false, then promoted; no dirty-tree upload.

Actual live in-app browser verification: homepage first feature has approved title, summary, image and Read the essay action; image loaded with835px natural width. At1440px and390px, document width1432/382 respectively, no horizontal overflow; desktop/mobile visual layout checked. Asked actual live chatbot “What is your latest writing?” and received “Newest featured writing: Building in Public Is an Idea Maze. Agents, context, wrong turns—and learning to put the work out there.” with Read the latest essay action to the correct article. Clicked homepage essay action and verified its direct Substack footer link. Eight required routes/assets returnedHTTP200. Temporary viewport reset.

The earlier localhost3198 interaction returned an origin restriction; it was not counted as successful chatbot verification. Production verification above succeeded without weakening origin checks.

Database-to-record promotion is still supervised. This release does not establish unattended article/social publication. Full editorial campaign also needs Stanley and Telegram proofs, tracked in [the owning correction brief](../../../../../_ops/sathian-ai-editorial/runs/2026-09-14-stanley-build-in-public/v3/RELEASE-CORRECTION.md). The website engineering repair is complete; Telegram delivery is a distinct pending stage.
