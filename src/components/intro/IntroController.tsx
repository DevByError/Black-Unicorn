'use client';
import { useEffect } from 'react';
import { finishIntro } from './finish';
import './intro.css';

// Guards React Strict Mode's double effect in development.
let started = false;

/**
 * Starts the intro after hydration. The runtime is a small dynamically imported chunk so it never blocks first paint.
 * If it fails to load, the overlay is removed and the site is usable.
 * Accessibility contract: header/main/footer are `inert` while the intro runs. Escape ends it early.
 */
export function IntroController() {
  useEffect(() => {
    const mode = document.documentElement.getAttribute('data-intro');
    // Reload: the browser may restore the old scroll position after the pre-paint script ran. Start at the top.
    if (document.documentElement.getAttribute('data-nav') === 'reload') window.scrollTo(0, 0);
    if (started) return;
    started = true;
    if (mode !== 'full' && mode !== 'reduced') {
      finishIntro(false);
      return;
    }
    import('./runtime')
      .then((m) => m.startIntro(mode))
      .catch(() => finishIntro(false));
  }, []);
  return null;
}
