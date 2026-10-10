import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import { formatDate } from '@/lib/format';
import type { Note } from '@/types/content';

/** Studio notes: one featured note plus a list. Each row is a single link; dates use <time datetime>. */
export function NotesFeed({ notes }: { notes: Note[] }) {
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted.find((n) => n.featured) ?? sorted[0];
  const rest = sorted.filter((n) => n !== featured).slice(0, 6);
  if (!featured) return null;
  return (
    <section id="notes" className="section container defer-render" aria-labelledby="notes-h">
      <div className="section__head">
        <div><p className="eyebrow" data-reveal>Studio notes</p><h2 id="notes-h" className="h2" data-reveal data-reveal-index={1}>Notes from the studio</h2></div>
        <Link href="/notes" className="btn btn--secondary">View all<Icon name="arrow-right" className="icon btn__arrow" /></Link>
      </div>
      <div className="notes">
        <article className="note-feature" data-reveal>
          <p className="note-feature__tag"><span className="badge">Featured</span><span className="mono muted">{featured.tags.join(' / ')}</span></p>
          <h3 className="h3"><Link href={`/notes/${featured.slug}`} className="note-feature__link">{featured.title}</Link>{SHOW_PLACEHOLDER_BADGE && featured.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</h3>
          <p className="lead">{featured.excerpt}</p>
          <p className="mono muted"><time dateTime={featured.date}>{formatDate(featured.date)}</time></p>
        </article>
        <ul className="notes__list">
          {rest.map((n, i) => (
            <li key={n.slug} data-reveal data-reveal-index={i}>
              <Link href={`/notes/${n.slug}`} className="note-row" data-track={`home.notes.${i + 1}`}>
                <span className="mono muted note-row__meta"><time dateTime={n.date}>{formatDate(n.date)}</time> · {n.tags.join(' / ')}</span>
                <span className="note-row__title">{n.title}{SHOW_PLACEHOLDER_BADGE && n.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</span>
                <span className="muted note-row__excerpt">{n.excerpt}</span>
                <Icon name="arrow-right" className="icon note-row__arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
