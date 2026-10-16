import type { Service } from '@/types/content';

/* ═══════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line: change the value after the colon)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *  Keep the quotes '' and the comma at the end of every line.
 *  To ADD one: copy a whole block from { to }, paste it right below, change the lines.
 *  To REMOVE one: delete the whole block from { to }.
 *  The order of the blocks is the order on the website.
 *  Delete the  placeholder: true  line once the text is real. The production build is blocked while any such line remains.
 *  bullets: one bullet per line (three reads best).
 *  id is the link target used by the Services menu in nav.ts: if you change an id, change it there too.
 */

/**
 * WHERE THIS SHOWS UP: the Services page (/services) — one numbered block per entry, in this
 * order. Also fed into the site search index, so a service can be found from the header search.
 *
 *   id          → the anchor on the page (/services#web-engineering) AND the link target used by
 *                 the Services drop-down in nav.ts. Rename it here and you must rename it there.
 *   name        → the block heading (big text, numbered 01, 02, …).
 *   summary     → the one-line lead under the heading, and the search-result snippet.
 *   bullets     → the list on the right of the block. Any number; three reads best.
 *   icon        → declared but not currently drawn on the Services page. Harmless to leave.
 *   placeholder → orange PLACEHOLDER badge in development; the production build FAILS while any
 *                 entry still has it, so delete the line once the copy is approved.
 *
 * Note: the page heading "What we do" and its intro line are NOT here — they are written
 * directly in src/app/services/page.tsx.
 */
export const services: Service[] = [
  {
    id: 'web-engineering',
    name: 'Web engineering',
    icon: 'globe',
    summary: 'Fast, accessible websites and web apps.',
    bullets: [
      'Design systems',
      'Performance budgets',
      'Accessibility to WCAG 2.2 AA',
    ],
    placeholder: true,
  },
  {
    id: 'mobile-apps',
    name: 'Mobile apps',
    icon: 'phone',
    summary: 'Apps for iOS and Android from one codebase.',
    bullets: [
      'Cross-platform builds',
      'Offline-first design',
      'Store release support',
    ],
    placeholder: true,
  },
  {
    id: 'ai-integration',
    name: 'AI integration',
    icon: 'spark',
    summary: 'Practical machine learning, measured and explained.',
    bullets: [
      'Use-case scoping',
      'Evaluation before launch',
      'Cost and latency tracking',
    ],
    placeholder: true,
  },
  {
    id: 'automation',
    name: 'Automation',
    icon: 'flow',
    summary: 'Workflows that remove repeated manual work.',
    bullets: [
      'Process mapping',
      'Integrations',
      'Monitoring and alerts',
    ],
    placeholder: true,
  },
  {
    id: 'product-design',
    name: 'Product design',
    icon: 'pen',
    summary: 'Interfaces that are clear before they are clever.',
    bullets: [
      'Research and prototypes',
      'Interaction design',
      'Handover to engineering',
    ],
    placeholder: true,
  },
];
