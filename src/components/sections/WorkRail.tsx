'use client';
import Link from 'next/link';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ProjectCard } from '@/components/work/ProjectCard';
import { labelFor } from '@/content/projects';
import { isMotionReduced } from '@/lib/useReducedMotion';
import type { Project } from '@/types/content';

const INTERVAL_MS = 5000;

/**
 * Featured work carousel with a segmented control (role=tablist). Arrow keys move between segments, Home/End jump,
 * selection activates immediately and is announced politely.
 *
 * Three cards are visible at a time on desktop (two on tablet, one on phones). Every 5 seconds it moves ONE card
 * (cards 1-2-3 become 2-3-4), and wraps back to the start after the last. Autoplay stops while the pointer is over the
 * carousel or focus is inside it, while the tab is hidden or the section is off-screen, and always when the visitor
 * has pressed Pause or prefers reduced motion. Manual arrows restart the 5-second wait. The scroller is native
 * (touch swipe works) with the scrollbar hidden.
 */
export function WorkRail({ projects }: { projects: Project[] }) {
  const uid = useId();
  const segments = useMemo(() => {
    const ds: string[] = [];
    for (const p of projects) for (const d of p.disciplines) if (!ds.includes(d)) ds.push(d);
    return ['all', ...ds.slice(0, 4)];
  }, [projects]);
  const [seg, setSeg] = useState('all');
  const rail = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  /** Where the last move is heading. Lets quick repeated clicks stack up instead of re-reading a half-finished smooth scroll. */
  const target = useRef<{ index: number; timer: number } | null>(null);
  const [pos, setPos] = useState({ first: 0, visible: 3 });
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(true); // true until proven otherwise, so nothing moves before hydration
  const [tick, setTick] = useState(0); // bumped on any manual move to restart the 5 s wait

  const shown = seg === 'all' ? projects : projects.filter((p) => p.disciplines.includes(seg));
  const label = seg === 'all' ? 'All' : labelFor(seg);
  const announce = `Showing ${shown.length} ${seg === 'all' ? '' : labelFor(seg).toLowerCase() + ' '}project${shown.length === 1 ? '' : 's'}`.replace('  ', ' ');

  /** Width of one step (card + gap) and how many cards fit, read from the real layout so CSS breakpoints stay the single source. */
  const geometry = useCallback(() => {
    const el = rail.current;
    const items = el?.querySelectorAll<HTMLElement>('.rail__item');
    const first = items?.[0];
    if (!el || !items || !first) return null;
    const second = items[1];
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const gap = Math.max(0, step - first.offsetWidth);
    const visible = Math.max(1, Math.round((el.clientWidth + gap) / Math.max(1, step)));
    return { el, step, visible, count: items.length };
  }, []);

  const measure = useCallback(() => {
    const g = geometry();
    if (!g) return;
    setPos({ first: Math.round(g.el.scrollLeft / Math.max(1, g.step)), visible: g.visible });
  }, [geometry]);

  useEffect(() => { setReduced(isMotionReduced()); }, []);
  useEffect(() => { measure(); }, [seg, measure]);
  useEffect(() => { rail.current?.scrollTo({ left: 0, behavior: 'auto' }); /* new filter: start from the first card */ }, [seg]);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const vis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, [measure]);

  /** Move one card. Past either end it wraps, so the arrows and the autoplay never dead-end. */
  const move = useCallback((dir: 1 | -1) => {
    const g = geometry();
    if (!g) return;
    const max = Math.max(0, g.count - g.visible);
    const cur = target.current?.index ?? Math.round(g.el.scrollLeft / Math.max(1, g.step));
    const next = cur + dir > max ? 0 : cur + dir < 0 ? max : cur + dir;
    if (target.current) window.clearTimeout(target.current.timer);
    target.current = { index: next, timer: window.setTimeout(() => { target.current = null; }, 900) };
    g.el.scrollTo({ left: next * g.step, behavior: isMotionReduced() ? 'auto' : 'smooth' });
  }, [geometry]);

  const canMove = shown.length > pos.visible;
  const autoplay = canMove && !reduced && !userPaused && !hover && !focusIn && onScreen && !tabHidden;
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => { move(1); setTick((t) => t + 1); }, INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, tick, move]);

  const goTo = (k: number) => {
    const g = geometry();
    if (!g) return;
    if (target.current) window.clearTimeout(target.current.timer);
    target.current = { index: k, timer: window.setTimeout(() => { target.current = null; }, 900) };
    g.el.scrollTo({ left: k * g.step, behavior: isMotionReduced() ? 'auto' : 'smooth' });
    setTick((t) => t + 1);
  };
  const manual = (dir: 1 | -1) => { move(dir); setTick((t) => t + 1); };
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
      <div className="sec-head sec-head--row">
        <div>
          <p className="sec-head__tag mono" data-reveal><span>02</span> selected work</p>
          <h2 id="work-h" className="h2" data-reveal data-reveal-index={1}>Things we have shipped</h2>
        </div>
        <Link href="/work" className="btn btn--secondary">View all work</Link>
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

      <div
        className="rail-wrap"
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(true); }}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setFocusIn(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusIn(false); }}
        onTouchStart={() => { target.current = null; setTick((t) => t + 1); }}
        onWheel={() => { target.current = null; }}
      >
        <div
          ref={rail} id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${seg}`} className="rail" tabIndex={0}
          aria-label={`${label} projects, scrollable. Use the left and right arrow keys to move.`} onScroll={measure}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === 'ArrowRight') { e.preventDefault(); manual(1); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); manual(-1); }
          }}
        >
          {shown.map((p, i) => (
            <div key={p.slug} className="rail__item"><ProjectCard project={p} ratio="landscape" expandable index={i} track={`home.rail.${i + 1}`} /></div>
          ))}
        </div>
        {canMove && (
          <div className="rail__btns">
            <ul className="ticks" aria-label="Choose which projects to show">
              {Array.from({ length: shown.length - pos.visible + 1 }, (_, k) => (
                <li key={k}>
                  <button type="button" className="tick" aria-current={k === pos.first ? 'true' : undefined} onClick={() => goTo(k)}>
                    <span className="tick__bar" aria-hidden="true" />
                    <span className="visually-hidden">Show projects {k + 1} to {k + pos.visible}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mono muted rail__count" aria-hidden="true">
              {String(pos.first + 1).padStart(2, '0')}–{String(Math.min(shown.length, pos.first + pos.visible)).padStart(2, '0')} / {String(shown.length).padStart(2, '0')}
            </p>
            {!reduced && (
              <button type="button" className="step-btn" aria-pressed={userPaused} onClick={() => setUserPaused((v) => !v)}>
                {userPaused ? 'Play' : 'Pause'}<span className="visually-hidden"> automatic scrolling</span>
              </button>
            )}
            <button type="button" className="step-btn" onClick={() => manual(-1)}>Prev<span className="visually-hidden"> projects</span></button>
            <button type="button" className="step-btn" onClick={() => manual(1)}>Next<span className="visually-hidden"> projects</span></button>
          </div>
        )}
      </div>
    </section>
  );
}
