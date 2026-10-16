import { finishIntro } from './finish';

export type IntroMode = 'full' | 'reduced';

/** Spaces in the file names are percent-encoded. Portrait screens get Mobile; landscape (laptops, desktops, phones turned sideways) get PC. */
const SRC = { pc: '/videos/Gold%20Ribbons_PC.mp4', mobile: '/videos/Gold%20Ribbons_Mobile.mp4' } as const;
/** The last frame of each video, used where playing a video would be wrong (reduced motion, data saver). */
const END = { pc: '/videos/intro-end-pc.webp', mobile: '/videos/intro-end-mobile.webp' } as const;
/** If the video has not started playing by then (slow network, blocked, unsupported format) the site is shown instead. */
const START_TIMEOUT_MS = 5000;
const HOLD_AFTER_END_MS = 450;
const FADE_MS = 700;

interface Rt {
  done: boolean;
  played: boolean;
  timers: number[];
  cleanups: (() => void)[];
}

const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

export function startIntro(mode: IntroMode) {
  const overlay = el<HTMLElement>('intro');
  const video = el<HTMLVideoElement>('intro-video');
  if (!overlay || !video) return finishIntro(false);

  const rt: Rt = { done: false, played: false, timers: [], cleanups: [] };
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); rt.timers.push(id); return id; };
  const on = (t: HTMLElement | Window | Document, ev: string, fn: (e: Event) => void, opts?: AddEventListenerOptions) => {
    t.addEventListener(ev, fn, opts);
    rt.cleanups.push(() => t.removeEventListener(ev, fn));
  };

  const portrait = window.matchMedia('(orientation: portrait)').matches;
  const key = portrait ? 'mobile' : 'pc';
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const still = mode === 'reduced' || conn?.saveData === true;

  document.querySelectorAll('body > header, body > main, body > footer').forEach((n) => n.setAttribute('inert', ''));

  const end = (played: boolean) => {
    if (rt.done) return;
    rt.done = true;
    rt.timers.forEach((t) => window.clearTimeout(t));
    rt.cleanups.forEach((c) => c());
    finishIntro(played, () => { video.pause(); video.removeAttribute('src'); video.load(); });
  };

  /** Fade the overlay out over the real page, then clean up. `fast` is for Escape. */
  const leave = (fast = false) => {
    if (rt.done || overlay.classList.contains('is-leaving') || overlay.classList.contains('is-leaving-fast')) return;
    rt.played = true;
    document.documentElement.classList.add('intro-handoff'); // header logo appears under the fading video
    document.dispatchEvent(new CustomEvent('bu:hero:reveal'));
    overlay.classList.add(fast ? 'is-leaving-fast' : 'is-leaving');
    later(() => end(true), fast ? 320 : FADE_MS + 60);
  };

  on(window, 'keydown', (e) => { if ((e as KeyboardEvent).key === 'Escape') leave(true); });
  on(window, 'pagehide', () => end(false), { once: true });

  overlay.dataset.state = 'running';

  if (still) {
    // No motion: show the final logo frame briefly, then cross-fade to the site.
    video.poster = END[key];
    video.classList.add('is-ready');
    later(() => leave(), 900);
    later(() => end(false), 4000); // watchdog
    return;
  }

  // Never trap a visitor: no playback within a few seconds means the site is shown instead.
  const startTimer = later(() => end(false), START_TIMEOUT_MS);
  on(video, 'error', () => end(false));
  on(video, 'playing', () => {
    window.clearTimeout(startTimer);
    video.classList.add('is-ready');
    // Wall-clock backstop in case 'ended' never fires (tab throttled, decoder hiccup).
    const left = Number.isFinite(video.duration) ? video.duration - video.currentTime : 10;
    later(() => leave(), (left + 3) * 1000);
  }, { once: true });
  on(video, 'ended', () => { later(() => leave(), HOLD_AFTER_END_MS); });

  video.muted = true;
  video.src = SRC[key];
  video.play().catch(() => end(false)); // autoplay refused
}
