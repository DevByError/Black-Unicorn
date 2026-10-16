'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * One IntersectionObserver for every [data-reveal] element on the page. Reveals play once. The hidden state is CSS-only
 * and exists only under html.js-motion, so no-JS and reduced-motion visitors never see content hidden (Part 12.3).
 * Stagger: set data-reveal-index; delay is index * 60ms, capped.
 *
 * Content that mounts after first paint (the Suspense-wrapped work grid, filtered lists, route changes) is picked up by
 * a MutationObserver, so a late-mounted card can never stay at opacity 0.
 */
export function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
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
    const watch = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches('[data-reveal]:not(.is-in)')) io.observe(root);
      root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    };
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => { if (n.nodeType === 1) watch(n as HTMLElement); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
  return null;
}
