import type { StackItem } from '@/types/content';

/* ═══════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line: change the value after the colon)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *  Keep the quotes '' and the comma at the end of every line.
 *  To ADD one: copy a block from { to }, change the four lines. To REMOVE: delete the block.
 *  category must be exactly one of: 'Frontend', 'Backend', 'Mobile', 'AI & Data', 'Design', 'DevOps', 'Partner'.
 *  url is optional: delete the line and the item shows as plain text .
 *  The 'Partner' category is available if you ever list real partners; none are listed now.
 */

// Public technology names, not claims about BlackUnicorn.

/**
 * WHERE THIS SHOWS UP: the "What we build with" directory, which appears TWICE — once on the
 * home page and once on the Studio page (/studio#stack). Both read this same list.
 *
 * The directory groups entries BY `category` automatically. Each group is a collapsible row
 * showing the category name and a count; the first group starts open, and visitors can open
 * several at once. Group order follows the order the categories first appear below, so moving
 * the first PostgreSQL line above React would move "Backend" above "Frontend".
 *
 *   name     → the item's label inside the group.
 *   category → which group it lands in. Must be one of: 'Frontend', 'Backend', 'Mobile',
 *              'AI & Data', 'Design', 'DevOps', 'Partner' (fixed list in src/types/content.ts).
 *   blurb    → the small grey line under the name.
 *   url      → makes the item a link with an external-link icon. Omit it and the item renders as
 *              plain text with no icon.
 *
 * Deliberately text only: no third-party logos anywhere in this section.
 */
export const stack: StackItem[] = [
  // ── Frontend ──────────────────────────────────────────────
  {
    name: 'React',
    category: 'Frontend',
    blurb: 'Component UI library.',
    url: 'https://react.dev',
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    blurb: 'React framework for the web.',
    url: 'https://nextjs.org',
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    blurb: 'Typed JavaScript.',
    url: 'https://www.typescriptlang.org',
  },
  {
    name: 'GSAP',
    category: 'Frontend',
    blurb: 'Animation toolkit.',
    url: 'https://gsap.com',
  },
  // ── Backend ──────────────────────────────────────────────
  {
    name: 'Node.js',
    category: 'Backend',
    blurb: 'JavaScript runtime.',
    url: 'https://nodejs.org',
  },
  {
    name: 'PostgreSQL',
    category: 'Backend',
    blurb: 'Relational database.',
    url: 'https://www.postgresql.org',
  },
  {
    name: 'Redis',
    category: 'Backend',
    blurb: 'In-memory data store.',
    url: 'https://redis.io',
  },
  // ── Mobile ──────────────────────────────────────────────
  {
    name: 'Flutter',
    category: 'Mobile',
    blurb: 'Cross-platform UI toolkit.',
    url: 'https://flutter.dev',
  },
  {
    name: 'Dart',
    category: 'Mobile',
    blurb: 'Language behind Flutter.',
    url: 'https://dart.dev',
  },
  {
    name: 'React Native',
    category: 'Mobile',
    blurb: 'React for native apps.',
    url: 'https://reactnative.dev',
  },
  // ── AI & Data ──────────────────────────────────────────────
  {
    name: 'Python',
    category: 'AI & Data',
    blurb: 'General-purpose language.',
    url: 'https://www.python.org',
  },
  {
    name: 'PyTorch',
    category: 'AI & Data',
    blurb: 'Machine learning framework.',
    url: 'https://pytorch.org',
  },
  {
    name: 'Pandas',
    category: 'AI & Data',
    blurb: 'Data analysis library.',
    url: 'https://pandas.pydata.org',
  },
  // ── Design ──────────────────────────────────────────────
  {
    name: 'Figma',
    category: 'Design',
    blurb: 'Interface design tool.',
    url: 'https://www.figma.com',
  },
  {
    name: 'Storybook',
    category: 'Design',
    blurb: 'Component workshop.',
    url: 'https://storybook.js.org',
  },
  {
    name: 'Unity',
    category: 'Design',
    blurb: 'Real-time 3D and 2D engine.',
    url: 'https://unity.com',
  },
  // ── DevOps ──────────────────────────────────────────────
  {
    name: 'Docker',
    category: 'DevOps',
    blurb: 'Containers.',
    url: 'https://www.docker.com',
  },
  {
    name: 'GitHub Actions',
    category: 'DevOps',
    blurb: 'CI and automation.',
    url: 'https://github.com/features/actions',
  },
  {
    name: 'Playwright',
    category: 'DevOps',
    blurb: 'Browser testing.',
    url: 'https://playwright.dev',
  },
  {
    name: 'Vitest',
    category: 'DevOps',
    blurb: 'Unit testing.',
    url: 'https://vitest.dev',
  },
  // ── More tools we use ──────────────────────────────────────────────
  {
    name: 'AWS',
    category: 'DevOps',
    blurb: 'Cloud infrastructure.',
    url: 'https://aws.amazon.com',
  },
  {
    name: 'MySQL',
    category: 'Backend',
    blurb: 'Relational database.',
    url: 'https://www.mysql.com',
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    blurb: 'Utility-first styling.',
    url: 'https://tailwindcss.com',
  },
];
