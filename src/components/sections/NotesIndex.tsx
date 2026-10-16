'use client';
import Link from 'next/link';
import { useState } from 'react';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import { formatDate } from '@/lib/format';
import type { Note } from '@/types/content';

/** Notes index: one featured note, a tag filter (aria-pressed buttons), then the list. */
export function NotesIndex({ notes }: { notes: Note[] }) {
  const [tag, setTag] = useState('');
  const tags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  const featured = tag ? undefined : sorted.find((n) => n.featured) ?? sorted[0];
  const list = sorted.filter((n) => n !== featured && (!tag || n.tags.includes(tag)));
  return (
    <div className="container">
      <div className="chip-row" role="group" aria-label="Filter notes by tag">
        <button type="button" className="chip" aria-pressed={!tag} onClick={() => setTag('')}>All</button>
        {tags.map((t) => (<button key={t} type="button" className="chip" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>))}
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">{tag ? `Showing ${list.length} ${tag} notes` : 'Showing all notes'}</p>
      {featured && (
        <article className="note-feature note-feature--wide">
          <p className="note-feature__tag"><span className="badge">Featured</span><span className="mono muted">{featured.tags.join(' / ')}</span></p>
          <h2 className="h2"><Link href={`/notes/${featured.slug}`} className="note-feature__link">{featured.title}</Link>{SHOW_PLACEHOLDER_BADGE && featured.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</h2>
          <p className="lead">{featured.excerpt}</p>
          <p className="mono muted"><time dateTime={featured.date}>{formatDate(featured.date)}</time></p>
        </article>
      )}
      <ul className="notes__list notes__list--wide">
        {list.map((n) => (
          <li key={n.slug}>
            <Link href={`/notes/${n.slug}`} className="note-row">
              <span className="mono muted note-row__meta"><time dateTime={n.date}>{formatDate(n.date)}</time> · {n.tags.join(' / ')}</span>
              <span className="note-row__title">{n.title}{SHOW_PLACEHOLDER_BADGE && n.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</span>
              <span className="muted note-row__excerpt">{n.excerpt}</span>
              <span className="dot-mark note-row__arrow" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
