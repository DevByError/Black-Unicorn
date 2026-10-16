import Link from 'next/link';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import { formatDate } from '@/lib/format';
import type { Feed } from '@/lib/feed';
import type { Note } from '@/types/content';

/**
 * "Radar": left column = our own notes, right column = developer reading from the build-time feed (see lib/feed.ts).
 * No visitor request leaves the site: the right-hand list was fetched when the site was built.
 */
export function Radar({ notes, feed }: { notes: Note[]; feed: Feed }) {
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted.find((n) => n.featured) ?? sorted[0];
  const rest = sorted.filter((n) => n !== featured).slice(0, 3);
  const live = feed.mode === 'live';
  return (
    <section id="notes" className="section container defer-render" aria-labelledby="notes-h">
      <div className="sec-head">
        <p className="sec-head__tag mono" data-reveal><span>05</span> radar</p>
        <h2 id="notes-h" className="h2" data-reveal data-reveal-index={1}>What we write and what we read</h2>
      </div>
      <div className="radar">
        <div className="radar__col" data-reveal>
          <p className="radar__label mono">our notes</p>
          {featured && (
            <article className="note-feature">
              <p className="note-feature__tag"><span className="badge">Featured</span><span className="mono muted">{featured.tags.join(' / ')}</span></p>
              <h3 className="h3"><Link href={`/notes/${featured.slug}`} className="note-feature__link">{featured.title}</Link>{SHOW_PLACEHOLDER_BADGE && featured.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</h3>
              <p className="muted">{featured.excerpt}</p>
              <p className="mono muted"><time dateTime={featured.date}>{formatDate(featured.date)}</time></p>
            </article>
          )}
          <ul className="notes__list">
            {rest.map((n, i) => (
              <li key={n.slug}>
                <Link href={`/notes/${n.slug}`} className="note-row" data-track={`home.notes.${i + 1}`}>
                  <span className="mono muted note-row__meta"><time dateTime={n.date}>{formatDate(n.date)}</time> · {n.tags.join(' / ')}</span>
                  <span className="note-row__title">{n.title}{SHOW_PLACEHOLDER_BADGE && n.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</span>
                  <span className="dot-mark note-row__arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/notes" className="btn btn--secondary">All notes</Link>
        </div>

        <div className="radar__col radar__col--feed" data-reveal data-reveal-index={1}>
          <p className="radar__label mono">
            <span className={`radar__pulse${live ? ' is-live' : ''}`} aria-hidden="true" />
            {live ? `live from ${feed.source}` : 'reading list'}
          </p>
          <ol className="feed" aria-label={live ? `Developer articles from ${feed.source}` : 'Recommended developer reading'}>
            {feed.items.map((it, i) => (
              <li key={it.url}>
                <a className="feed__item" href={it.url} target="_blank" rel="noopener noreferrer" data-track={`home.feed.${i + 1}`}>
                  <span className="feed__n mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="feed__main">
                    <span className="feed__title">{it.title}<span className="visually-hidden"> (opens in a new tab)</span></span>
                    <span className="feed__meta mono muted">
                      {[it.author, it.tags.slice(0, 2).map((t) => `#${t}`).join(' '), it.minutes ? `${it.minutes} min` : '', it.reactions ? `${it.reactions} reactions` : ''].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <p className="feed__note mono muted">
            {live
              ? <>Fetched from <a className="link-inline" href={feed.sourceUrl} target="_blank" rel="noopener noreferrer">{feed.source}<span className="visually-hidden"> (opens in a new tab)</span></a> when this site was last built ({formatDate(feed.fetchedAt.slice(0, 10))}). Your browser never contacts them from here.</>
              : <>A hand-picked list of official docs. The live developer feed could not be reached at build time.</>}
          </p>
        </div>
      </div>
    </section>
  );
}
