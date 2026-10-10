import type { MetadataRoute } from 'next';
import { notes } from '@/content/notes';
import { projects } from '@/content/projects';
import { site } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['', '/work', '/services', '/studio', '/notes', '/contact', '/privacy', '/accessibility'];
  return [
    ...fixed.map((p) => ({ url: `${site.url}${p}` })),
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: p.published })),
    ...notes.map((n) => ({ url: `${site.url}/notes/${n.slug}`, lastModified: n.date })),
  ];
}
