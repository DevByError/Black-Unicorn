'use client';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { site } from '@/content/site';
import { search, type SearchDoc } from '@/lib/search';

const GROUPS: SearchDoc['type'][] = ['Work', 'Notes', 'Services'];

/**
 * Full-screen search. The index is a small build-time JSON fetched on first open. Arrow keys move through results,
 * Enter opens, Escape closes (native dialog). Result count is announced politely.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open || docs || failed) return;
    fetch('/search-index.json').then((r) => r.json() as Promise<SearchDoc[]>).then(setDocs).catch(() => setFailed(true));
  }, [open, docs, failed]);
  useEffect(() => { if (open) requestAnimationFrame(() => input.current?.focus()); else setQ(''); }, [open]);

  const results = useMemo(() => (docs && q.trim() ? search(docs, q) : []), [docs, q]);
  const recent = useMemo(() => (docs ?? []).filter((d) => d.type === 'Work').slice(0, 3), [docs]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(`#${CSS.escape(listId)} a`));
    if (!links.length) return;
    e.preventDefault();
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
    links[i === -1 && e.key === 'ArrowUp' ? links.length - 1 : next]?.focus();
  };

  const count = results.length;
  return (
    <Dialog open={open} onClose={onClose} label="Search BlackUnicorn" className="search">
      <div className="search__inner container" onKeyDown={onKey}>
        <div className="search__top">
          <label htmlFor="search-input" className="eyebrow">Search BlackUnicorn</label>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search"><Icon name="close" /></button>
        </div>
        <input
          id="search-input" ref={input} className="search__input" type="text" role="searchbox" value={q} autoComplete="off" spellCheck={false}
          placeholder="Search projects, notes and services" onChange={(e) => setQ(e.target.value)}
        />
        <p className="visually-hidden" aria-live="polite">{q.trim() ? `${count} result${count === 1 ? '' : 's'}` : ''}</p>
        <div id={listId}>
          {!q.trim() && (
            <>
              <p className="eyebrow search__h">Popular searches</p>
              <div className="chip-row">{site.popularSearches.map((s) => (<button key={s} type="button" className="chip" onClick={() => setQ(s)}>{s}</button>))}</div>
              {recent.length > 0 && (<><p className="eyebrow search__h">Recent projects</p><ResultList docs={recent} onPick={onClose} /></>)}
            </>
          )}
          {q.trim() && count > 0 && GROUPS.map((g) => {
            const items = results.filter((r) => r.type === g);
            return items.length ? (<section key={g}><p className="eyebrow search__h">{g}</p><ResultList docs={items} onPick={onClose} /></section>) : null;
          })}
          {q.trim() && count === 0 && docs && (
            <div className="search__empty">
              <p className="h4">Nothing found for &ldquo;{q}&rdquo;. Try a shorter word, or browse all work.</p>
              <Link href="/work" className="btn btn--secondary" onClick={onClose}>Browse all work<Icon name="arrow-right" className="icon btn__arrow" /></Link>
            </div>
          )}
          {failed && <p className="muted">Search could not load. <Link className="link-inline" href="/work" onClick={onClose}>Browse all work</Link> instead.</p>}
        </div>
      </div>
    </Dialog>
  );
}

function ResultList({ docs, onPick }: { docs: SearchDoc[]; onPick: () => void }) {
  return (
    <ul className="search__list">
      {docs.map((d) => (
        <li key={d.href}>
          <Link href={d.href} className="search__result" onClick={onPick}>
            <span className="search__result-title">{d.title}</span>
            <span className="muted">{d.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
