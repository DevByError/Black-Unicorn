'use client';
import { useEffect, useRef } from 'react';
import { isMotionReduced } from '@/lib/useReducedMotion';

const STEP = 36; // grid pitch in CSS px
const MAX_PACKETS = 12;

interface Packet { gx: number; gy: number; dx: number; dy: number; t: number; speed: number; life: number; trail: { x: number; y: number }[] }

/**
 * One page-wide living background, the same on every section so the whole site shares one surface.
 *
 *  - a quiet dot grid that breathes in slow waves and lifts near the pointer,
 *  - small packets (flat squares with a short trail) that travel along the grid lines and turn at junctions, like data on a bus.
 *
 * Flat, one colour (the accent), no glow, no gradients. It sits behind everything (fixed, pointer-events none) and
 * stops when the tab is hidden. Reduced motion draws one still frame of the grid and nothing moves.
 */
export function AmbientBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, last = 0, spawnIn = 0.4;
    let px = -9999, py = -9999;
    let packets: Packet[] = [];
    let color = '212,168,58';
    let light = false;

    const readTheme = () => {
      light = document.documentElement.dataset.theme === 'light';
      color = light ? '122,87,0' : '212,168,58';
    };
    const fit = () => {
      w = window.innerWidth; h = window.innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / STEP) + 1; rows = Math.ceil(h / STEP) + 1;
    };
    const spawn = () => {
      const horizontal = Math.random() < 0.5;
      const gx = Math.floor(Math.random() * cols), gy = Math.floor(Math.random() * rows);
      const dir = Math.random() < 0.5 ? 1 : -1;
      packets.push({ gx, gy, dx: horizontal ? dir : 0, dy: horizontal ? 0 : dir, t: 0, speed: 2.2 + Math.random() * 2.6, life: 0, trail: [] });
    };

    const draw = (time: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const baseA = light ? 0.2 : 0.17;
      // dot grid
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const x = gx * STEP, y = gy * STEP;
          let a = baseA;
          if (animate) {
            a += 0.07 * Math.sin(time * 0.0009 + gx * 0.35 + gy * 0.25);
            const d = Math.hypot(x - px, y - py);
            if (d < 170) a += (1 - d / 170) * (light ? 0.55 : 0.6);
          }
          ctx.fillStyle = `rgba(${color},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
          const s = a > 0.4 ? 3 : 2;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      // packets
      for (const p of packets) {
        const x = (p.gx + p.dx * p.t) * STEP, y = (p.gy + p.dy * p.t) * STEP;
        const fade = Math.min(1, p.life * 2) * Math.max(0, 1 - p.life / 9);
        for (let i = 0; i < p.trail.length; i++) {
          const q = p.trail[i] ?? { x: 0, y: 0 };
          ctx.fillStyle = `rgba(${color},${((i + 1) / p.trail.length * 0.28 * fade).toFixed(3)})`;
          ctx.fillRect(q.x - 2, q.y - 2, 4, 4);
        }
        ctx.fillStyle = `rgba(${color},${(0.85 * fade).toFixed(3)})`;
        ctx.fillRect(x - 3, y - 3, 6, 6);
      }
    };

    const frame = (t: number) => {
      raf = 0;
      if (document.hidden) return;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      spawnIn -= dt;
      if (spawnIn <= 0 && packets.length < MAX_PACKETS) { spawn(); spawnIn = 0.5 + Math.random() * 0.9; }
      for (const p of packets) {
        p.life += dt;
        p.t += p.speed * dt;
        p.trail.push({ x: (p.gx + p.dx * p.t) * STEP, y: (p.gy + p.dy * p.t) * STEP });
        if (p.trail.length > 9) p.trail.shift();
        if (p.t >= 1) { // reached the next junction: step there and maybe turn
          p.gx += p.dx; p.gy += p.dy; p.t -= 1;
          if (Math.random() < 0.3) { const turn = Math.random() < 0.5 ? 1 : -1; const ndx = -p.dy * turn, ndy = p.dx * turn; p.dx = ndx; p.dy = ndy; }
        }
      }
      packets = packets.filter((p) => p.life < 9 && p.gx > -2 && p.gy > -2 && p.gx < cols + 2 && p.gy < rows + 2);
      draw(t, true);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf); raf = 0;
      readTheme();
      if (isMotionReduced()) { draw(0, false); return; }
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => { px = e.clientX; py = e.clientY; };
    const onLeave = () => { px = -9999; py = -9999; };
    const onResize = () => { fit(); if (isMotionReduced()) draw(0, false); };
    const onVis = () => { if (!document.hidden) start(); };

    fit();
    start();
    const themeObserver = new MutationObserver(start);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('bu:motion', start);
    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('bu:motion', start);
    };
  }, []);

  return <canvas ref={ref} className="ambient-bg" aria-hidden="true" />;
}
