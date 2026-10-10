'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { labelFor } from '@/content/projects';
import { isMotionReduced } from '@/lib/useReducedMotion';
import type { Project } from '@/types/content';
import { ProjectCard } from './ProjectCard';

type FlipModule = typeof import('gsap/Flip');
type GsapModule = typeof import('gsap');

/**
 * Work index with URL-synced filters (?d=web&y=2026). Filters are aria-pressed buttons that also write the query,
 * so state is shareable and back/forward works. Cards that stay move with GSAP Flip; the plugin loads lazily on idle
 * and is skipped under reduced motion.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const d = params.get('d') ?? '';
  const y = params.get('y') ?? '';
  const grid = useRef<HTMLUListElement>(null);
  const flip = useRef<{ Flip: FlipModule['Flip']; gsap: GsapModule['default'] } | null>(null);
  const pending = useRef<ReturnType<FlipModule['Flip']['getState']> | null>(null);

  const disciplines = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.disciplines))), [projects]);
  const years = useMemo(() => Array.from(new Set(projects.map((p) => String(p.year)))).sort().reverse(), [projects]);
  const shown = projects.filter((p) => (!d || p.disciplines.includes(d)) && (!y || String(p.year) === y));

  useEffect(() => {
    if (isMotionReduced()) return;
    const load = () => Promise.all([import('gsap'), import('gsap/Flip')]).then(([g, f]) => { g.default.registerPlugin(f.Flip); flip.current = { Flip: f.Flip, gsap: g.default }; });
    // Safari lacks requestIdleCallback: fall back to a short timeout.
    const idle = typeof window.requestIdleCallback === 'function';
    const id = idle ? window.requestIdleCallback(() => void load()) : window.setTimeout(() => void load(), 800);
    return () => (idle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);

  useLayoutEffect(() => {
    const f = flip.current;
    const state = pending.current;
    pending.current = null;
    if (!f || !state || isMotionReduced()) return;
    f.Flip.from(state, { duration: 0.42, ease: 'power3.out', absolute: false, onEnter: (els) => f.gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.42 }) });
  }, [d, y]);

  const set = useCallback((key: 'd' | 'y', value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    if (flip.current && grid.current && !isMotionReduced()) pending.current = flip.current.Flip.getState(grid.current.querySelectorAll('.work-grid__item'));
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  const label = d ? `Showing ${shown.length} ${labelFor(d).toLowerCase()} project${shown.length === 1 ? '' : 's'}` : y || shown.length !== projects.length ? `Showing ${shown.length} project${shown.length === 1 ? '' : 's'}` : 'Showing all projects';
  const newest = [...projects].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3);

  return (
    <div className="container work">
      <div className="filters">
        <div className="chip-row" role="group" aria-label="Filter by discipline">
          <button type="button" className="chip" aria-pressed={!d} onClick={() => set('d', '')}>All</button>
          {disciplines.map((x) => (<button key={x} type="button" className="chip" aria-pressed={d === x} onClick={() => set('d', x)}>{labelFor(x)}</button>))}
        </div>
        <div className="filters__row">
          <label className="filters__year"><span className="visually-hidden">Year</span>
            <select value={y} onChange={(e) => set('y', e.target.value)}>
              <option value="">All years</option>
              {years.map((yr) => (<option key={yr} value={yr}>{yr}</option>))}
            </select>
          </label>
          <button type="button" className="btn btn--ghost" disabled={!d && !y} onClick={() => { pending.current = null; router.push(pathname, { scroll: false }); }}>Clear filters</button>
        </div>
      </div>
      <p className="mono muted" role="status" aria-live="polite">{label}</p>
      {shown.length > 0 ? (
        <ul ref={grid} className="work-grid">
          {shown.map((p, i) => (<li key={p.slug} className="work-grid__item"><ProjectCard project={p} index={i} track={`work.grid.${i + 1}`} /></li>))}
        </ul>
      ) : (
        <div className="empty">
          <p className="h3">No projects match these filters.</p>
          <button type="button" className="btn btn--secondary" onClick={() => router.push(pathname, { scroll: false })}>Clear filters</button>
          <h2 className="h4">Newest work</h2>
          <ul className="work-grid">{newest.map((p) => (<li key={p.slug} className="work-grid__item"><ProjectCard project={p} /></li>))}</ul>
        </div>
      )}
    </div>
  );
}
