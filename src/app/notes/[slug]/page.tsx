import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { notes } from '@/content/notes';
import { site } from '@/content/site';
import { formatDate, readingMinutes } from '@/lib/format';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import { CopyLink } from '@/components/ui/CopyLink';

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = notes.find((x) => x.slug === slug);
  return n ? pageMetadata({ title: `${n.title} — Notes`, description: n.excerpt, path: `/notes/${n.slug}`, type: 'article' }) : {};
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  const i = sorted.findIndex((x) => x.slug === slug);
  const n = sorted[i];
  if (!n) notFound();
  const newer = sorted[i - 1];
  const older = sorted[i + 1];
  const paragraphs = n.body.split(/\n\n+/);
  return (
    <article className="container note">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: n.title, datePublished: n.date, description: n.excerpt, author: { '@type': 'Organization', name: site.name } }} />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Notes', path: '/notes' }, { name: n.title, path: `/notes/${n.slug}` }])} />
      <header className="page-head page-head--flush">
        <nav aria-label="Breadcrumb" className="crumbs"><Link href="/notes">Notes</Link><span aria-hidden="true"> / </span><span aria-current="page">{n.title}</span></nav>
        <p className="eyebrow">{n.tags.join(' / ')}</p>
        <h1 className="h1">{n.title}</h1>
        <p className="mono muted"><time dateTime={n.date}>{formatDate(n.date)}</time> · {readingMinutes(n.body)} min read</p>
      </header>
      <div className="prose note__body">{paragraphs.map((t) => (<p key={t}>{t}</p>))}</div>
      <div className="note__share"><CopyLink /><a className="btn btn--ghost" href={`mailto:?subject=${encodeURIComponent(n.title)}`}><Icon name="mail" />Email this note</a></div>
      <nav aria-label="More notes" className="note__pn">
        {newer ? <Link href={`/notes/${newer.slug}`} rel="prev"><span className="eyebrow">Newer</span><span>{newer.title}</span></Link> : <span />}
        {older ? <Link href={`/notes/${older.slug}`} rel="next"><span className="eyebrow">Older</span><span>{older.title}</span></Link> : <span />}
      </nav>
    </article>
  );
}
