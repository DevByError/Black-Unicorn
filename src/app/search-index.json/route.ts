import { notes } from '@/content/notes';
import { projects, labelFor } from '@/content/projects';
import { services } from '@/content/services';
import type { SearchDoc } from '@/lib/search';

export const dynamic = 'force-static';

/** Built at export time into /search-index.json and fetched lazily the first time the search overlay opens. */
export function GET() {
  const docs: SearchDoc[] = [
    ...projects.map((p): SearchDoc => ({ type: 'Work', title: p.title, href: `/work/${p.slug}`, summary: p.summary, tags: p.disciplines.map(labelFor) })),
    ...notes.map((n): SearchDoc => ({ type: 'Notes', title: n.title, href: `/notes/${n.slug}`, summary: n.excerpt, tags: n.tags })),
    ...services.map((s): SearchDoc => ({ type: 'Services', title: s.name, href: `/services#${s.id}`, summary: s.summary, tags: [] })),
  ];
  return Response.json(docs);
}
