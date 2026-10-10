'use client';
import { useId, useRef, useState } from 'react';
import { DOT, GAUGE_ARC, HORN_LEFT, HORN_RIGHT, MANES, RING, TICKS, VIEWBOX } from '@/lib/logo-geometry';
import type { ProcessStage } from '@/types/content';

/** One decorative illustration per stage, built from the logo's own parts. Solid colour, aria-hidden, draws on change. */
function Illustration({ stage, drawKey }: { stage: string; drawKey: string }) {
  const draw = { pathLength: 1, fill: 'none', stroke: 'currentColor', className: 'proc__draw' } as const;
  return (
    <svg key={drawKey} viewBox={VIEWBOX} className="proc__art" aria-hidden="true" focusable="false">
      {stage === 'discover' && <path d={RING} strokeWidth="14" {...draw} />}
      {stage === 'design' && (<><path d={GAUGE_ARC} strokeWidth="4" {...draw} /><path d={TICKS} strokeWidth="3" {...draw} /></>)}
      {stage === 'build' && (<><polygon points={HORN_LEFT} fill="currentColor" className="proc__fill" /><polygon points={HORN_RIGHT} fill="currentColor" className="proc__fill" /></>)}
      {stage === 'launch' && (<><circle cx={DOT.cx} cy={DOT.cy} r={DOT.r * 2.2} fill="currentColor" className="proc__fill" /><path d={RING} strokeWidth="6" {...draw} /></>)}
      {stage === 'evolve' && MANES.map((m) => (<path key={m.d} d={m.d} strokeWidth={m.w * 1.6} strokeLinecap="round" {...draw} />))}
    </svg>
  );
}

/**
 * Process tabs. role=tablist with automatic activation; arrow keys, Home and End. On small screens the tab list
 * becomes a horizontally scrollable strip above the panel. Illustrations are decorative.
 */
export function ProcessTabs({ stages, headingLevel = 'h2' }: { stages: ProcessStage[]; headingLevel?: 'h2' }) {
  const uid = useId();
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const cur = stages[i] ?? stages[0];
  const H = headingLevel;

  const onKey = (e: React.KeyboardEvent, n: number) => {
    const c = stages.length;
    const t = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (n + 1) % c : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (n - 1 + c) % c : e.key === 'Home' ? 0 : e.key === 'End' ? c - 1 : null;
    if (t === null) return;
    e.preventDefault();
    setI(t);
    refs.current[t]?.focus();
  };
  if (!cur) return null;

  return (
    <section id="process" className="section container defer-render" aria-labelledby="proc-h">
      <div className="section__head"><div><p className="eyebrow" data-reveal>Process</p><H id="proc-h" className="h2" data-reveal data-reveal-index={1}>How we work</H></div></div>
      <div className="proc">
        <div className="proc__tabs" role="tablist" aria-label="Stages of a project" aria-orientation="vertical" style={{ ['--active' as string]: i }}>
          <span className="proc__marker" aria-hidden="true" />
          {stages.map((s, n) => (
            <button
              key={s.id} ref={(el) => { refs.current[n] = el; }} id={`${uid}-t-${s.id}`} type="button" role="tab" aria-selected={n === i}
              aria-controls={`${uid}-p`} tabIndex={n === i ? 0 : -1} className="proc__tab" onClick={() => setI(n)} onKeyDown={(e) => onKey(e, n)}
            >
              <span className="mono proc__num">{String(n + 1).padStart(2, '0')}</span>
              <span className="proc__name font-display">{s.title}</span>
            </button>
          ))}
        </div>
        <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t-${cur.id}`} className="proc__panel" tabIndex={0}>
          <div className="proc__copy">
            <h3 className="h3">{cur.title}</h3>
            <p className="lead">{cur.summary}</p>
            <ul className="proc__bullets">{cur.bullets.map((b) => (<li key={b}>{b}</li>))}</ul>
            <p className="proc__deliver"><span className="eyebrow">What you get</span><br />{cur.deliverable}</p>
          </div>
          <Illustration stage={cur.id} drawKey={cur.id} />
        </div>
      </div>
    </section>
  );
}
