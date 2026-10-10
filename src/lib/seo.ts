import type { Metadata } from 'next';
import { site } from '@/content/site';

/** Per-route metadata: unique title and description, canonical URL, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, type = 'website' }: { title: string; description: string; path: string; type?: 'website' | 'article' }): Metadata {
  const url = new URL(path, site.url).toString();
  const image = '/og/default.png';
  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical: url },
    openGraph: { title: `${title} — ${site.name}`, description: description.slice(0, 160), url, siteName: site.name, type, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: `${title} — ${site.name}`, description: description.slice(0, 160), images: [image] },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: new URL(it.path, site.url).toString() })),
  };
}
