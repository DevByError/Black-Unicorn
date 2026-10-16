import type { SiteConfig } from '@/types/content';

/**
 * WHERE THIS SHOWS UP: everywhere. This is the global site identity.
 *
 *   name        → browser tab titles on every page ("<page> — BlackUnicorn"), footer logo line,
 *                 hidden <h1> on the home page, and the author/creator name in the structured
 *                 data on case-study and note pages.
 *   tagline     → the home page tab title, the hidden home <h1>, and the big line under the
 *                 logo in the footer.
 *   description → the meta description of the home page (what Google shows under the link).
 *   url         → the base of every absolute link: sitemap.xml, robots.txt, social share cards.
 *   email       → Contact page "Email" row, footer Contact column, the line under the
 *                 "Start a project" block at the bottom of the home page, and the contact
 *                 form's send target. LEAVE IT UNSET and the form shows "not configured yet"
 *                 and all those links disappear.
 *   location    → Contact page "Location" row only. Hidden when unset.
 *   responseTime→ Contact page "Reply time" row only. Hidden when unset. (Add it to this object
 *                 when the team commits to one; it is optional in the type.)
 *   socials     → footer Contact column, the mobile menu footer, and the chip row on the
 *                 Contact page. An empty array hides all three.
 *   analytics   → set to anything other than 'none' and the cookie consent banner appears at
 *                 the bottom of every page.
 *   popularSearches → the suggestion chips inside the search overlay (the magnifier in the header)
 *                 before the visitor has typed anything.
 */
export const site: SiteConfig = {
  name: 'BlackUnicorn',
  tagline: 'We build software that stays fast.',
  description: 'BlackUnicorn is a software studio. See our selected work, how we build, and how to start a project.',
  url: 'https://blackunicorn.example',
  email: undefined, // [placeholder] set the real contact address; the form falls back to mailto only when this exists
  location: undefined,
  socials: [], // [placeholder] add { label: 'GitHub', href: 'https://…' } entries
  locales: ['en'],
  analytics: { provider: 'none' },
  popularSearches: ['Web', 'Mobile', 'AI', 'Automation', 'Process'],
  placeholder: true,
};
