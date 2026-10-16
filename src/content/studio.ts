/* ═══════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line: change the value after the colon)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *  Keep the quotes '' and the comma at the end of every line.
 *  story: ONE PARAGRAPH PER LINE. Add or delete lines freely.
 *  values: each value is a { title, body } block. Copy a block to add one, delete a block to remove one.
 *  Delete the  placeholder: true  line (near the top) when the copy is approved. The production build is blocked until then.
 */

/**
 * WHERE THIS SHOWS UP: the Studio page (/studio) only, top to bottom in this order.
 *
 *   eyebrow   → the small label above the page title.
 *   title     → the page <h1>.
 *   lead      → the large intro sentence under the title.
 *   story     → the "Story" section. ONE PARAGRAPH PER ARRAY ITEM, in the left column.
 *               Add or remove items freely.
 *   pullQuote → the large quote in the right column beside the story.
 *   values    → the numbered "Values" list (01, 02, 03… auto-numbered from this order).
 *               `title` is the bold line, `body` the grey line under it.
 *   placeholder → gates the production build: it FAILS while this is true, so remove the line
 *               once the team has approved the real copy.
 *
 * The rest of the Studio page is NOT here: the Team grid comes from team.ts, "How we work" from
 * process.ts, "What we build with" from stack.ts, and the closing "Want to build something?"
 * block is written directly in src/app/studio/page.tsx.
 *
 * Nothing in this file is a verified claim about BlackUnicorn yet.
 */
export const studio = {
  eyebrow: 'Studio',
  title: 'About BlackUnicorn',
  placeholder: true,
  lead: 'BlackUnicorn is a small software studio that builds web, mobile, AI and automation products, and keeps them fast after launch.',
  story: [
    'We started as a few developers who were tired of watching good ideas ship slowly and break quietly. So we set a rule: measure before you build, and keep measuring after you launch.',
    'Today we work in small teams on websites, mobile apps, AI features and the automation behind them. Everyone who designs a screen can also read its code, so nothing gets lost in a hand-off.',
  ],
  pullQuote: 'If it is not fast, accessible and easy to change, it is not finished.',
  values: [
    {
      title: 'Correctness first',
      body: 'We write the test or the check before we trust the feature, and we say plainly when something is not proven.',
    },
    {
      title: 'Craft in the details',
      body: 'Spacing, focus states and loading states get the same care as the headline feature.',
    },
    {
      title: 'Delight, on purpose',
      body: 'Motion and sound are used to explain what is happening, never to hide a slow page.',
    },
    {
      title: 'Honest by default',
      body: 'Real numbers, real screenshots, real limits. If we are guessing, we label it.',
    },
    {
      title: 'Accessible to everyone',
      body: 'Keyboard, screen reader, low vision and slow networks are part of the definition of done.',
    },
  ],
};
