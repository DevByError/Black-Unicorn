'use client';
import { useEffect } from 'react';
import { finishIntro } from './finish';
import './intro.css';

// Guards React Strict Mode's double effect in development.
let started = false;

/**
 * Starts the intro after hydration. GSAP lives in a separate dynamically imported chunk so it never blocks
 * first paint (Part 13.13). If the chunk fails, the overlay is removed and the site is usable.
 * Accessibility contract: header/main/footer are `inert` while the intro runs; Skip intro takes focus.
 */
export function IntroController() {
  useEffect(() => {
    const mode = document.documentElement.getAttribute('data-intro');
    if (started) return;
    started = true;
    if (mode !== 'full' && mode !== 'short' && mode !== 'reduced') {
      finishIntro(false);
      return;
    }
    import('./runtime')
      .then((m) => m.startIntro(mode))
      .catch(() => finishIntro(false));
  }, []);
  return null;
}
