import type { Note } from '@/types/content';

/* ═══════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line: change the value after the colon)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *  Keep the quotes '' and the comma at the end of every line.
 *  To ADD one: copy a whole block from { to }, paste it right below, change the lines.
 *  To REMOVE one: delete the whole block from { to }.
 *  The order of the blocks is the order on the website.
 *  Delete the  placeholder: true  line once the text is real. The production build is blocked while any such line remains.
 *  date must stay 'YYYY-MM-DD'. It also sorts the notes newest first.
 *  body: ONE PARAGRAPH PER LINE. Add a line for a new paragraph.
 *  featured: true on ONE note makes it the large block on the home page. Delete the line on the others.
 */

/**
 * WHERE THIS SHOWS UP: three places.
 *
 *  1. HOME — "Notes from the studio" section: the `featured: true` note becomes the large block
 *     on the left (tags + title + excerpt + date); the next 6 newest become the rows beside it.
 *  2. NOTES PAGE (/notes) — the full list of every note.
 *  3. NOTE PAGE (/notes/<slug>) — a full article page generated per entry.
 *
 * FIELD BY FIELD:
 *   slug       → the URL: /notes/<slug>. Keep it stable once published.
 *   title      → the <h1> on the note page, every list row title, the tab title, and the default
 *                subject line when a reader clicks "Email this note".
 *   date       → shown under the title and on every row. ALSO the sort key — the whole site
 *                orders notes newest-first by this, and it drives the Newer/Older links at the
 *                bottom of a note. Format must stay YYYY-MM-DD.
 *   excerpt    → the grey summary line on the home section and the notes list, the meta
 *                description for search engines, and the search-result snippet. One sentence.
 *   body       → the article text. Blank lines (\n\n) become separate paragraphs. The
 *                "N min read" estimate above the article is calculated from its length.
 *   tags       → the eyebrow line above the title and the "Process / Design" bit on each row,
 *                joined with " / ". Also the search tags. Free text, no master list.
 *   featured   → picks the one note that gets the large block on the home page. If no note has
 *                it, the newest note is used instead.
 *   placeholder→ orange PLACEHOLDER badge in development; the production build FAILS while any
 *                entry still has it.
 */
type NoteEntry = Omit<Note, 'body'> & { body: string[] };

const entries: NoteEntry[] = [
  {
    slug: 'budget-milliseconds-first',
    title: 'We budget milliseconds before we write features',
    date: '2026-09-28',
    excerpt: 'A performance budget is a product decision, so we write it down on day one and let the build fail when we break it.',
    tags: ['Performance', 'Process'],
    featured: true,
    body: [
      'Most slow sites were not built slow. They got slow one reasonable decision at a time: a font here, a tracking script there, a carousel the client really wanted.',
      'So on day one we write a budget: how many kilobytes of JavaScript, how long until the main content is visible on a mid-range phone, how much layout movement we will tolerate. The numbers go in the repository, next to the code.',
      'Then the build enforces it. If a change pushes the page over budget, the pipeline stops and shows what grew. That turns performance from an argument into a trade-off the whole team can see.',
      'The result is boring in the best way: new features arrive, and the page stays fast because every addition has to pay for itself.',
    ],
    placeholder: true,
  },
  {
    slug: 'one-token-file-two-platforms',
    title: 'One design-token file for Next.js and Flutter',
    date: '2026-08-15',
    excerpt: 'Colours, spacing and type live in a single file that generates both a CSS file and a Dart theme, so web and mobile never drift apart.',
    tags: ['Engineering', 'Design systems'],
    body: [
      'When the web app says gold and the mobile app says a slightly different gold, nobody notices until a client holds both next to each other.',
      'We keep every colour, spacing step and type size in one JSON file. A small script reads it and writes two outputs: CSS custom properties for the web and a Dart theme class for Flutter.',
      'Designers change a value once. Both platforms pick it up on the next build, and a check fails if someone edits a generated file by hand.',
    ],
    placeholder: true,
  },
  {
    slug: 'accessibility-is-a-build-step',
    title: 'Accessibility is a build step, not an audit',
    date: '2026-06-30',
    excerpt: 'Automated checks catch the easy failures on every commit, and keyboard and screen-reader passes catch the rest before release.',
    tags: ['Accessibility', 'Process'],
    body: [
      'An accessibility audit at the end of a project finds problems when they are most expensive to fix. We run the checks on every change instead.',
      'Automated tests cover contrast, labels, landmarks and focus order. They are fast and catch the failures that repeat the most.',
      'They cannot judge whether a page makes sense with a screen reader, so every release also gets a manual keyboard pass and a read-through with one. Anything we find becomes a test, so it cannot return.',
    ],
    placeholder: true,
  },
  {
    slug: 'rag-what-we-measure-first',
    title: 'RAG without the hype: what we measure first',
    date: '2026-04-09',
    excerpt: 'Before tuning prompts or models, we build a small question set and score retrieval and answers separately.',
    tags: ['AI', 'Process'],
    body: [
      'When an AI answer is wrong, the cause is usually one of two things: the right passage was never retrieved, or it was retrieved and the answer ignored it. Fixing the wrong one wastes weeks.',
      'So we start with a fixed set of real questions and score two things separately: did retrieval return the right passage, and did the answer use it and cite it.',
      'That gives us a number to move. Every change to chunking, ranking or prompts is judged against the same set, and we keep running it after launch so quality drift shows up in a chart, not in a complaint.',
    ],
    placeholder: true,
  },
];

/* you do not need to edit anything below this line */
export const notes: Note[] = entries.map((e) => ({ ...e, body: e.body.join('\n\n') }));
