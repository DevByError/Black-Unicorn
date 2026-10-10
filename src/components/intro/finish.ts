import { writeLocal, writeSession } from '@/lib/storage';

/**
 * Shared end-of-intro cleanup. Imports no GSAP so the "skip" path costs nothing. Safe to call more than once.
 * `played` is false when the intro never ran (skip / return in same session).
 */
export function finishIntro(played: boolean, extraCleanup?: () => void) {
  const root = document.documentElement;
  if (root.getAttribute('data-intro') === 'done') return;
  extraCleanup?.();
  root.classList.remove('is-intro', 'intro-handoff');
  // Only the three page regions the intro made inert: carousel slides etc. use inert for their own reasons.
  document.querySelectorAll('body > header, body > main, body > footer').forEach((n) => n.removeAttribute('inert'));
  document.getElementById('intro')?.remove();
  document.getElementById('intro-skip')?.remove();
  document.querySelectorAll('.intro__pulse').forEach((n) => n.remove());
  writeSession('bu:intro-session', '1');
  if (played) writeLocal('bu:intro-last', String(Date.now()));
  root.setAttribute('data-intro', 'done');
  document.dispatchEvent(new CustomEvent('bu:intro:done'));
  document.dispatchEvent(new CustomEvent('bu:hero:reveal')); // idempotent
  const live = document.getElementById('live-region');
  if (live && played) live.textContent = 'BlackUnicorn';
  if (played) (document.getElementById('main') as HTMLElement | null)?.focus({ preventScroll: true });
}
