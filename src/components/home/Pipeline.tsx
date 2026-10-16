'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { isMotionReduced } from '@/lib/useReducedMotion';
import type { ProcessStage } from '@/types/content';

const STEP_MS = 5000;

/**
 * "How we ship" as a pipeline: stages are nodes on a line, a packet travels the line, and the open stage advances
 * every 5 seconds. It pauses while the pointer or focus is inside, when the section is off-screen or the tab is
 * hidden, when the visitor presses Pause, and never starts under reduced motion. Tablist semantics, arrow keys.
 */
export function Pipeline({ stages }: { stages: ProcessStage[] }) {
  const uid = useId();
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = stages.length;

  useEffect(() => { setReduced(isMotionReduced()); }, []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const running = !reduced && !userPaused && !hover && !focusIn && onScreen;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setI((v) => (v + 1) % n), STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, i, n]);

  const go = (t: number, focus = false) => { setI(t); if (focus) tabs.current[t]?.focus(); };
  const onKey = (e: React.KeyboardEvent, at: number) => {
    const t = e.key === 'ArrowRight' ? (at + 1) % n : e.key === 'ArrowLeft' ? (at - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : null;
    if (t === null) return;
    e.preventDefault();
    go(t, true);
  };
  const s = stages[i];
  if (!s) return null;

  return (
    <section id="process" className="section container defer-render" aria-labelledby="pipe-h">
      <div className="sec-head">
        <p className="sec-head__tag mono" data-reveal><span>03</span> pipeline</p>
        <h2 id="pipe-h" className="h2" data-reveal data-reveal-index={1}>From first call to live</h2>
      </div>
      <div
        ref={root} className="pipe" style={{ '--n': n, '--at': i } as React.CSSProperties}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(true); }} onPointerLeave={() => setHover(false)}
        onFocus={() => setFocusIn(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusIn(false); }}
      >
        <div className="pipe__line" aria-hidden="true"><span className="pipe__done" /><span className={`pipe__packet${running ? ' is-moving' : ''}`} /></div>
        <div className="pipe__nodes" role="tablist" aria-label="Project stages">
          {stages.map((st, k) => (
            <button
              key={st.id} ref={(el) => { tabs.current[k] = el; }} type="button" role="tab" id={`${uid}-t${k}`} aria-selected={k === i} aria-controls={`${uid}-p`}
              tabIndex={k === i ? 0 : -1} className={`pipe__node${k < i ? ' is-past' : ''}`} onClick={() => go(k)} onKeyDown={(e) => onKey(e, k)}
            >
              <span className="pipe__dot" aria-hidden="true" />
              <span className="mono pipe__num">{String(k + 1).padStart(2, '0')}</span>
              <span className="pipe__name font-display">{st.title}</span>
            </button>
          ))}
        </div>
        <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t${i}`} className="pipe__panel" key={s.id}>
          <p className="h3 pipe__sum">{s.summary}</p>
          <ul className="pipe__bullets">{s.bullets.map((b) => (<li key={b}>{b}</li>))}</ul>
          <p className="pipe__out"><span className="mono">you get</span> {s.deliverable}</p>
        </div>
        {!reduced && (
          <button type="button" className="step-btn pipe__pause" aria-pressed={userPaused} onClick={() => setUserPaused((v) => !v)}>
            {userPaused ? 'Play' : 'Pause'}<span className="visually-hidden"> automatic stage changes</span>
          </button>
        )}
      </div>
    </section>
  );
}
