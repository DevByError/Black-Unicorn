'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * On every client-side route change: scroll to the top (Next skips this when the new page's first element is already on
 * screen, which leaves visitors mid-page), announce the new title politely and move focus to the page <h1>
 * (tabindex -1), so keyboard and screen-reader users land at the top of the new content (Part 16.7).
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const first = useRef(true);
  const popTarget = useRef<string | null>(null);
  // Back/forward keeps the browser's own scroll position; every other navigation starts at the top.
  useEffect(() => {
    const onPop = () => { popTarget.current = window.location.pathname; };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  // A link to the page you are already on (e.g. "Services" while on Services) changes no route, so Next does nothing: scroll up.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      const sameDocument = url.origin === window.location.origin && url.pathname === window.location.pathname;
      if (sameDocument && !url.hash && window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const viaHistory = popTarget.current === window.location.pathname;
    popTarget.current = null;
    if (!viaHistory && !window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const h1 = document.querySelector<HTMLElement>('main h1');
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    const live = document.getElementById('live-region');
    if (live) live.textContent = document.title;
  }, [pathname]);
  return null;
}
