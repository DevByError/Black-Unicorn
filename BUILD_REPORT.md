# BlackUnicorn — Build Report (Part 24)

Everything below is what was actually run in this session unless it is marked *inferred* or *not tested*.

## 1. What was built
A static, 11-route site (home, work, 6 case studies, services, studio, notes + 4 articles, contact, privacy, accessibility, 404, sitemap, robots, search index), with the Forge & Dock intro, mega-menu header with scroll-progress ring, native-dialog search/menu/lightbox, hero carousel, filterable work grid (GSAP Flip), process tabs, stack directory, light/dark themes, motion toggle, consent banner (analytics off), and a typed content layer where every record is `placeholder: true`. A build gate (`scripts/check-placeholders.mjs`) fails until placeholders are replaced.

## 2. Mode and stack
Mode A: Next.js 15.5 (App Router, `output: 'export'`), React 19.3, TypeScript 6 strict, Tailwind v4 (tokens in CSS), GSAP 3.15 (core + SplitText in a lazy intro chunk; Flip lazy on /work), self-hosted Cinzel 600 / Manrope variable / JetBrains Mono 500 (3 files, 62 KB).

## 3. Logo and assets
No logo screenshot or intro files were attached, so the mark was rebuilt from the Part 6.1 canonical geometry (`src/lib/logo-geometry.ts`). `npm run make:brand` generates gold/white/black icon, stacked and horizontal SVG lockups (wordmark as outlines), mask icon, favicon.svg/.ico (16/32/48), apple-touch 180, icons 192/512, maskable 512, and `public/og/default.png` (1200×630, flat ink). **If you have the real vector artwork, replace these.**

## 4. The intro
Ring/gauge/ticks/mane/dot/horn/wordmark are forged, the logo flies to the header with a snap, then the curtain splits along the horn seam. Modes: full (first visit), short (return within 7 days), skip (same session), reduced (~1.1 s). Skip button, Esc, 6.5 s CSS fallback, 7 s JS watchdog, `inert` on the page behind. Flags `?intro=skip|force|slow`. Checked with screenshots (desktop + 390×844 mobile) and 7 Playwright intro tests.

## 5. Reference learnings (microsoft.com/en-us, petronas.com)
Patterns adopted (structure only, no assets): hero carousel with numbered pager and play/pause; mega-menu with hover-intent; intent chips; "latest" rail; flagship spotlight; KPI band; sticky utility header that hides on scroll-down. *Inferred, not re-verified live this session:* the exact behaviours of both sites; I worked from the brief's description of them.

## 6. Verified vs inferred
Verified by running: lint, typecheck, 12 unit tests, production build, 50 e2e tests (26 axe checks incl. interactive states, intro, nav, forms), contrast report (every token pair, both themes), CSP verifier (all 11 routes load and hydrate under the *enforced* policy; a negative control proves it detects violations), Lighthouse mobile (below), gradient grep.
Inferred: cross-browser behaviour, assistive-tech behaviour, real-device performance.

## 7. Test results
- e2e: 50 passed, 1 skipped (form submit against a live endpoint — none exists). One flaky test (search shortcut pressed before hydration) was fixed with a hydration marker and passed 5/5 reruns.
- Lighthouse mobile (simulated throttling, local static server): Home first visit with full intro — Performance 90, A11y/BP/SEO 100, **LCP 3.3 s (misses the 2.0 s budget)**, CLS 0, TBT 130 ms. Home with `?intro=skip` — 98, **LCP 2.2 s (slightly over)**. /work — 98, LCP 1.5 s. Unthrottled observed LCP: 1.27 s (intro), 0.16 s (skip).
- Initial JS on home ≈ 129 KB gz measured (Next reports 118 kB First Load) vs the 110 KB budget: **over**. Next+React alone is 103 kB shared, so the budget is not reachable with this stack without removing features. Intro chunk (GSAP) ≈ 36 KB, lazy.
- **Could NOT be tested:** VoiceOver/NVDA/TalkBack; Safari, iOS Safari, Firefox, Samsung Internet; real-device frame rates (no 4× CPU frame-time capture was done); a live form endpoint; CSP on a real host.

## 8. Decisions & assumptions
1. Mode A; logo rebuilt from spec (no assets supplied).
2. Dock hand-off happens after the curtain split (`intro-handoff` class) to avoid scrollbar-gutter drift.
3. GSAP chunk limited to core + SplitText; bezier flight and char flight done manually.
4. Fonts: JetBrains Mono 500 only; fallback metric adjustments are approximate.
5. Native `<dialog>` for search/menu/lightbox; header uses a simplified safe-triangle plus grace delay.
6. Spotlight uses a solid raised panel instead of a translucent scrim (contrast, no gradient). Form control borders use `--text-muted` for 3:1.
7. Static export cannot send headers: `_headers` is generated with per-page hashed CSP, Report-Only by default (`CSP_ENFORCE=1` to enforce). Per-page CSP lines are ≈1,970 chars; some hosts cap at 2,000.
8. View Transitions not implemented (React stable lacks `<ViewTransition>`); focus + title announcement fallback used.
9. Light-OS first-time visitors get the light theme (per brief); header logo stays gold so the dock hand-off matches.
10. The only `gradient()` in the codebase is a mask-only edge fade in `sections.css` (mobile tile row).

## 9. Content you must supply (25 items flagged by `npm run check:placeholders`)
site.ts: email, location, socials · metrics.ts: 4 metrics · notes.ts: 4 articles · projects.ts: 6 projects (and images) · services.ts: 5 · team.ts: 4 · stack.ts: 4 Partner entries · studio.ts: story + values · privacy page: "[to be confirmed]" lines.

## 10. Limitations
Not built: `?intro=debug` scrubber, hero video/play-pause (no media), Flip fade-out of removed cards (move/enter only), accordion process on mobile (scrollable tabs), image optimisation pipeline (no images yet), service worker. LCP and initial-JS budgets missed (above). Intro under CPU throttle not measured. `npm audit`: 2 prod findings (1 high, 1 moderate) are PostCSS inside Next 15's build toolchain (CSS stringify/sourcemap issues in build-time processing of untrusted CSS; nothing ships to the browser); fixing means Next 16 (breaking). 9 total incl. dev tooling.

## 11. Dependencies
Runtime: next ^15.5.27, react/react-dom ^19.3.0, gsap ^3.15.0, @fontsource/cinzel, @fontsource-variable/manrope, @fontsource/jetbrains-mono (font sources; woff2 copied to `public/fonts`).
Dev: typescript ^6, tailwindcss + @tailwindcss/postcss ^4.3, postcss, eslint ^9 + eslint-config-next + typescript-eslint, prettier, vitest ^5, @playwright/test + @axe-core/playwright, opentype.js (brand script), serve.
