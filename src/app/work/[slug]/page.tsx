import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { Gallery } from '@/components/work/Lightbox';
import { ProjectThumb } from '@/components/work/ProjectThumb';
import { labelFor, projects } from '@/content/projects';
import { site } from '@/content/site';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMetadata({ title: `${p.title} — Work`, description: p.summary, path: `/work/${p.slug}` });
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  if (!p) notFound();
  const next = projects[(i + 1) % projects.length];
  const sections = [
    { n: '01', id: 'challenge', title: 'Challenge', body: p.challenge },
    { n: '02', id: 'approach', title: 'Approach', body: p.approach },
    { n: '03', id: 'outcome', title: 'Outcome', body: p.outcome },
  ];
  return (
    <article>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.summary, dateCreated: p.published, creator: { '@type': 'Organization', name: site.name }, keywords: p.stack.join(', ') }} />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }, { name: p.title, path: `/work/${p.slug}` }])} />
      <header className="page-head container">
        <nav aria-label="Breadcrumb" className="crumbs"><Link href="/work">Work</Link><span aria-hidden="true"> / </span><span aria-current="page">{p.title}</span></nav>
        <p className="eyebrow">{p.disciplines.map(labelFor).join(' / ')}</p>
        <h1 className="h1">{p.title}{SHOW_PLACEHOLDER_BADGE && p.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</h1>
        <p className="lead">{p.summary}</p>
        <dl className="meta">
          {!p.confidential && p.client && <div><dt>Client</dt><dd>{p.client}</dd></div>}
          <div><dt>Year</dt><dd>{p.year}</dd></div>
          <div><dt>Role</dt><dd>{p.role.join(', ')}</dd></div>
          <div><dt>Stack</dt><dd>{p.stack.join(', ')}</dd></div>
        </dl>
      </header>
      <div className="cover"><ProjectThumb project={p} wide priority /></div>
      <div className="container case">
        <aside className="case__toc" aria-label="In this project">
          <p className="eyebrow">In this project</p>
          <ul>{sections.map((s) => (<li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>))}</ul>
        </aside>
        <div className="case__body">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="case__section" aria-labelledby={`${s.id}-h`}>
              <span className="case__num font-display" aria-hidden="true">{s.n}</span>
              <h2 id={`${s.id}-h`} className="h2">{s.title}</h2>
              <p className="prose lead">{s.body}</p>
            </section>
          ))}
          {p.metrics && p.metrics.length > 0 && (
            <section className="case__section" aria-labelledby="m-h"><h2 id="m-h" className="h3">Results</h2>
              <dl className="meta">{p.metrics.map((m) => (<div key={m.label}><dt>{m.label}</dt><dd className="font-display">{m.value}</dd></div>))}</dl></section>
          )}
          {p.gallery && p.gallery.length > 0 && <section className="case__section" aria-labelledby="g-h"><h2 id="g-h" className="h3">Gallery</h2><Gallery images={p.gallery} title={p.title} /></section>}
          {p.testimonial && <figure className="case__quote"><blockquote className="h3">{p.testimonial.quote}</blockquote><figcaption>{p.testimonial.name}, {p.testimonial.role}</figcaption></figure>}
          <section className="case__section" aria-labelledby="s-h">
            <h2 id="s-h" className="h3">Stack and links</h2>
            <ul className="chip-row">{p.stack.map((t) => (<li key={t} className="chip chip--static">{t}</li>))}</ul>
            {p.links && p.links.length > 0 && (
              <ul className="chip-row">{p.links.map((l) => (<li key={l.href}><a className="btn btn--secondary" href={l.href} rel="noopener noreferrer">{l.label}<Icon name="arrow-up-right" className="icon btn__arrow" /></a></li>))}</ul>
            )}
          </section>
        </div>
      </div>
      {next && next.slug !== p.slug && (
        <Link href={`/work/${next.slug}`} className="next" aria-label={`Next project: ${next.title}`}>
          <span className="next__art" aria-hidden="true"><ProjectThumb project={next} wide /></span>
          <span className="container next__text"><span className="eyebrow">Next project</span><span className="h2">{next.title}</span></span>
          <span className="next__seam" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
