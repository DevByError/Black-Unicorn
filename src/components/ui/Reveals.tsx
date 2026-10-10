'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * One IntersectionObserver for every [data-reveal] element on the page. Reveals play once. The hidden state is CSS-only
 * and exists only under html.js-motion, so no-JS and reduced-motion visitors never see content hidden (Part 12.3).
 * Stagger: set data-reveal-index; delay is index * 60ms, capped.
 */
export function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const i = Math.min(Number(el.dataset.revealIndex ?? 0), 8);
          el.style.setProperty('--reveal-delay', `${i * 60}ms`);
          el.classList.add('is-in');
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
