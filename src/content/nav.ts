import type { NavPanel } from '@/types/content';

/* ═══════════════════════════════════════════════════════════════════════════════════════
 *  HOW TO FILL THIS FILE   (every field is on its own line: change the value after the colon)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 *  This is the header menu. Keep the quotes '' and the comma at the end of every line.
 *  Each top-level block (Work, Services, Studio) is a drop-down: label = the button, href = where the button itself goes.
 *  links: each { label, href, description } block is one line in the drop-down. description is optional.
 *  Link targets: /work?d=web filters the Work page; /services#<id> jumps to a service (ids live in services.ts); /studio#team etc. jump to a Studio section.
 *  plainNav (bottom) = the menu items that have no drop-down (Notes, Contact).
 *  The first block's id (work, services, studio) is used by the menu code: do not rename the ids.
 */

export const nav: NavPanel[] = [
  {
    id: 'work',
    label: 'Work',
    href: '/work',
    links: [
      {
        label: 'Web',
        href: '/work?d=web',
        description: 'Sites and web apps',
      },
      {
        label: 'Mobile',
        href: '/work?d=mobile',
        description: 'iOS and Android apps',
      },
      {
        label: 'AI',
        href: '/work?d=ai',
        description: 'Applied machine learning',
      },
      {
        label: 'Automation',
        href: '/work?d=automation',
        description: 'Workflows that run themselves',
      },
      {
        label: 'All work',
        href: '/work',
      },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    links: [
      {
        label: 'Web engineering',
        href: '/services#web-engineering',
        description: 'Fast, accessible, maintainable.',
      },
      {
        label: 'Mobile apps',
        href: '/services#mobile-apps',
        description: 'One codebase, native feel.',
      },
      {
        label: 'AI integration',
        href: '/services#ai-integration',
        description: 'Useful, measured, honest.',
      },
      {
        label: 'Automation',
        href: '/services#automation',
        description: 'Fewer clicks, fewer mistakes.',
      },
      {
        label: 'Product design',
        href: '/services#product-design',
        description: 'Clear interfaces, calm systems.',
      },
      {
        label: 'All services',
        href: '/services',
      },
    ],
  },
  {
    id: 'studio',
    label: 'Studio',
    href: '/studio',
    quote: 'The seam is where the work opens up.',
    links: [
      {
        label: 'About',
        href: '/studio',
      },
      {
        label: 'Team',
        href: '/studio#team',
      },
      {
        label: 'Process',
        href: '/studio#process',
      },
      {
        label: 'Stack & partners',
        href: '/studio#stack',
      },
    ],
  },
];

export const plainNav = [
  {
    label: 'Notes',
    href: '/notes',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
] as const;
