# BlackUnicorn — portfolio & showcase site

Static Next.js 15 (App Router, React 19, TypeScript strict, Tailwind v4, GSAP 3) site with a full-screen video intro. Flat 2D, dark-first, gold `#D4A83A` on ink. No gradients, no glows, no third-party trackers.

> **All copy, projects, metrics, team and partner entries are placeholders.** Nothing in this repo is a real claim about BlackUnicorn. The production build refuses to run until they are replaced (see "Replacing placeholders").

## Run it

```bash
npm install
npm run dev                         # http://localhost:3000
ALLOW_PLACEHOLDERS=1 npm run build  # static export to ./out (preview build)
npm run start                       # serves ./out on :3000
```

Node 20+. Other scripts: `lint`, `typecheck`, `test:unit` (Vitest), `test:e2e` (Playwright + axe; needs a built `out/`), `check:placeholders`, `report:contrast`, `make:brand`.

## Replacing placeholders

Every content record has `placeholder: true`. `npm run build` runs `scripts/check-placeholders.mjs` first and fails while any remain (it prints each file and line). Replace the content, delete the `placeholder: true` flag, and the build passes. `ALLOW_PLACEHOLDERS=1` overrides the gate for previews only. Do not ship an override build.

| File | What to supply |
| --- | --- |
| `src/content/site.ts` | email, location, social links, analytics provider (default `none`) |
| `src/content/projects.ts` | real projects, outcomes, images (add `public/images/...`) |
| `src/content/services.ts`, `process.ts`, `stack.ts` | real services, process, technologies, partners |
| `src/content/team.ts`, `studio.ts`, `metrics.ts`, `notes.ts` | real people, story, values, numbers, articles |
| `src/app/privacy/page.tsx` | lines marked "[to be confirmed]" |

Add a project by appending an object to `projects.ts`; its case-study page, sitemap entry, search entry and work-grid card are generated from it. Metrics must be real and sourced or left out.

## The intro

The intro plays your two videos in `public/videos/`: `Gold Ribbons_Mobile.mp4` on portrait screens (phones) and `Gold Ribbons_PC.mp4` on everything else. To change the intro, replace those files (keep the names, or edit the two paths at the top of `src/components/intro/runtime.ts`). The last frame of each video is saved as `intro-end-mobile.webp` / `intro-end-pc.webp` and is shown instead of the video when motion is reduced or data saver is on; re-export those two when the video changes.

Modes are chosen by a pre-paint script (`src/lib/bootstrap.ts`): every page load, including every refresh, plays the whole video from the first frame to the last (about 10 s); nothing is remembered between loads. Reduced motion = a still of the final frame for about a second. The intro has no buttons (no Skip, no Unmute): the video always plays muted, and Escape ends it early. A refresh also starts the page itself at the top (the browser's saved scroll position and any `#hash` are dropped). If the video cannot start within 5 seconds, or fails, the site is shown instead. Query flags: `?intro=skip` bypasses the intro, `?intro=force` plays it regardless of motion settings. Without JavaScript the overlay never shows. The video file is only downloaded when the intro actually plays.

Tests: Playwright's bundled Chromium cannot decode H.264. To run the video tests there, make small WebM copies and point `INTRO_WEBM_DIR` at them (see the top of `tests/e2e/intro.spec.ts`); otherwise those tests are skipped.

## Brand assets

`npm run make:brand` rebuilds everything in `public/brand/`, `public/favicon.*`, app icons and `public/og/default.png` from the canonical geometry in `src/lib/logo-geometry.ts` (wordmark converted to outlines). These were drawn from the written spec because no logo file was supplied. **Replace them with the real artwork if a vector master exists.**

## Environment

See `.env.example`: `NEXT_PUBLIC_FORM_ENDPOINT` (POST JSON; if empty the contact form falls back to `mailto:`), `ALLOW_PLACEHOLDERS`. Never commit secrets.

## Hosting & security headers

A static export cannot set response headers. `npm run build` writes `out/_headers` (Netlify / Cloudflare Pages format) with nosniff, Referrer-Policy, Permissions-Policy, COOP, HSTS, long-cache rules for hashed assets, and a **per-page CSP with sha256 hashes** of each page's inline scripts. It ships as `Content-Security-Policy-Report-Only`; after checking the browser console on the real domain, build with `CSP_ENFORCE=1` to enforce. `node scripts/verify-csp.mjs` (with `npx serve out -l 4173` running) loads every route under the enforced policy and fails on violations. On other hosts, translate `_headers` to that host's syntax. Per-page CSP lines are close to the 2,000-character cap some hosts apply (longest ≈ 1,970); if content grows, move to nonce-based CSP on an edge function.

## Quality targets and status

WCAG 2.2 AA (axe runs on 26 page/state combinations; `report:contrast` checks every token pair in both themes); `prefers-reduced-motion` and a manual motion toggle; keyboard-complete; native `<dialog>` for search, menu and lightbox. Performance numbers and known misses are in the final build report, not asserted here.

## Not implemented (on purpose)

View Transitions route animation, hero video, service worker, responsive AVIF/WebP pipeline (no images exist yet), accordion process on mobile (scrollable tabs instead), `?intro=debug` scrubber.
