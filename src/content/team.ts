import type { TeamMember } from '@/types/content';

/* ═══════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line: change the value after the colon)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *  Keep the quotes '' and the comma at the end of every line.
 *  To ADD one: copy a whole block from { to }, paste it right below, change the lines.
 *  To REMOVE one: delete the whole block from { to }.
 *  The order of the blocks is the order on the website.
 *  Delete the  placeholder: true  line once the text is real. The production build is blocked while any such line remains.
 *  The home page shows only the FIRST FOUR people; the Studio page shows everyone.
 *  Optional lines you can add inside a block:   interest: '…',   photo: { src: '/team/name.webp', width: 800, height: 800, alt: '…' },
 */

/**
 * WHERE THIS SHOWS UP: two places, same card design.
 *
 *  1. HOME — "The people behind it" section: the FIRST FOUR entries only. Anyone after the
 *     fourth is invisible there (the "Meet the team" button leads to the full list).
 *  2. STUDIO PAGE (/studio#team) — every entry, in this order.
 *
 *   name        → the card heading. Its initials are also what the grey ring shows when there
 *                 is no photo (e.g. "Team Member One" → "TM").
 *   role        → the small eyebrow line under the name.
 *   bio         → the grey paragraph under the role. Two sentences is the intended length.
 *   placeholder → orange PLACEHOLDER badge in development; the production build FAILS while any
 *                 entry still has it.
 *
 * OPTIONAL FIELDS NOT USED BELOW YET:
 *   photo    → an ImageAsset. Supply it and the card shows a grayscale portrait instead of the
 *              initials ring. { src, width, height, alt }
 *   interest → adds a final line "Currently interested in: …" to the card.
 *   links    → declared in the type but not rendered on the card yet.
 */
export const team: TeamMember[] = [
  {
    id: 'cap',
    name: 'Cap',
    role: 'Founder, front-end lead',
    bio: 'Front-end engineer with about ten years of experience and a degree in Computer Science (AI). Leads design systems, performance and the way every project feels in the hand.',
    interest: 'Applied AI in the browser',
    placeholder: true,
  },
  {
    id: 'amira-rahman',
    name: 'Amira Rahman',
    role: 'Backend and cloud engineer',
    bio: 'Builds the APIs, queues and databases that keep products calm under load. Writes the runbook before the launch, not after the incident.',
    interest: 'Observability and cost control',
    placeholder: true,
  },
  {
    id: 'daniel-lee',
    name: 'Daniel Lee',
    role: 'Mobile engineer',
    bio: 'Ships Flutter apps for iOS and Android from one codebase. Cares about offline behaviour, startup time and how an app feels on a three-year-old phone.',
    interest: 'On-device machine learning',
    placeholder: true,
  },
  {
    id: 'sofia-marin',
    name: 'Sofia Marin',
    role: 'Product designer',
    bio: 'Turns vague ideas into flows people can test in a day. Keeps the interface clear first and clever second, and hands engineers specs they can build from.',
    interest: 'Motion that explains',
    placeholder: true,
  },
];
