import type { ProcessStage } from '@/types/content';

/* ═══════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line: change the value after the colon)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *  Keep the quotes '' and the comma at the end of every line.
 *  To ADD a step: copy a whole block from { to }. To REMOVE: delete the block. Order = tab order (01, 02, …).
 *  id: use discover, design, build, launch or evolve to get the line drawing; any other id works but has no drawing.
 *  bullets: one bullet per line. This file is not blocked by the build, so there is no placeholder line.
 */

/**
 * WHERE THIS SHOWS UP: the "How we work" tabbed section, which appears TWICE — once on the home
 * page and once on the Studio page (/studio#process). Both read this same list.
 *
 * Each entry is one tab. The tab strip is vertical on desktop and a scrollable row on mobile;
 * arrow keys move between tabs. Tabs are auto-numbered 01, 02, 03… from this array's order, so
 * reordering here renumbers them.
 *
 *   id          → used for the tab's internal wiring AND to pick the decorative line drawing in
 *                 the panel. Only 'discover', 'design', 'build', 'launch' and 'evolve' have art
 *                 (see ProcessTabs.tsx); any other id shows the panel with no illustration.
 *   title       → the tab label, and the heading inside the open panel.
 *   summary     → the large lead paragraph at the top of the open panel.
 *   bullets     → the list under the summary.
 *   deliverable → the closing line of the panel, printed under the label "What you get".
 *
 * There is no placeholder flag on these: the copy is generic process description, not a claim
 * that needs verifying, so the build does not gate on it.
 */
export const process: ProcessStage[] = [
  {
    id: 'discover',
    title: 'Discover',
    summary: 'We learn the problem, the people and the limits before anything is drawn.',
    bullets: [
      'Stakeholder and user conversations',
      'Constraints, risks and success measures',
      'A written scope everyone can read',
    ],
    deliverable: 'A one-page brief and a plan.',
  },
  {
    id: 'design',
    title: 'Design',
    summary: 'We shape the interface and the system together, and test early.',
    bullets: [
      'Flows and wireframes',
      'A small, strict design system',
      'Clickable prototypes with real content',
    ],
    deliverable: 'A tested prototype and tokens.',
  },
  {
    id: 'build',
    title: 'Build',
    summary: 'We ship in small steps, with tests, budgets and accessibility checks on every change.',
    bullets: [
      'Typed, reviewed code',
      'Performance and accessibility budgets',
      'Weekly working builds',
    ],
    deliverable: 'Working software you can try.',
  },
  {
    id: 'launch',
    title: 'Launch',
    summary: 'We release carefully, watch what happens, and fix quickly.',
    bullets: [
      'Staged rollout',
      'Monitoring and alerts',
      'Handover documentation',
    ],
    deliverable: 'A live product and a runbook.',
  },
  {
    id: 'evolve',
    title: 'Evolve',
    summary: 'We improve from evidence, not guesses.',
    bullets: [
      'Review of real usage',
      'Prioritised improvements',
      'Dependency and security upkeep',
    ],
    deliverable: 'A roadmap and regular releases.',
  },
];
