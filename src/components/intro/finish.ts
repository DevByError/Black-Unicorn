/**
 * Shared end-of-intro cleanup. Imports no GSAP so the "skip" path costs nothing. Safe to call more than once.
 * `played` is false when the intro never ran or was cut short. Nothing is persisted: every page load replays the full intro.
 */
export function finishIntro(played: boolean, extraCleanup?: () => void) {
  const root = document.documentElement;
  if (root.getAttribute('data-intro') === 'done') return;
  extraCleanup?.();
  // A reload starts at the top of the page. The pre-paint script switched the browser's own scroll restoration off for
  // this load; give it back now so Back / Forward behave normally from here on.
  if (root.getAttribute('data-nav') === 'reload') window.scrollTo(0, 0);
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'auto'; } catch { /* ignore */ }
  root.classList.remove('is-intro', 'intro-handoff');
  // Only the three page regions the intro made inert: carousel slides etc. use inert for their own reasons.
  document.querySelectorAll('body > header, body > main, body > footer').forEach((n) => n.removeAttribute('inert'));
  document.getElementById('intro')?.remove();
  root.setAttribute('data-intro', 'done');
  document.dispatchEvent(new CustomEvent('bu:intro:done'));
  document.dispatchEvent(new CustomEvent('bu:hero:reveal')); // idempotent
  const live = document.getElementById('live-region');
  if (live && played) live.textContent = 'BlackUnicorn';
  if (played) (document.getElementById('main') as HTMLElement | null)?.focus({ preventScroll: true });
}
