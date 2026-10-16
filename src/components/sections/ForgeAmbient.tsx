'use client';
import { useEffect, useRef } from 'react';
import { RING, GAUGE_ARC, RING_CENTER, tickSegments } from '@/lib/logo-geometry';
import { isMotionReduced } from '@/lib/useReducedMotion';

interface Ember { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; sway: number }

const MAX = 38;
const TICKS = tickSegments();

/**
 * Ambient "forge" for the dark closing band: the brand gauge (ring, ticks, sweeping needle) drawn large and faint,
 * and small flat gold embers rising behind the content. Same visual language as the intro (flat squares, one colour,
 * no glow). Purely decorative (aria-hidden, pointer-events none).
 *
 * The gauge is CSS-animated, so the global reduced-motion rules switch it off. The embers are a canvas loop that only
 * runs while the band is on screen and the tab is visible, and never starts when the visitor prefers reduced motion.
 */
export function ForgeAmbient() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const host = cv?.parentElement;
    const ctx = cv?.getContext('2d');
    if (!cv || !host || !ctx) return;
    const section = host.parentElement ?? host;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, last = 0, visible = false, spawnIn = 0;
    let embers: Ember[] = [];

    const fit = () => {
      w = host.clientWidth; h = host.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = () => {
      embers.push({ x: Math.random() * w, y: h + 6, vx: 0, vy: -(26 + Math.random() * 54), age: 0, life: 4 + Math.random() * 4, size: 2 + Math.random() * 2.4, sway: Math.random() * Math.PI * 2 });
    };
    const frame = (t: number) => {
      raf = 0;
      if (!visible || document.hidden || isMotionReduced()) { ctx.clearRect(0, 0, w, h); return; }
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      spawnIn -= dt;
      if (spawnIn <= 0 && embers.length < MAX) { spawn(); spawnIn = 0.12 + Math.random() * 0.2; }
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(section).color; // gold on the ink band, ink on the gold band
      embers = embers.filter((e) => e.age < e.life && e.y > -10);
      for (const e of embers) {
        e.age += dt;
        e.y += e.vy * dt;
        e.x += Math.sin(e.age * 1.3 + e.sway) * 14 * dt;
        const k = e.age / e.life;
        ctx.globalAlpha = Math.min(1, k * 6) * (1 - k) * 0.85; // quick fade-in, slow fade-out
        ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && visible && !document.hidden && !isMotionReduced()) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible) start(); }, { threshold: 0.05 });
    io.observe(host);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('bu:motion', start);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('bu:motion', start);
    };
  }, []);

  return (
    <div className="cta__fx" aria-hidden="true">
      <svg className="cta__mark" viewBox="0 0 400 420" focusable="false">
        <path d={RING} fill="none" stroke="currentColor" strokeWidth="6" />
        <path d={GAUGE_ARC} fill="none" stroke="currentColor" strokeWidth="2.5" />
        {TICKS.map((t, i) => (
          <line key={i} className="cta__tick" style={{ '--i': i } as React.CSSProperties} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth="3" />
        ))}
        <line className="cta__needle" x1={RING_CENTER.x} y1={RING_CENTER.y} x2={RING_CENTER.x + 122} y2={RING_CENTER.y} stroke="currentColor" strokeWidth="3" />
        <circle cx={RING_CENTER.x} cy={RING_CENTER.y} r="7" fill="currentColor" />
      </svg>
      <canvas ref={canvas} />
    </div>
  );
}
