'use client';
import Link from 'next/link';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ProjectCard } from '@/components/work/ProjectCard';
import { labelFor } from '@/content/projects';
import { isMotionReduced } from '@/lib/useReducedMotion';
import type { Project } from '@/types/content';

/**
 * Featured work rail with a segmented control (role=tablist). Arrow keys move between segments, Home/End jump,
 * selection activates immediately and is announced politely. The rail is a native scroller with scroll-snap;
 * prev/next buttons disable at the ends.
 */
export function WorkRail({ projects }: { projects: Project[] }) {
  const uid = useId();
  const segments = useMemo(() => {
    const ds: string[] = [];
    for (const p of projects) for (const d of p.disciplines) if (!ds.includes(d)) ds.push(d);
    return ['all', ...ds.slice(0, 4)];
  }, [projects]);
  const [seg, setSeg] = useState('all');
  const [edge, setEdge] = useState({ start: true, end: false });
  const rail = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const shown = seg === 'all' ? projects : projects.filter((p) => p.disciplines.includes(seg));
  const label = seg === 'all' ? 'All' : labelFor(seg);
  const announce = `Showing ${shown.length} ${seg === 'all' ? '' : labelFor(seg).toLowerCase() + ' '}project${shown.length === 1 ? '' : 's'}`.replace('  ', ' ');

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);
  useEffect(() => { measure(); }, [seg, measure]);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: isMotionReduced() ? 'auto' : 'smooth' });
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = segments.length;
    const t = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : null;
    if (t === null) return;
    e.preventDefault();
    const s = segments[t];
    if (s) { setSeg(s); tabs.current[t]?.focus(); }
  };

  return (
    <section id="work" className="section container defer-render" aria-labelledby="work-h">
      <div className="section__head">
        <div>
          <p className="eyebrow" data-reveal>Selected work</p>
          <h2 id="work-h" className="h2" data-reveal data-reveal-index={1}>Work we are proud to show</h2>
        </div>
        <Link href="/work" className="btn btn--secondary">View all work<Icon name="arrow-right" className="icon btn__arrow" /></Link>
      </div>

      <div className="segmented" role="tablist" aria-label="Filter featured work by discipline">
        {segments.map((s, i) => (
          <button
            key={s} ref={(el) => { tabs.current[i] = el; }} id={`${uid}-tab-${s}`} type="button" role="tab" aria-selected={seg === s}
            aria-controls={`${uid}-panel`} tabIndex={seg === s ? 0 : -1} className="segmented__tab" onClick={() => setSeg(s)} onKeyDown={(e) => onKey(e, i)}
          >
            {s === 'all' ? 'All' : labelFor(s)}
          </button>
        ))}
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">{announce}</p>

      <div className="rail-wrap">
        <div
          ref={rail} id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${seg}`} className="rail" tabIndex={0}
          aria-label={`${label} projects, scrollable`} onScroll={measure}
        >
          {shown.map((p, i) => (
            <div key={p.slug} className="rail__item"><ProjectCard project={p} ratio="portrait" expandable index={i} track={`home.rail.${i + 1}`} /></div>
          ))}
        </div>
        <div className="rail__btns">
          <button type="button" className="icon-btn" disabled={edge.start} onClick={() => scrollBy(-1)}><Icon name="arrow-left" /><span className="visually-hidden">Previous projects</span></button>
          <button type="button" className="icon-btn" disabled={edge.end} onClick={() => scrollBy(1)}><Icon name="arrow-right" /><span className="visually-hidden">Next projects</span></button>
        </div>
      </div>
    </section>
  );
}
