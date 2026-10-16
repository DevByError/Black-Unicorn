import type { Metric } from '@/types/content';

/* ═══════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line: change the value after the colon)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *  Keep the quotes '' and the comma at the end of every line.
 *  To ADD one: copy a whole block from { to }, paste it right below, change the lines.
 *  To REMOVE one: delete the whole block from { to }.
 *  The order of the blocks is the order on the website.
 *  Delete the  placeholder: true  line once the text is real. The production build is blocked while any such line remains.
 *  value: a plain number like '120' counts up when scrolled into view; text like '12+' is shown as-is.
 *  unit and comparison are optional: delete the line if not needed.
 */

/**
 * WHERE THIS SHOWS UP: the "BlackUnicorn by the numbers" band on the home page — one tile per
 * entry, in this order, four across on desktop.
 *
 *   label      → the small caption under the number.
 *   value      → the big number itself. If it is purely numeric ("120", "1,500", "4.8") it
 *                counts up from zero when the band scrolls into view. Anything else (like the
 *                "[value]" below, or "12+") is printed as-is with no animation.
 *   unit       → a smaller suffix glued to the number, e.g. unit: '+' or unit: '%'.
 *   comparison → the dimmer third line under the caption, for context ("up from 8 last year").
 *                Omit it and the line disappears.
 *   placeholder→ orange PLACEHOLDER badge in development; the production build FAILS while any
 *                entry still has it.
 *
 * Values are literal placeholders right now, so nothing animates. The section heading itself is
 * written in src/components/sections/KpiBand.tsx, not here.
 */
export const metrics: Metric[] = [
  {
    id: 'm1',
    label: 'Projects shipped',
    value: '6',
    unit: '',
    comparison: 'web, mobile, AI, games and automation',
    placeholder: true,
  },
  {
    id: 'm2',
    label: 'Years building',
    value: '10',
    unit: '+',
    comparison: 'of front-end experience on the team',
    placeholder: true,
  },
  {
    id: 'm3',
    label: 'Disciplines covered',
    value: '6',
    unit: '',
    comparison: 'under one roof, one review process',
    placeholder: true,
  },
  {
    id: 'm4',
    label: 'Team members',
    value: '4',
    unit: '',
    comparison: 'engineers and designers, no hand-offs to strangers',
    placeholder: true,
  },
];
