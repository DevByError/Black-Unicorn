import type { SiteConfig } from '@/types/content';

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
