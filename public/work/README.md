# Project images

Drop project artwork here, one folder per project, named after the project's `slug`
in `src/content/projects.ts`:

```
public/work/signcraft/cover.jpg      →  referenced as  /work/signcraft/cover.jpg
public/work/signcraft/gallery-1.jpg  →  referenced as  /work/signcraft/gallery-1.jpg
```

Everything in `public/` is served from the site root, so the path you write in
`projects.ts` is the path here **minus** `public`.

## Sizes

| Field | Shown at | Make the file |
|---|---|---|
| `cover` | full-screen home carousel, case-study header, every work card | **1600 × 1000** (16:10) |
| `gallery[]` | thumbnail grid + click-to-enlarge lightbox on the case study | **1600 × 1000** or larger; any aspect |

Crop to 16:10 yourself. The layout forces that aspect ratio and crops the overflow
centred (`object-fit: cover`), so an off-ratio file loses its edges.

## Two things that will bite you

**1. Images are not optimised for you.** `next.config.ts` sets
`images: { unoptimized: true }`, and the `scripts/optimize-images.mjs` it mentions
**does not exist**. The file you put here is the exact file every visitor downloads.
Resize and compress before committing — aim for **under 250 KB** per cover. Prefer
`.webp` over `.jpg` when you can.

**2. Do not set the `thumb` field.** `ProjectThumb` resolves `thumb ?? cover` for
*every* placement, including the full-screen hero and the case-study header — so
adding a small `thumb` silently downgrades those to a low-resolution image. Use
`cover` alone until `ProjectThumb` is changed to only prefer `thumb` at small sizes.

`coverPortrait` is declared in `src/types/content.ts` but never read by any
component; setting it has no effect today.

## Alt text

`alt` is required on every image and is read aloud by screen readers. Describe what
is *in* the picture ("SignCraft video review screen with timeline annotations"), not
the role of the image ("Project One cover").

## Team photos and OG images

- Team portraits: `public/team/<member-id>.jpg`, wired via the `photo` field in
  `src/content/team.ts`.
- Social share image: `public/og/default.png` is used for **every** page, including
  case studies. `src/lib/seo.ts` hardcodes it; per-project share images need a code
  change there.

## Several images at the top of a case study

Every project page (`/work/<slug>`) has a slider at the top. Fill it in `src/content/projects.ts`, one path per line:

```ts
heroImages: [
  '/work/signcraft/hero-1-1600.webp',
  '/work/signcraft/hero-2-1600.webp',
  '/work/signcraft/hero-3-1600.webp',
],
```

An empty `''` is a flat placeholder tile. While a project still has `placeholder: true` the empty lines stay visible so you can
see the slots; after you remove that line, empty lines are ignored (one real picture = a plain cover, no arrows).
`cover` is still the picture on cards, the home page and the share preview. Same size rule as covers: 16:10, under about 250 KB each.
If you also save `-800.webp` and `-1200.webp` copies next to a `-1600.webp` file, they are used automatically on smaller screens.

## Home page developer feed

The "Radar" section on the home page reads a free public list of developer articles (dev.to) **once, when you run `npm run build`**.
Visitors' browsers never contact dev.to. If the build cannot reach it, a short list of official docs is shown instead and the page says so.
Turn it off with `BU_FEED=off`, or change the topic with `BU_FEED_TAG=react` (any dev.to tag).
