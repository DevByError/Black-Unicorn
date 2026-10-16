'use client';
import { useEffect, useRef } from 'react';
import { SHOW_PLACEHOLDER_BADGE } from '@/lib/dev';
import { isMotionReduced } from '@/lib/useReducedMotion';
import type { Metric } from '@/types/content';

const COUNT_MS = 1400;

/** Ease-out-expo, matching the GSAP "expo.out" token without loading GSAP for a number. */
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function Kpi({ m }: { m: Metric }) {
  const ref = useRef<HTMLSpanElement>(null);
  const tile = useRef<HTMLDivElement>(null);
  const numeric = /^[\d.,]+$/.test(m.value);

  useEffect(() => {
    const t = tile.current;
    if (!t) return;
    const reduced = isMotionReduced();
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      t.classList.add('is-in');
      const el = ref.current;
      if (!el || !numeric || reduced) return;
      const target = parseFloat(m.value.replace(/,/g, ''));
      const decimals = (m.value.split('.')[1] ?? '').length;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / COUNT_MS);
        el.textContent = (target * expoOut(p)).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = m.value;
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(t);
    return () => io.disconnect();
  }, [m.value, numeric]);

  return (
    <div ref={tile} className="kpi" data-placeholder={m.placeholder || undefined}>
      <span className="kpi__rule" aria-hidden="true" />
      {/* The animated number is hidden from assistive tech; the final value is announced from the duplicate below. */}
      <p className="kpi__value font-display" aria-hidden="true"><span ref={ref}>{m.value}</span>{m.unit && <span className="kpi__unit">{m.unit}</span>}</p>
      <p className="visually-hidden">{m.label}: {m.value} {m.unit}</p>
      <p className="kpi__label">{m.label}{SHOW_PLACEHOLDER_BADGE && m.placeholder && <span className="ph-badge">PLACEHOLDER</span>}</p>
      {m.comparison && <p className="kpi__compare muted">{m.comparison}</p>}
    </div>
  );
}

/** "BlackUnicorn by the numbers". Real values only; placeholders render literally and do not animate. */
export function KpiBand({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="section container defer-render" aria-labelledby="kpi-h">
      <div className="sec-head"><p className="sec-head__tag mono" data-reveal><span>04</span> numbers</p><h2 id="kpi-h" className="h2" data-reveal data-reveal-index={1}>The scoreboard</h2></div>
      <div className="kpis">{metrics.map((m) => (<Kpi key={m.id} m={m} />))}</div>
    </section>
  );
}
