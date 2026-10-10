import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { EASE } from '@/lib/motion';
import { finishIntro } from './finish';
import { Sparks } from './sparks';

gsap.registerPlugin(SplitText);

export type IntroMode = 'full' | 'short' | 'reduced';

const q = <T extends Element>(s: string) => document.querySelector(s) as T | null;
/** DOM lookup for elements the server-rendered intro guarantees; throws (and the watchdog cleans up) if absent. */
function must<T extends Element>(s: string): T {
  const el = q<T>(s);
  if (!el) throw new Error(`Intro element missing: ${s}`);
  return el;
}
function splitOf(rt: { split: SplitText | null }): SplitText {
  if (!rt.split) throw new Error('Intro word was not split');
  return rt.split;
}
const SVG_CX = 200;
const SVG_CY = 235;
/** Watchdog: if anything stalls the overlay is removed so it can never trap a visitor (Part 13.11). */
const WATCHDOG_MS = 7000;

interface Rt {
  mode: IntroMode;
  slow: boolean;
  sparks: Sparks | null;
  split: SplitText | null;
  hdrSplit: SplitText | null;
  tls: gsap.core.Timeline[];
  done: boolean;
  watchdog: number;
  onKey: (e: KeyboardEvent) => void;
  onSkip: () => void;
}

export async function startIntro(mode: IntroMode) {
  const root = document.documentElement;
  const rt: Rt = {
    mode, slow: root.getAttribute('data-intro-flag') === 'slow', sparks: null, split: null, hdrSplit: null,
    tls: [], done: false, watchdog: 0, onKey: () => {}, onSkip: () => {},
  };
  const overlay = q<HTMLElement>('#intro');
  if (!overlay) return finishIntro(false);

  document.querySelectorAll('header, main, footer').forEach((n) => n.setAttribute('inert', ''));
  rt.watchdog = window.setTimeout(() => end(rt, false), WATCHDOG_MS * (rt.slow ? 4 : 1));

  const fastForward = () => {
    // Never a hard cut: speed everything up so the final state is always reached properly.
    gsap.globalTimeline.timeScale(10);
  };
  rt.onSkip = fastForward;
  rt.onKey = (e) => { if (e.key === 'Escape') fastForward(); };
  q<HTMLButtonElement>('#intro-skip')?.addEventListener('click', rt.onSkip, { once: true });
  window.addEventListener('keydown', rt.onKey);
  window.addEventListener('pagehide', () => end(rt, false), { once: true });

  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
  if (rt.done) return;

  overlay.dataset.state = 'running';
  q<HTMLButtonElement>('#intro-skip')?.focus({ preventScroll: true });

  if (mode === 'reduced') return reduced(rt);
  rt.sparks = new Sparks(must<HTMLCanvasElement>('#intro-sparks'));
  rt.split = SplitText.create('#intro-word', { type: 'chars', charsClass: 'char' });
  if (mode === 'short') return short(rt);
  forge(rt);
}

function end(rt: Rt, played: boolean) {
  if (rt.done) return;
  rt.done = true;
  window.clearTimeout(rt.watchdog);
  finishIntro(played, () => {
    gsap.globalTimeline.timeScale(1);
    rt.tls.forEach((t) => t.kill());
    rt.sparks?.destroy();
    rt.split?.revert();
    rt.hdrSplit?.revert();
    window.removeEventListener('keydown', rt.onKey);
    gsap.set('#site-logo', { clearProps: 'visibility' });
  });
}

function reduced(rt: Rt) {
  const tl = gsap.timeline({ onComplete: () => end(rt, true) });
  rt.tls.push(tl);
  tl.fromTo('#intro-stage', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' })
    .to({}, { duration: 0.5 })
    .to('#intro', { opacity: 0, duration: 0.3, ease: 'none' });
}

/** Sets every logo part to its finished state (used by the short intro). */
function setFinal() {
  gsap.set(['#m-ring-a', '#m-ring-b', '#m-gauge-arc', '#m-mane-1', '#m-mane-2', '#m-mane-3'], { strokeDasharray: 1, strokeDashoffset: 0 });
  gsap.set('.m-tick', { scale: 1, opacity: 1 });
}

function short(rt: Rt) {
  setFinal();
  gsap.set('#intro-mark-wrap', { opacity: 0, scale: 0.9 });
  gsap.set(splitOf(rt).chars, { yPercent: 110, opacity: 0 });
  gsap.set('#m-shock', { opacity: 0 });
  const mark = must<HTMLElement>('#intro-mark-wrap');
  const tl = gsap.timeline({ onComplete: () => dock(rt, 1.4) });
  rt.tls.push(tl);
  tl.to('#intro-mark-wrap', { opacity: 1, scale: 1, duration: 0.25, ease: EASE.emphasis }, 0)
    .fromTo('#m-shock', { attr: { r: 20 }, opacity: 0.9 }, { attr: { r: 200 }, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, 0.05)
    .to(splitOf(rt).chars, { yPercent: 0, opacity: 1, duration: 0.4, stagger: 0.02, ease: EASE.emphasis }, 0.25)
    .call(() => { const r = mark.getBoundingClientRect(); rt.sparks?.burst(r.left + r.width / 2, r.top + (r.height * 16) / 420, 20); }, [], 0.05);
}

function forge(rt: Rt) {
  const markWrap = must<HTMLElement>('#intro-mark-wrap');
  const ticks = gsap.utils.toArray<SVGLineElement>('.m-tick');
  const strokes = ['#m-ring-a', '#m-ring-b', '#m-gauge-arc', '#m-mane-1', '#m-mane-2', '#m-mane-3'];
  const chars = splitOf(rt).chars;

  // Initial states (all before first visible frame: the stage is visibility:hidden until state=running).
  gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(ticks, {
    scale: 0, opacity: 0.35,
    svgOrigin: (_i: number, el: Element) => `${el.getAttribute('x2')} ${el.getAttribute('y2')}`, // grows from the inner end
  });
  gsap.set('#m-dot', { y: -70, opacity: 0, svgOrigin: '276 284' });
  gsap.set('#m-needle', { opacity: 0, rotation: -62, svgOrigin: `${SVG_CX} ${SVG_CY}` });
  gsap.set('#m-horn-clip-rect', { attr: { y: 281, height: 0 } });
  gsap.set('#m-shock', { opacity: 0, attr: { r: 20 } });
  gsap.set('#m-spark', { opacity: 0, scale: 0, svgOrigin: `${SVG_CX} ${SVG_CY}` });
  gsap.set(chars, { yPercent: 110, opacity: 0, x: (i: number) => (i - 5.5) * 1.4 });

  const tl = gsap.timeline({ defaults: { ease: EASE.standard } });
  rt.tls.push(tl);
  if (rt.slow) tl.timeScale(0.25);

  // B0 spark
  tl.to('#m-spark', { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(3)' }, 0)
    .to('#m-spark', { scale: 0, opacity: 0, duration: 0.15, ease: 'power2.in' }, 0.2);
  // B1 ring: both halves draw from the top gap edges toward the bottom
  tl.to(['#m-ring-a', '#m-ring-b'], { strokeDashoffset: 0, duration: 1.2, ease: EASE.draw }, 0.3);
  // B2 gauge arc
  tl.to('#m-gauge-arc', { strokeDashoffset: 0, duration: 0.9, ease: EASE.draw }, 0.45);
  // B3 ticks grow, then brighten as the needle sweeps past
  tl.to(ticks, { scale: 1, duration: 0.18, stagger: 0.012 }, 0.7);
  const NEEDLE_START = 0.72;
  const NEEDLE_SPAN = 0.95;
  tl.to('#m-needle', { opacity: 0.9, duration: 0.1 }, NEEDLE_START)
    .to('#m-needle', { rotation: 88, duration: NEEDLE_SPAN, ease: 'none' }, NEEDLE_START)
    .to('#m-needle', { opacity: 0, duration: 0.15 }, NEEDLE_START + NEEDLE_SPAN - 0.05);
  ticks.forEach((t) => {
    const angle = Number(t.dataset.angle);
    const when = NEEDLE_START + (NEEDLE_SPAN * (angle + 62)) / 150;
    tl.to(t, { opacity: 1, duration: 0.18 }, when);
  });
  // B4 mane
  tl.to(['#m-mane-1', '#m-mane-2', '#m-mane-3'], { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: EASE.draw }, 1.1);
  // B5 dot drops and lands with a tiny squash
  tl.to('#m-dot', { opacity: 1, y: 0, duration: 0.4, ease: 'bounce.out' }, 1.5)
    .to('#m-dot', { scaleY: 0.85, duration: 0.04, yoyo: true, repeat: 1 }, 1.84);
  // B6 horn rises: clip rect grows upward from the base so the seam stays crisp
  tl.to('#m-horn-clip-rect', { attr: { y: 0, height: 281 }, duration: 0.6, ease: EASE.emphasis }, 1.7);
  // B7 pierce: shockwave, sparks, small shake
  tl.fromTo('#m-shock', { attr: { r: 20 }, opacity: 0.9 }, { attr: { r: 260 }, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false }, 2.1)
    .call(() => {
      const r = markWrap.getBoundingClientRect();
      rt.sparks?.burst(r.left + r.width * 0.5, r.top + (r.height * 16) / 420, 36);
    }, [], 2.1)
    .to('#intro-stage', { x: '+=2', y: '-=2', duration: 0.05, repeat: 5, yoyo: true, ease: 'none' }, 2.1)
    .set('#intro-stage', { x: 0, y: 0 }, 2.4);
  // B8 wordmark letters rise and converge; flat scan bar crosses once
  tl.to(chars, { yPercent: 0, opacity: 1, x: 0, duration: 0.6, stagger: 0.035, ease: EASE.emphasis }, 2.2);
  const clipW = q<HTMLElement>('#intro-word-clip')?.offsetWidth ?? 300;
  tl.fromTo('#intro-scan', { x: -10, opacity: 0.7 }, { x: clipW + 10, opacity: 0, duration: 0.6, ease: 'power2.inOut', immediateRender: false }, 2.4);
  // B9 hold
  tl.to({}, { duration: 0.35 });

  tl.eventCallback('onComplete', () => dock(rt, 1));
}

/**
 * Dock: built fresh at the moment it is needed so measurements are right even if the window was resized.
 * The flying clone stays above the curtains until they have parted, then hands off to the real header logo in
 * the same frame. (Handing off earlier would hide the logo behind the still-closed curtain.)
 */
function dock(rt: Rt, rate: number) {
  if (rt.done) return;
  const markWrap = must<HTMLElement>('#intro-mark-wrap');
  const hdrIcon = q<SVGElement>('#site-logo-icon');
  const hdrWordEl = q<HTMLElement>('#site-logo-word');
  if (!hdrIcon || !hdrWordEl) return end(rt, true);

  gsap.set('#intro-word-clip', { overflow: 'visible' }); // letters must not be clipped in flight
  rt.hdrSplit = SplitText.create(hdrWordEl, { type: 'chars', charsClass: 'char' });
  const hdrChars = rt.hdrSplit.chars as HTMLElement[];

  const from = markWrap.getBoundingClientRect();
  const to = hdrIcon.getBoundingClientRect();
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const s = to.width / from.width;

  const tl = gsap.timeline({ defaults: { ease: EASE.inOut }, onComplete: () => end(rt, true) });
  rt.tls.push(tl);
  tl.timeScale(rate * (rt.slow ? 0.25 : 1));

  // Mark: curved cubic flight. A proxy value drives x/y/scale so the overshoot can layer on top without fighting.
  const p0 = { x: 0, y: 0 };
  const p1 = { x: -from.width * 0.35, y: -from.height * 0.2 }; // swing out and up
  const p2 = { x: dx * 0.55, y: dy + from.height * 0.3 };      // dive in from below
  const p3 = { x: dx, y: dy };
  const prox = { t: 0, k: 1 };
  const render = () => {
    const t = prox.t, u = 1 - t;
    const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
    const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
    gsap.set(markWrap, { x, y, scale: (1 + (s - 1) * t) * prox.k });
  };
  tl.to(prox, { t: 1, duration: 0.8, onUpdate: render }, 0);

  // Ring-only spin: 540deg resolving to 0, decelerating.
  tl.fromTo('#m-ring-group', { rotation: 540, svgOrigin: `${SVG_CX} ${SVG_CY}` }, { rotation: 0, duration: 1.0, ease: 'expo.out' }, 0);

  // Letters peel off and land on the header wordmark's exact character boxes.
  const chars = splitOf(rt).chars as HTMLElement[];
  chars.forEach((c, i) => {
    const target = hdrChars[i];
    if (!target) return;
    const cr = c.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    tl.to(c, {
      x: gsap.getProperty(c, 'x') as number + (tr.left + tr.width / 2 - (cr.left + cr.width / 2)),
      y: (gsap.getProperty(c, 'y') as number) + (tr.top + tr.height / 2 - (cr.top + cr.height / 2)),
      scale: tr.width / cr.width,
      duration: 0.8,
    }, 0.05 + i * 0.02);
  });

  // Snap: small overshoot with a 2px click, then the pulse ring and sparks.
  tl.to(prox, { k: 1.14, duration: 0.1, ease: 'power2.out', onUpdate: render }, 0.72)
    .to(prox, { k: 1, duration: 0.28, ease: EASE.snap, onUpdate: render }, 0.82)
    .to(markWrap, { y: '+=2', duration: 0.05, yoyo: true, repeat: 1, ease: 'none' }, 0.82)
    .call(() => {
      pulse(to);
      rt.sparks?.burst(to.left + to.width / 2, to.top + to.height / 2, 12, { speed: 300, life: 0.5 });
    }, [], 0.82);

  // Seam split: curtains part along the vertical centre line.
  tl.to('.intro__curtain--left', { xPercent: -101, duration: 0.7, ease: 'expo.inOut' }, 0.8)
    .to('.intro__curtain--right', { xPercent: 101, duration: 0.7, ease: 'expo.inOut' }, 0.8);
  tl.call(() => document.dispatchEvent(new CustomEvent('bu:hero:reveal')), [], 0.9);

  // Hand-off: real header logo on, clone off, same frame, once the curtains have cleared the header.
  tl.call(() => {
    // Only the logo reveal changes here. `is-intro` (and its scrollbar-gutter) stays until finish, otherwise the
    // fixed overlay would widen and re-centre the clone by half a scrollbar width.
    document.documentElement.classList.add('intro-handoff');
    gsap.set([markWrap, '#intro-word'], { autoAlpha: 0 });
    rt.hdrSplit?.revert();
    rt.hdrSplit = null;
  }, [], 1.5);
  tl.to({}, { duration: 0.1 }, 1.5); // release beat (B14)
}

function pulse(target: DOMRect) {
  const ring = document.createElement('div');
  ring.className = 'intro__pulse';
  Object.assign(ring.style, {
    position: 'fixed', left: `${target.left + target.width / 2}px`, top: `${target.top + target.height / 2}px`,
    width: `${target.width}px`, height: `${target.width}px`, marginLeft: `${-target.width / 2}px`, marginTop: `${-target.width / 2}px`,
    border: '2px solid var(--bu-gold-500)', borderRadius: '50%', pointerEvents: 'none', zIndex: '9200',
  });
  document.body.appendChild(ring);
  gsap.fromTo(ring, { scale: 1, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => ring.remove() });
}
