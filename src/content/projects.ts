import type { Project, ImageAsset } from '@/types/content';

/* ════════════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line — just change the value after the colon)
 * ════════════════════════════════════════════════════════════════════════════════════════════
 *
 *  1. Find the project below (they are in the order they appear on the Work page).
 *  2. Change the value on each line. Keep the quotes '' and the comma at the end of the line.
 *  3. To add a project: copy the TEMPLATE block (just under this comment) to the end of the list.
 *
 *  IMAGES — three kinds, all plain file paths, one path per line
 *  ─────────────────────────────────────────────────────────────
 *  Put the files in  public/work/<slug>/  and write the path WITHOUT "public":
 *
 *      cover:  '/work/signcraft/cover-1600.webp',
 *
 *    cover       the picture on the cards (home page, Work page, menus). One image.
 *    heroImages  the slider at the TOP of the project page (/work/<slug>). One image per line,
 *                first line shows first. Every project page has this section.
 *    gallery     optional extra pictures lower on the page (click to enlarge).
 *
 *  An empty path '' means "no picture yet": a flat gold tile is drawn instead.
 *  While a project is still marked  placeholder: true  its empty '' lines stay visible as tiles so
 *  you can see where images go. Once you delete the placeholder line, empty '' lines are ignored
 *  and the slider only shows real pictures (one picture = a plain cover, no arrows).
 *
 *  Size: every picture is treated as 1600 × 1000 (16:10). Crop to that ratio before exporting.
 *  Faster pages (optional): save the same picture three times as
 *      name-800.webp   name-1200.webp   name-1600.webp
 *  and write only the  name-1600.webp  path. The smaller sizes are picked up automatically.
 *  Alt text (what screen readers say) is written for you from the title; `coverAlt` is the one
 *  you may want to write by hand: describe what is IN the picture, in one sentence.
 *
 *  TEXT FIELDS
 *  ───────────
 *  slug         the URL: /work/<slug>. Lowercase, dashes, no spaces. Keep it stable once live.
 *  title        big heading, card title, breadcrumb, browser tab.
 *  client       OPTIONAL. "Client" row. Delete the line if not needed. Hidden when confidential is true.
 *  year         "Year" row and the year on cards.
 *  published    date as 'YYYY-MM-DD'. Not shown; drives the "New" badge, header "Recent projects", sitemap.
 *  disciplines  which filters it appears under. Allowed: web, mobile, ai, games, automation, design
 *               (add new ones to disciplineLabels at the bottom first).
 *  role         "Role" row.
 *  summary      ONE sentence: lead under the title, card subtitle, Google description, search snippet.
 *  challenge    section 01 of the page. Leave '' while placeholder: true to show sample text.
 *  approach     section 02.   outcome → section 03.   Same rule.
 *  stack        technologies: "Stack" row and chips.
 *  featured     true → shows in the home "Selected work" rail.
 *  (heroOrder is no longer used: the home page opens with the studio hero, not a project slideshow.)
 *  placeholder  true → orange PLACEHOLDER badge in development and the production build is BLOCKED.
 *               Delete the line when the project is real.
 *
 *  OPTIONAL FIELDS (add them inside a project and the section appears by itself)
 *      metrics:      [{ label: 'Users', value: '12k' }],
 *      links:        [{ label: 'Live site', href: 'https://…', kind: 'live' }],   // live | repo | video | press
 *      testimonial:  { quote: '…', name: '…', role: '…' },
 *      gallery:      [ '/work/<slug>/shot-1-1600.webp', '/work/<slug>/shot-2-1600.webp' ],
 *      confidential: true,
 *
 *  The "Next project" strip at the bottom of a page is simply the next entry in the list (wrapping).
 *
 *  TEMPLATE — copy from the { to the }, paste at the end of the list, then fill every line:
 *
 *    {
 *      slug: 'my-project',
 *      title: 'My Project',
 *      year: 2026,
 *      published: '2026-01-01',
 *      disciplines: ['web'],
 *      role: ['Engineering'],
 *      summary: 'One honest sentence.',
 *      cover: '',
 *      coverAlt: '',
 *      heroImages: [
 *        '',
 *        '',
 *        '',
 *      ],
 *      challenge: '',
 *      approach: '',
 *      outcome: '',
 *      stack: ['Next.js'],
 *      featured: false,
 *      placeholder: true,
 *    },
 */

type Entry = Omit<Project, 'cover' | 'coverPortrait' | 'thumb' | 'heroImages' | 'gallery'> & {
  cover: string;
  coverAlt?: string;
  heroImages: string[];
  gallery?: string[];
};

const entries: Entry[] = [
  {
    slug: 'signcraft',
    title: 'SignCraft',
    year: 2025,
    published: '2025-07-20',
    disciplines: ['web', 'design', 'ai'],
    role: ['Full-stack development'],
    summary: 'Lead a team and develop the backend and frontend infrastructure of a video-based digital signage platform using AWS services and MySQL.',
    cover: '/work/signcraft/cover-1600.webp',
    coverAlt: 'The SignCraft landing page: "Digital Signage Made Simple", with a hero image and features for the drag-and-drop editor, cloud management, templates and AI tools.',
    heroImages: [
      '/work/signcraft/cover-1600.webp',
      '/work/signcraft/hero-2-1600.webp',
      '/work/signcraft/hero-3-1600.webp',
      '/work/signcraft/hero-4-1600.webp',
      '/work/signcraft/hero-5-1600.webp',
    ],
    challenge: 'Digital signage teams were juggling design tools, exported video files, schedules and screen settings across several different apps. The people filling the screens were rarely designers, yet they needed to compose layouts with text, images, video, audio and animation, reuse what worked, and trust that the finished content would actually play on remote displays. Turning a design made in a browser into a video file a screen can loop is heavy work that cannot run on the visitor\'s machine, and every change had to reach the right screens without anyone walking over to restart a player.',
    approach: 'A React 19 and TypeScript client built with Vite and Tailwind CSS, with a Konva canvas editor and Zustand state behind layers, alignment tools, animation controls and a timeline with visual and audio tracks. Templates and an organised media library give non-designers a starting point, and playlists sequence designs into scheduled loops with a live preview. The Bun and Express 5 API stores designs, playlists, screens and accounts in MySQL through Sequelize, takes uploads with Multer into AWS S3, and secures everything with JWT, bcrypt, Helmet, CORS and express-validator or AJV validation. Rendering runs server side: Puppeteer loads a design headlessly and FFmpeg encodes the result to video. Socket.IO connects the platform to registered displays so playlist and content changes arrive in real time, Gemini helps generate copy, and Nodemailer with EJS handles email. The work was split into frontend, API and rendering streams under one team lead.',
    outcome: 'Teams now design, organise, schedule and publish from one browser-based platform. A dashboard summarises designs, playlists and screens, templates and the asset library keep layouts consistent, and designs render to video for playback on any registered display. Updates reach connected screens as soon as they are published, AI assistance speeds up writing headlines and content, and the schedule view makes it clear what plays where and when.',
    metrics: [
      { label: 'Role', value: 'Team lead' },
      { label: 'Backend', value: 'Bun, Express, MySQL' },
      { label: 'Rendering', value: 'Puppeteer + FFmpeg' },
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Konva', 'Socket.IO', 'Bun', 'Express', 'MySQL', 'Sequelize', 'AWS S3', 'Puppeteer', 'FFmpeg', 'Gemini'],
    featured: true,
  },
  {
    slug: '2d-spriteforge',
    title: '2D SpriteForge',
    year: 2024,
    published: '2024-10-01',
    disciplines: ['games', 'automation', 'ai'],
    role: ['Full-stack development'],
    summary: 'A Python toolkit that turns any animation source (video, GIF, a folder of frames or an existing sprite sheet) into clean, uniformly sized, correctly numbered sprite frames and a Unity-ready sprite sheet, with the import settings written alongside.',
    cover: '/work/2d-spriteforge/cover-1600.webp',
    coverAlt: 'SpriteForge export step showing a packed 8x4 sprite sheet of a running character with Unity import settings',
    heroImages: [
      '/work/2d-spriteforge/cover-1600.webp',
      '/work/2d-spriteforge/hero-2-1600.webp',
      '/work/2d-spriteforge/hero-3-1600.webp',
      '/work/2d-spriteforge/hero-4-1600.webp',
    ],
    challenge: 'Game artists rarely receive animation in the shape an engine wants. A character arrives as a screen recording, a GIF, a loose folder of renders, or a sheet someone packed by hand, and every one of those needs the same tedious clean-up before Unity will treat it as a usable animation. The background has to come out cleanly, repeated frames have to be dropped, every frame has to be cropped to one shared box so the character does not jitter, and the files have to be numbered and packed in the exact order and cell size the importer expects. Done by hand in an image editor, this costs hours per animation, drifts from artist to artist, and has to be redone from scratch whenever the source changes.',
    approach: 'SpriteForge is built as a staged processing pipeline rather than a one-off script, so each stage can be tested and reasoned about on its own. FFmpeg decodes video and GIF sources into frames, while Pillow and NumPy do the pixel-level work: background keying with edge feathering and halo removal, near-duplicate detection by comparing consecutive frames, and a single shared bounding box computed across the whole sequence so every frame is cropped, anchored to a pivot and resized identically. For difficult backgrounds, rembg on ONNX Runtime provides an optional AI cutout, kept as an opt-in extra so the base install stays light. The packer then lays frames out as a strip or grid, pads to power-of-two sizes when needed, and writes a JSON file containing the Unity slicing, pivot and pixels-per-unit settings. Each stage is exposed through an argparse command line (including a reverse mode that cuts an existing sheet back into frames), packaged with pyproject.toml and covered by pytest. The same four stages (Import, Clean Up, Frames, Export) are surfaced in a guided workspace with before/after previews.',
    outcome: 'An animation that once needed an afternoon of manual editing now goes from raw source to import-ready assets in a single run. Frame sizes, pivots and numbering are consistent, characters no longer jitter, and duplicate frames no longer bloat the sheets. Because the generated settings file travels with the sprite sheet, the Unity import step becomes configuration instead of guesswork. The pipeline is deterministic, so re-exporting after an art change produces the same predictable result, and the reverse slicing mode lets the team rescue and normalise legacy sheets instead of redrawing them.',
    metrics: [
      { label: 'Sources', value: 'Video, GIF, frames, sheets' },
      { label: 'Output', value: 'Unity-ready sheet + JSON' },
      { label: 'Frames', value: 'One size, no jitter' },
    ],
    stack: ['Python', 'NumPy', 'Pillow', 'FFmpeg', 'rembg', 'ONNX Runtime', 'pytest', 'Unity'],
    featured: true,
  },
  {
    slug: 'bints-global',
    title: 'Bints Global',
    year: 2025,
    published: '2025-09-01',
    disciplines: ['web'],
    role: ['Full-stack development'],
    summary: 'A study-in-Malaysia platform where students explore universities, programs and entry details, then apply and follow their registration with an admin team entirely online.',
    cover: '/work/bints-global/cover-1600.webp',
    coverAlt: 'Bints Global home page hero reading \'Study in Malaysia\' with a search bar, main navigation and a Start Now button',
    heroImages: [
      '/work/bints-global/cover-1600.webp',
      '/work/bints-global/hero-2-1600.webp',
      '/work/bints-global/hero-3-1600.webp',
      '/work/bints-global/hero-4-1600.webp',
    ],
    challenge: 'Students who want to study in Malaysia usually piece together information from scattered university sites and agents, then run their application through chat messages and emailed attachments with no clear view of how far it has progressed. The agency behind Bints Global needed one source of truth: universities, programs and entry details kept accurate and easy to compare, each applicant\'s registration handled with an admin team step by step, and the status of every application visible to both sides. The data underneath is deeply relational (universities, programs, applicants, applications, documents and staff actions all reference one another), and the audience is international, so the platform also had to work across languages.',
    approach: 'The backbone is a normalised MySQL schema accessed through Sequelize, modelling universities, programs, applicants, applications and admin-managed content with explicit relationships, so a program page, an applicant\'s checklist and an admin queue are all views over the same records. The Express 5 API is layered into controllers, models, routes, middlewares and validators, with express-validator guarding every input, JWT and bcrypt handling authentication, Multer handling document uploads, Nodemailer with EJS templates producing emails, and Helmet and CORS hardening the edges. Socket.io pushes live updates so status changes appear without refreshing. On the client, React 19 and Vite power a routed single-page app styled with Bootstrap and animated with Framer Motion, i18next provides translations, and TipTap, CKEditor and Slate give admins rich-text editing for programs and blog content without developer help. The frontend ships on Vercel and the API runs in Docker on Railway.',
    outcome: 'Prospective students can discover universities, compare programs, submit an application and follow its status from a single portal, instead of chasing updates over chat. The admin team works from structured records rather than scattered threads, so every application has a clear owner, stage and document trail. Content editors can publish new programs and articles on their own, and the translation layer lets the same platform serve students in their own language. Splitting hosting across Vercel and a containerised Railway API keeps the public site fast while the data layer stays independently deployable.',
    metrics: [
      { label: 'Portal', value: 'Browse, apply, track' },
      { label: 'Backend', value: 'Express + MySQL' },
      { label: 'Languages', value: 'Multilingual' },
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MySQL', 'Sequelize', 'Socket.io', 'i18next', 'Docker'],
    featured: false,
  },
  {
    slug: 'proplant',
    title: 'ProPlant',
    year: 2021,
    published: '2021-06-01',
    disciplines: ['web', 'design'],
    role: ['Full-stack development'],
    summary: 'A clean black-and-white marketing site for a Yokohama company offering marketing support, exhibition management and talent management, built with Next.js.',
    cover: '/work/proplant/cover-1600.webp',
    coverAlt: 'ProPlant hero section with the headline \'Just show up. We\'ll handle the rest.\' beside a photo of a trade show booth',
    heroImages: [
      '/work/proplant/cover-1600.webp',
      '/work/proplant/hero-2-1600.webp',
      '/work/proplant/hero-3-1600.webp',
      '/work/proplant/hero-4-1600.webp',
    ],
    challenge: 'ProPlant\'s site had two problems that fed each other. The /services/talent page failed to build because components were exported one way and imported another, which blocked every deployment, and the visual design relied on a colour-token theme that had drifted unevenly across the home page, service pages and the separate exhibition area. The company wanted a restrained, professional black-and-white identity applied everywhere without touching layout, spacing or the existing Japanese-language content, plus better navigation on sub-pages and safe handling of the external exhibition link.',
    approach: 'We started by fixing the build at its root, auditing every component boundary and standardising the export convention (a named export for the header, a default export for the footer) so each import matched its source. With the pipeline green, we replaced the colour variables with a disciplined grayscale scale in Tailwind: white and neutral-50 surfaces, neutral-900 headings, neutral-600 body copy, neutral-200 borders and black primary actions with neutral-800 hover states. The same pattern was rolled through the header, footer, hero, services, about and contact sections, both service pages and the exhibition site header. We then added a Back to Home control driven by usePathname so it appears only on sub-pages, and made external links open with target="_blank" and rel="noopener noreferrer". Spacing, responsive behaviour and all copy were deliberately left untouched to keep the change low-risk.',
    outcome: 'The site now compiles cleanly, and every route (home, exhibition, marketing and talent) generates without errors, so deployments to Vercel are unblocked. Visitors get one coherent, high-contrast identity across the main site and the exhibition area, consistent hover and transition behaviour, and clearer navigation back to the home page from any service page. Because the grayscale palette is expressed as a small, repeatable set of utility classes, future pages can match the design without reinventing it, and the standardised export pattern prevents the same class of build failure from returning.',
    metrics: [
      { label: 'Theme', value: 'Black-and-white system' },
      { label: 'Build', value: 'Every route compiles' },
      { label: 'Framework', value: 'Next.js' },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    featured: true,
  },
  {
    slug: 'viola',
    title: 'Viola\'s Landing Page',
    year: 2024,
    published: '2024-04-01',
    disciplines: ['web', 'design'],
    role: ['Full-stack development'],
    summary: 'A single-page landing site for a Shah Alam graphic-design atelier, pairing an animated dark-plum hero with a selected-work cabinet and a lead-capture enquiry form.',
    cover: '/work/viola/cover-1600.webp',
    coverAlt: 'Viola hero section on a dark plum background with an animated silk-line backdrop, the headline \'Graphic design, inspired by local dreams to advance the global future\' and a framed violet flower',
    heroImages: [
      '/work/viola/cover-1600.webp',
      '/work/viola/hero-2-1600.webp',
      '/work/viola/hero-3-1600.webp',
    ],
    challenge: 'A design studio\'s website is judged on craft before anyone reads a word, so Viola needed to feel luxurious and tactile, with fluid motion, rich typography and layered graphics, while still loading instantly and staying accessible. The usual answer is to pile on animation libraries and web-font CDNs, which adds weight, layout shift and third-party requests. On top of the visual bar, the page had to do real work: guide a visitor through the studio\'s story, services and process, and convert them into an enquiry, a Google Maps visit or a scheduled consultation.',
    approach: 'We built the whole experience with zero runtime dependencies and no build step. The structure is semantic HTML5 (header, nav, main, section, article, figure, footer) with a single H1 and descriptive alt text. Styling uses CSS custom-property design tokens for the plum, gold and parchment palette, with Grid and Flexbox layouts and breakpoints at 992px and 768px. Every animation is restricted to compositor-friendly transform and opacity changes: drifting glows, a rotating reticle and flowing inline-SVG silk paths with gradient and blur filters. Scroll reveals use IntersectionObserver with a prefers-reduced-motion fallback, the mobile menu is CSS-only, and the Bodoni Moda, Cormorant Garamond and Source Sans 3 fonts are self-hosted as WOFF2 with font-display swap to avoid layout shift. A small vanilla-JS handler validates the contact form and shows an accessible inline confirmation.',
    outcome: 'The result is a premium-feeling, single-page site that stays light: no frameworks, no CDN fonts, and animations that hold a smooth frame rate. The narrative flow from hero to atelier story, location, services, process, selected work, reviews and contact gives visitors a clear path to action, with three distinct conversion routes (the enquiry form, a scheduled visit and Google Maps navigation). Semantic markup, keyboard-friendly controls, reduced-motion support and basic SEO tags make it accessible and discoverable, and because there is nothing to compile or update, the studio can host and maintain it almost anywhere.',
    metrics: [
      { label: 'Dependencies', value: 'None' },
      { label: 'Animation', value: 'Transform and opacity only' },
      { label: 'Fonts', value: 'Self-hosted WOFF2' },
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'SVG'],
    featured: false,
  },
  {
    slug: 'worksight',
    title: 'WorkSight',
    year: 2025,
    published: '2025-04-01',
    disciplines: ['web', 'ai'],
    role: ['Full-stack development'],
    summary: 'A remote-workplace console that replaces physical attendance with face-authenticated check-in, live presence tracking, task management, meeting rooms and attendance analytics for administrators and employees.',
    cover: '/work/worksight/cover-1600.webp',
    coverAlt: 'WorkSight employee dashboard with the My work view and the floating presence panel showing productive and away time, idle allowance and a camera-based face check for check-out',
    heroImages: [
      '/work/worksight/cover-1600.webp',
    ],
    challenge: 'Remote work removes the one thing a physical office provides for free: proof of who is working and when. Companies moving to work-from-home needed to confirm that employees sign in as themselves, stay present during working hours, can collaborate in real time and remain accountable for task delivery, all without invasive surveillance or a pile of manual supervision. That means solving several hard problems at once: identity verification that cannot be shared, presence detection that measures productive time honestly, live video meetings with attendance records, and administrator views that update the moment something changes, while keeping biometric data handling restrained.',
    approach: 'WorkSight is a React and Vite client talking to an Express API backed by MySQL. In the browser, face-api.js runs face detection and descriptor capture, with alignment and lighting checks before auto-capture, and only descriptors, never face images, are stored. The server separates credential-only administrator sessions from face-authenticated employee sessions using JWTs in role-specific HttpOnly cookies. Presence is modelled as a state machine (productive, away, idle, checked-out, auto-checked-out) with three escalating off-screen alerts before automatic check-out, and Server-Sent Events push live changes to the admin console. Meeting rooms are built on WebRTC, with signalling records in the database, a waiting room, screen sharing, chat, notes and limited reactions, recording per-meeting attendance and latency. Gemini drafts tasks and meeting agendas, Document AI parses uploaded forms, both with local fallbacks, and ApexCharts powers the analytics. A vector-oriented Cloud SQL schema is included for production-scale biometric search.',
    outcome: 'Employees check in as themselves, see their productive time, away time and remaining idle allowance in a floating panel that stays out of the way, and are automatically checked out and flagged for review if they stay off-screen. Administrators get an operations console instead of a static report: live presence, attendance latency per employee and per meeting, task flow, submissions to review, and notifications for events that need action. The privacy-conscious design (no stored face images, locked face prints after onboarding, camera off during idle and checked-out states) gives organisations accountable remote attendance without turning the system into continuous surveillance.',
    metrics: [
      { label: 'Sign-in', value: 'Face-authenticated' },
      { label: 'Presence', value: 'Live, 3 alert levels' },
      { label: 'Meetings', value: 'WebRTC with attendance' },
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'face-api.js', 'WebRTC', 'Node.js', 'Express', 'MySQL', 'Gemini'],
    featured: false,
  },
  {
    slug: 'yalla-habibi',
    title: 'Yalla Habibi',
    year: 2025,
    published: '2025-02-01',
    disciplines: ['web'],
    role: ['Full-stack development'],
    summary: 'A restaurant discovery and deals platform where restaurants publish menus and promotions, and diners search by dish, cuisine or name, browse food photos and find the nearest places on a map.',
    cover: '/work/yalla-habibi/cover-1600.webp',
    coverAlt: 'Yalla Habibi home page hero reading \'All restaurants\' over a plated meal, with a search bar for dishes, tags and address and a yellow Search button',
    heroImages: [
      '/work/yalla-habibi/cover-1600.webp',
      '/work/yalla-habibi/hero-2-1600.webp',
      '/work/yalla-habibi/hero-3-1600.webp',
      '/work/yalla-habibi/hero-4-1600.webp',
      '/work/yalla-habibi/hero-5-1600.webp',
    ],
    challenge: 'Restaurant discovery apps live or die on the quality and findability of their data. Many independent restaurants needed to onboard themselves, describe what they sell in any cuisine, upload photos and run promotions, while diners wanted to find food in whatever way came naturally: by dish, by cuisine, by restaurant name, or by whichever place is closest. That demands flexible search and filtering over free-form restaurant-supplied content, a way to keep that content trustworthy, location-aware browsing that stays usable on a phone, and a promotions flow that works in the real world rather than only on screen.',
    approach: 'The React 19 and TypeScript front end, built with Vite and Tailwind CSS 4, offers faceted filtering where categories, cuisines and individual food items each show live counts, and a split list/map view powered by React Leaflet. Restaurants get a self-service panel for profile, cuisine tags, menu items with photos and promotions, and menu items pass through an approval state so only reviewed content appears publicly. A map picker captures precise locations, and promotions use qrcode.react to generate codes and jsqr to scan them in a dedicated scanner page. The Express 5 API stores relational data in MySQL through Sequelize, validates input with express-validator, handles uploads with Multer and sends one-time codes by email with Nodemailer. Firebase and Firestore rules are configured for supporting features, i18next adds multilingual support, and the app is containerised with Docker.',
    outcome: 'Restaurants can launch a complete profile, menu and promotion on their own, and diners can go from a craving to a specific dish, photo and location in a few taps, using search, filters or the map. The approval step keeps the public catalogue clean, the QR promotion flow connects online offers to in-person redemption, and the multilingual interface makes the platform approachable for a diverse city. Because the filtering, map and promotion pieces are modular, the platform can grow its restaurant base and feature set without rebuilding the discovery experience.',
    metrics: [
      { label: 'Search', value: 'Dish, cuisine or name' },
      { label: 'Discovery', value: 'List and map views' },
      { label: 'Promotions', value: 'QR generate + scan' },
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Leaflet', 'Firebase', 'Node.js', 'Express', 'MySQL', 'Sequelize'],
    featured: true,
  },
];

/* ───────────────────────────── you do not need to edit anything below this line ───────────────────────────── */

const SAMPLE = {
  challenge: 'Placeholder: describe the problem the client or team faced, in one to three short paragraphs.',
  approach: 'Placeholder: describe what BlackUnicorn did, and why those choices were made.',
  outcome: 'Placeholder: describe what changed. Use only real, verifiable results.',
};

/** A picture ending in "-1600.webp" gets its -800 and -1200 siblings as responsive candidates. */
const srcSetFor = (src: string): string | undefined =>
  /-1600\.webp$/.test(src)
    ? [800, 1200, 1600].map((w) => `${src.replace(/-1600\.webp$/, `-${w}.webp`)} ${w}w`).join(', ')
    : undefined;

const image = (src: string, alt: string): ImageAsset => {
  const srcSet = srcSetFor(src);
  return { src, width: 1600, height: 1000, alt, ...(srcSet ? { srcSet } : {}) };
};

function build(e: Entry): Project {
  const draft = e.placeholder === true;
  const { cover, coverAlt, heroImages, gallery, challenge, approach, outcome, ...rest } = e;

  const required: (keyof Entry)[] = draft ? ['title', 'summary'] : ['title', 'summary', 'challenge', 'approach', 'outcome'];
  const missing = required.filter((k) => !e[k]);
  if (missing.length) throw new Error(`src/content/projects.ts: "${e.slug}" is missing: ${missing.join(', ')}`);

  const firstReal = heroImages.find(Boolean) ?? '';
  const coverSrc = cover || firstReal;
  const coverText = coverAlt || `${e.title}: cover image`;

  // Every case study has the hero section. While drafting, keep empty lines (and pad to 3) so the empty slots are visible.
  const slots = draft ? [...heroImages, '', '', ''].slice(0, Math.max(3, heroImages.length)) : heroImages.filter(Boolean);
  const hero = slots.map((src, i) => image(src, src && src === coverSrc ? coverText : `${e.title}: image ${i + 1} of ${slots.length}`));

  return {
    ...rest,
    cover: image(coverSrc, coverText),
    heroImages: hero,
    ...(gallery?.filter(Boolean).length ? { gallery: gallery.filter(Boolean).map((src, i) => image(src, `${e.title}: gallery image ${i + 1}`)) } : {}),
    challenge: challenge || (draft ? SAMPLE.challenge : ''),
    approach: approach || (draft ? SAMPLE.approach : ''),
    outcome: outcome || (draft ? SAMPLE.outcome : ''),
  };
}

export const projects: Project[] = entries.map(build);

/**
 * The human-readable name for each discipline code.
 * WHERE THIS SHOWS UP: the filter chips at the top of the Work page, the eyebrow line on cards
 * and case studies, the Work drop-down "By discipline" column, and the "What do you need?"
 * dropdown in the contact form. Add a discipline here before using it above.
 */
export const disciplineLabels: Record<string, string> = {
  web: 'Web',
  mobile: 'Mobile',
  ai: 'AI',
  games: 'Games',
  automation: 'Automation',
  design: 'Design',
};
export const labelFor = (d: string) => disciplineLabels[d] ?? d;
